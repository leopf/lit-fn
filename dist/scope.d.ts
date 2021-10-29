import { Context } from "./context";
import { EventManager } from "./event-manager";
export declare class Scope extends EventManager {
    private contextCounter;
    private subscopeCounter;
    private usedSubscopeKeys;
    private indexSubscopes;
    private keySubscopes;
    private contexts;
    private _superScope;
    get superScope(): Scope | undefined;
    constructor(superScope?: Scope);
    private disposeIndexedSubscopes;
    private disposeKeyedSubscopes;
    dispose(): void;
    close(): void;
    emit(event: string, msg: any): void;
    pushIndexedScope(): void;
    pushKeyedScope(key: unknown): void;
    getKeyedSubscope(key: unknown): Scope;
    nextSubscope(): Scope;
    nextContext(): Context<any>;
}
