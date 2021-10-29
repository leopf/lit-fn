"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repeat = void 0;
var repeat_js_1 = require("lit-html/directives/repeat.js");
var context_1 = require("./context");
var data_1 = require("./data");
var repeat = function (items, keyFnOrTemplate, template) {
    var context = (0, context_1.getContext)();
    return (0, repeat_js_1.repeat)(items, function (item, index) { return keyFnOrTemplate(item, index); }, function (item, index) {
        var itemKey = keyFnOrTemplate(item, index);
        context.scope.pushKeyedScope(itemKey);
        var res = template(item, index);
        (0, data_1.popScope)();
        return res;
    });
};
exports.repeat = repeat;
