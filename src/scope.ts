import { TemplateResult } from "lit-html";
import { Context } from "./context";
import { currentScope, pushIndexedScope, pushKeyedScope, setScope } from "./data";
import { EventManager } from "./event-manager";

export interface IScopeResult {
    template: TemplateResult;
    props: any;
}

export class Scope extends EventManager {
    private contextCounter: number = 0;
    private subscopeCounter: number = 0;
    private usedSubscopeKeys: Set<unknown> = new Set();

    private indexSubscopes: Scope[] = [];
    private keySubscopes: Map<unknown, Scope> = new Map();

    private contexts: Context<any>[] = [];

    private _cachedResult?: IScopeResult;
    public get cachedResult() {
        return this._cachedResult;
    }

    private _superScope : Scope | undefined;
    public get superScope() : Scope | undefined {
        return this._superScope;
    }

    constructor(superScope?: Scope) {
        super();
        this._superScope = superScope;
    }

    private disposeIndexedSubscopes() {
        const unusedIndexedSubscopes = this.indexSubscopes.slice(this.subscopeCounter);
        unusedIndexedSubscopes.forEach(subscope => subscope.dispose());

        const usedIndexedSubscopes = this.indexSubscopes.slice(0, this.subscopeCounter);
        this.indexSubscopes = usedIndexedSubscopes;
    }

    private disposeKeyedSubscopes() {
        const unusedKeyedSubscopes: [unknown, Scope][] = [];
        const usedKeyedSubscopes: [unknown, Scope][] = [];

        for (const entry of Array.from(this.keySubscopes.entries())) {
            if (this.usedSubscopeKeys.has(entry[0])) {
                usedKeyedSubscopes.push(entry);
            }
            else {
                unusedKeyedSubscopes.push(entry);
            }
        }

        unusedKeyedSubscopes.forEach(([,subscope]) => subscope.dispose());
        this.keySubscopes = new Map(usedKeyedSubscopes);
    }

    public setCache(template: TemplateResult, props: any) {
        this._cachedResult = {
            props: props,
            template
        };
    }
    public resetCache(deep: boolean = false) {
        this._cachedResult = undefined;

        if (deep) {
            this.indexSubscopes.forEach(scope => scope.resetCache(true));
            this.keySubscopes.forEach(scope => scope.resetCache(true));
        }
    }
    public dispose() {
        this.indexSubscopes.forEach(subscope => subscope.dispose());
        Array.from(this.keySubscopes.values()).forEach(subscope => subscope.dispose());
        this.contexts.forEach(context => context.dispose());
    }
    public close() {
        this.indexSubscopes.forEach(subscope => subscope.close());
        Array.from(this.keySubscopes.values()).forEach(subscope => subscope.close());

        this.disposeIndexedSubscopes();
        this.disposeKeyedSubscopes();

        this.contextCounter = 0;
        this.subscopeCounter = 0;
        this.usedSubscopeKeys = new Set();
    }

    public emit(event: string, msg: any) {
        if (event === "update") {
            this.resetCache(msg === this);
        }

        if (this.superScope) {
            this.superScope.emit(event, msg);
        }
        else {
            this.innerEmit(event, msg);
        }
    }

    public pushIndexedScope() {
        if (this !== currentScope && currentScope) {
            throw "Memory leak!";
        }
        if (!currentScope) {
            setScope(this);
        }
        pushIndexedScope();       
    }
    public pushKeyedScope(key: unknown) {
        if (this !== currentScope && currentScope) {
            throw "Memory leak!";
        }
        if (!currentScope) {
            setScope(this);
        }
        pushKeyedScope(key);       
    }

    public getKeyedSubscope(key: unknown) {
        if (!this.keySubscopes.has(key)) {
            this.keySubscopes.set(key, new Scope(this));
        }
        this.usedSubscopeKeys.add(key);
        return this.keySubscopes.get(key)!;
    }
    public nextSubscope() {
        let scope: Scope;

        if (this.indexSubscopes.length > this.subscopeCounter) {
            scope = this.indexSubscopes[this.subscopeCounter];
        }
        else if (this.indexSubscopes.length == this.subscopeCounter) {
            const newScope = new Scope(this);
            this.indexSubscopes.push(newScope);
            scope = newScope;
        }
        else {
            throw "Memory leak!";
        }

        this.subscopeCounter++;
        return scope;
    }
    public nextContext() {
        let context: Context<any>;

        if (this.contexts.length > this.contextCounter) {
            context = this.contexts[this.contextCounter];
        }
        else if (this.contexts.length == this.contextCounter) {
            const newContext = new Context<any>(this);
            this.contexts.push(newContext);
            context = newContext;
        }
        else {
            throw "Memory leak!";
        }

        this.contextCounter++;
        return context;
    }
}
