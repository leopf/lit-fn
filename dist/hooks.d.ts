declare type SetStatePVHandler<T> = (pv: T) => T;
declare type SetStateHandler<T> = SetStatePVHandler<T> | T;
export declare class LitRef<T = Element> {
    private onUpdate;
    private _value;
    get value(): T | undefined;
    set value(v: T | undefined);
    constructor(onUpdate: () => void);
}
export declare function useState<T>(defaultValue: T): [T, (v: SetStateHandler<T>) => void];
export declare function useEffect(effect: () => (void | (() => void)), reactTo?: unknown[]): void;
export declare function useMemo<T>(factory: () => T, reactTo: unknown[]): T;
export declare function useRef<T = HTMLElement>(): LitRef<T>;
export {};
