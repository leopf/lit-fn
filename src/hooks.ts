import { Context, getContext } from "./context";
import { createRef, Ref, ref } from 'lit-html/directives/ref.js';

interface IEffectData {
    reactTo: unknown[] | undefined;
    disposer?: () => void;
}

type SetStatePVHandler<T> = (pv: T) => T;
type SetStateHandler<T> = SetStatePVHandler<T> | T;

export class LitRef<T = Element> {
    private onUpdate: () => void;
    
    private _value : T | undefined;
    public get value() : T | undefined {
        return this._value;
    }
    public set value(v : T | undefined) {
        this._value = v;
        this.onUpdate.call(null);

    }

    constructor(onUpdate: () => void) {
        this.onUpdate = onUpdate;
    }
}

function useConstant<T>(factory: (context: Context<T>) => T) {
    const context = getContext<T>();
    if (!context.isInitialized) {
        context.data = factory(context);
    }
    return context.data!;
}

// DOES NOT WORK WITH FUNCTIONS
export function useState<T>(defaultValue: T) {
    const context = getContext<T>();
    
    if (!context.isInitialized) {
        context.data = defaultValue;
    }

    const setValue = (handler: SetStateHandler<T>) => {
        let value: T;
        if (typeof handler === "function") {
            value = (handler as SetStatePVHandler<T>)(context.data!);
        }
        else {
            value = handler;
        }
        if (context.data !== value) {
            context.data = value;
            context.updateScope();
        }
    };

    return [ context.data, setValue ] as [ T, (v: SetStateHandler<T>) => void ];
}

export function useEffect(effect: () => (void | (() => void)), reactTo?: unknown[]) {
    const context = getContext<IEffectData>();

    if (!context.isInitialized) {
        context.on("dispose", () => {
            context.data?.disposer?.call(null);
        });
    }

    const pvReactData = context.data?.reactTo;

    if (!pvReactData || !reactTo || pvReactData.length !== reactTo.length || pvReactData.findIndex((item, idx) => item !== reactTo[idx]) !== -1) {
        context.data?.disposer?.call(null);

        const possibleDisposer = effect();
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

export function useMemo<T>(factory: () => T, reactTo: unknown[]) {
    const [ state, setState ] = useState<T>(factory());
    useEffect(() => setState(factory()), reactTo);
    return state;
}

export function useRef<T = HTMLElement>() {
    return useConstant<LitRef<T>>((ctx) => new LitRef<T>(() => ctx.updateScope()));
}