import { EventManager } from "./event-manager";
import { Scope } from "./scope";
export declare class Context<T> extends EventManager {
    private _scope;
    get scope(): Scope;
    private _data;
    get data(): T | undefined;
    set data(v: T | undefined);
    private _isInitialized;
    get isInitialized(): boolean;
    constructor(scope: Scope);
    updateScope(): void;
    dispose(): void;
}
export declare function getContext<T>(): Context<T>;
