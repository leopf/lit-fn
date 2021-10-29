import { currentScope } from "./data";
import { EventManager } from "./event-manager";
import { Scope } from "./scope";

export class Context<T> extends EventManager {
    private _scope : Scope;
    public get scope() : Scope {
        return this._scope;
    }

    private _data : T | undefined;
    public get data() : T | undefined {
        return this._data;
    }
    public set data(v : T | undefined) {
        this._data = v;
        this._isInitialized = true;
    }
    
    private _isInitialized : boolean = false;
    public get isInitialized() : boolean {
        return this._isInitialized;
    }

    constructor(scope: Scope) {
        super();
        this._scope = scope;
    }

    public updateScope() {
        this.scope.emit("update", undefined);
    }
    public dispose() {
        this.innerEmit("dispose", undefined);
    }
}

export function getContext<T>() {
    if (!currentScope) {
        throw "Memory leak!";
    }
    return currentScope.nextContext() as Context<T>;
}
