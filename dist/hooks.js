"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRef = exports.useMemo = exports.useEffect = exports.useState = exports.LitRef = void 0;
var context_1 = require("./context");
var LitRef = /** @class */ (function () {
    function LitRef(onUpdate) {
        this.onUpdate = onUpdate;
    }
    Object.defineProperty(LitRef.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
            this.onUpdate.call(null);
        },
        enumerable: false,
        configurable: true
    });
    return LitRef;
}());
exports.LitRef = LitRef;
function useConstant(factory) {
    var context = (0, context_1.getContext)();
    if (!context.isInitialized) {
        context.data = factory(context);
    }
    return context.data;
}
// DOES NOT WORK WITH FUNCTIONS
function useState(defaultValue) {
    var context = (0, context_1.getContext)();
    if (!context.isInitialized) {
        context.data = defaultValue;
    }
    var setValue = function (handler) {
        var value;
        if (typeof handler === "function") {
            value = handler(context.data);
        }
        else {
            value = handler;
        }
        if (context.data !== value) {
            context.data = value;
            context.updateScope();
        }
    };
    return [context.data, setValue];
}
exports.useState = useState;
function useEffect(effect, reactTo) {
    var _a, _b, _c;
    var context = (0, context_1.getContext)();
    if (!context.isInitialized) {
        context.on("dispose", function () {
            var _a, _b;
            (_b = (_a = context.data) === null || _a === void 0 ? void 0 : _a.disposer) === null || _b === void 0 ? void 0 : _b.call(null);
        });
    }
    var pvReactData = (_a = context.data) === null || _a === void 0 ? void 0 : _a.reactTo;
    if (!pvReactData || !reactTo || pvReactData.length !== reactTo.length || pvReactData.findIndex(function (item, idx) { return item !== reactTo[idx]; }) !== -1) {
        (_c = (_b = context.data) === null || _b === void 0 ? void 0 : _b.disposer) === null || _c === void 0 ? void 0 : _c.call(null);
        var possibleDisposer = effect();
        if (typeof possibleDisposer == "function") {
            context.data = {
                reactTo: reactTo,
                disposer: possibleDisposer
            };
        }
        else {
            context.data = {
                reactTo: reactTo
            };
        }
    }
}
exports.useEffect = useEffect;
function useMemo(factory, reactTo) {
    var _a = useState(factory()), state = _a[0], setState = _a[1];
    useEffect(function () { return setState(factory()); }, reactTo);
    return state;
}
exports.useMemo = useMemo;
function useRef() {
    return useConstant(function (ctx) { return new LitRef(function () { return ctx.updateScope(); }); });
}
exports.useRef = useRef;
