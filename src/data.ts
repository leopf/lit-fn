import { Scope } from "./scope";

export let currentScope: Scope | undefined = undefined;

export function popScope() {
    if (!currentScope) {
        throw new Error("Memory leak!");
    }

    currentScope = currentScope.superScope;
}
export function pushIndexedScope() {
    if (!currentScope) {
        throw new Error("Memory leak!");
    }

    currentScope = currentScope.nextSubscope();
}
export function pushKeyedScope(key: unknown) {
    if (!currentScope) {
        throw new Error("Memory leak!");
    }

    currentScope = currentScope.getKeyedSubscope(key);
}
export function setScope(s: Scope) {
    currentScope = s;
}