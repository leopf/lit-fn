"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setScope = exports.pushKeyedScope = exports.pushIndexedScope = exports.popScope = exports.currentScope = void 0;
exports.currentScope = undefined;
function popScope() {
    if (!exports.currentScope) {
        throw new Error("Memory leak!");
    }
    exports.currentScope = exports.currentScope.superScope;
}
exports.popScope = popScope;
function pushIndexedScope() {
    if (!exports.currentScope) {
        throw new Error("Memory leak!");
    }
    exports.currentScope = exports.currentScope.nextSubscope();
}
exports.pushIndexedScope = pushIndexedScope;
function pushKeyedScope(key) {
    if (!exports.currentScope) {
        throw new Error("Memory leak!");
    }
    exports.currentScope = exports.currentScope.getKeyedSubscope(key);
}
exports.pushKeyedScope = pushKeyedScope;
function setScope(s) {
    exports.currentScope = s;
}
exports.setScope = setScope;
