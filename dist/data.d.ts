import { Scope } from "./scope";
export declare let currentScope: Scope | undefined;
export declare function popScope(): void;
export declare function pushIndexedScope(): void;
export declare function pushKeyedScope(key: unknown): void;
export declare function setScope(s: Scope): void;
