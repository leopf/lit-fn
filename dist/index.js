"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderToElement = void 0;
var lit_html_1 = require("lit-html");
var data_1 = require("./data");
var scope_1 = require("./scope");
__exportStar(require("./directives"), exports);
__exportStar(require("./hooks"), exports);
__exportStar(require("./component"), exports);
function renderToElement(el, container) {
    var scope = new scope_1.Scope();
    var isRendering = false;
    var rerenderRequired = false;
    var renderFn = function () {
        (0, data_1.setScope)(scope);
        var template = el(undefined);
        if (data_1.currentScope === null || data_1.currentScope === void 0 ? void 0 : data_1.currentScope.superScope) {
            throw new Error("Memory leak");
        }
        (0, data_1.popScope)();
        (0, lit_html_1.render)(template, container);
        scope.close();
    };
    var renderFnOuter = function () {
        if (isRendering) {
            rerenderRequired = true;
        }
        else {
            isRendering = true;
            renderFn();
            isRendering = false;
            if (rerenderRequired) {
                rerenderRequired = false;
                renderFnOuter();
            }
        }
    };
    scope.on("update", function () {
        renderFnOuter();
    });
    renderFnOuter();
}
exports.renderToElement = renderToElement;
