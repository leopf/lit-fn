"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scope = void 0;
var context_1 = require("./context");
var data_1 = require("./data");
var event_manager_1 = require("./event-manager");
var Scope = /** @class */ (function (_super) {
    __extends(Scope, _super);
    function Scope(superScope) {
        var _this = _super.call(this) || this;
        _this.contextCounter = 0;
        _this.subscopeCounter = 0;
        _this.usedSubscopeKeys = new Set();
        _this.indexSubscopes = [];
        _this.keySubscopes = new Map();
        _this.contexts = [];
        _this._superScope = superScope;
        return _this;
    }
    Object.defineProperty(Scope.prototype, "superScope", {
        get: function () {
            return this._superScope;
        },
        enumerable: false,
        configurable: true
    });
    Scope.prototype.disposeIndexedSubscopes = function () {
        var unusedIndexedSubscopes = this.indexSubscopes.slice(this.subscopeCounter);
        unusedIndexedSubscopes.forEach(function (subscope) { return subscope.dispose(); });
        var usedIndexedSubscopes = this.indexSubscopes.slice(0, this.subscopeCounter);
        this.indexSubscopes = usedIndexedSubscopes;
    };
    Scope.prototype.disposeKeyedSubscopes = function () {
        var unusedKeyedSubscopes = [];
        var usedKeyedSubscopes = [];
        for (var _i = 0, _a = Array.from(this.keySubscopes.entries()); _i < _a.length; _i++) {
            var entry = _a[_i];
            if (this.usedSubscopeKeys.has(entry[0])) {
                usedKeyedSubscopes.push(entry);
            }
            else {
                unusedKeyedSubscopes.push(entry);
            }
        }
        unusedKeyedSubscopes.forEach(function (_a) {
            var subscope = _a[1];
            return subscope.dispose();
        });
        this.keySubscopes = new Map(usedKeyedSubscopes);
    };
    Scope.prototype.dispose = function () {
        this.indexSubscopes.forEach(function (subscope) { return subscope.dispose(); });
        Array.from(this.keySubscopes.values()).forEach(function (subscope) { return subscope.dispose(); });
        this.contexts.forEach(function (context) { return context.dispose(); });
    };
    Scope.prototype.close = function () {
        this.indexSubscopes.forEach(function (subscope) { return subscope.close(); });
        Array.from(this.keySubscopes.values()).forEach(function (subscope) { return subscope.close(); });
        this.disposeIndexedSubscopes();
        this.disposeKeyedSubscopes();
        this.contextCounter = 0;
        this.subscopeCounter = 0;
        this.usedSubscopeKeys = new Set();
    };
    Scope.prototype.emit = function (event, msg) {
        if (this.superScope) {
            this.superScope.emit(event, msg);
        }
        else {
            this.innerEmit(event, msg);
        }
    };
    Scope.prototype.pushIndexedScope = function () {
        if (this !== data_1.currentScope && data_1.currentScope) {
            throw "Memory leak!";
        }
        if (!data_1.currentScope) {
            (0, data_1.setScope)(this);
        }
        (0, data_1.pushIndexedScope)();
    };
    Scope.prototype.pushKeyedScope = function (key) {
        if (this !== data_1.currentScope && data_1.currentScope) {
            throw "Memory leak!";
        }
        if (!data_1.currentScope) {
            (0, data_1.setScope)(this);
        }
        (0, data_1.pushKeyedScope)(key);
    };
    Scope.prototype.getKeyedSubscope = function (key) {
        if (!this.keySubscopes.has(key)) {
            this.keySubscopes.set(key, new Scope(this));
        }
        this.usedSubscopeKeys.add(key);
        return this.keySubscopes.get(key);
    };
    Scope.prototype.nextSubscope = function () {
        var scope;
        if (this.indexSubscopes.length > this.subscopeCounter) {
            scope = this.indexSubscopes[this.subscopeCounter];
        }
        else if (this.indexSubscopes.length == this.subscopeCounter) {
            var newScope = new Scope(this);
            this.indexSubscopes.push(newScope);
            scope = newScope;
        }
        else {
            throw "Memory leak!";
        }
        this.subscopeCounter++;
        return scope;
    };
    Scope.prototype.nextContext = function () {
        var context;
        if (this.contexts.length > this.contextCounter) {
            context = this.contexts[this.contextCounter];
        }
        else if (this.contexts.length == this.contextCounter) {
            var newContext = new context_1.Context(this);
            this.contexts.push(newContext);
            context = newContext;
        }
        else {
            throw "Memory leak!";
        }
        this.contextCounter++;
        return context;
    };
    return Scope;
}(event_manager_1.EventManager));
exports.Scope = Scope;
