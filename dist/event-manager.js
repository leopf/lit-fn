"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
var EventManager = /** @class */ (function () {
    function EventManager() {
        this.handlers = new Map();
    }
    EventManager.prototype.on = function (event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event).push(handler);
    };
    EventManager.prototype.innerEmit = function (event, msg) {
        (this.handlers.get(event) || []).forEach(function (h) { return h.call(null, msg); });
    };
    return EventManager;
}());
exports.EventManager = EventManager;
