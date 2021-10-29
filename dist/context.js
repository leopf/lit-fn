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
exports.getContext = exports.Context = void 0;
var data_1 = require("./data");
var event_manager_1 = require("./event-manager");
var Context = /** @class */ (function (_super) {
    __extends(Context, _super);
    function Context(scope) {
        var _this = _super.call(this) || this;
        _this._isInitialized = false;
        _this._scope = scope;
        return _this;
    }
    Object.defineProperty(Context.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (v) {
            this._data = v;
            this._isInitialized = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "isInitialized", {
        get: function () {
            return this._isInitialized;
        },
        enumerable: false,
        configurable: true
    });
    Context.prototype.updateScope = function () {
        this.scope.emit("update", undefined);
    };
    Context.prototype.dispose = function () {
        this.innerEmit("dispose", undefined);
    };
    return Context;
}(event_manager_1.EventManager));
exports.Context = Context;
function getContext() {
    if (!data_1.currentScope) {
        throw "Memory leak!";
    }
    return data_1.currentScope.nextContext();
}
exports.getContext = getContext;
