"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeComponent = exports.comp = void 0;
var data_1 = require("./data");
function comp(compFn, props) {
    (0, data_1.pushIndexedScope)();
    var res = compFn(props);
    (0, data_1.popScope)();
    return res;
}
exports.comp = comp;
function makeComponent(compFn) {
    return function (props) {
        return comp(compFn, props);
    };
}
exports.makeComponent = makeComponent;
