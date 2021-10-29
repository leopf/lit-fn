import { TemplateResult } from "lit-html";
import { currentScope, popScope, pushIndexedScope, pushKeyedScope } from "./data";

export function comp<T>(compFn: (props: T) => TemplateResult, props: T, key?: unknown) {
    if (key === undefined) {
        pushIndexedScope();
    }
    else {
        pushKeyedScope(key);
    }

    let res: TemplateResult;
    if (currentScope!.cachedResult && 
            (!currentScope!.cachedResult.checkProps || 
            propsEqual(currentScope!.cachedResult.props || {}, props || {}))) {
        
        res = currentScope!.cachedResult.template;
    }
    else {
        res = compFn(props);
        currentScope!.setCache(res, props);
    }
    popScope();
    return res;
}
export function makeComponent<T = undefined>(compFn: (props: T) => TemplateResult) {
    return (props: T, key?: unknown) => {
        return comp(compFn, props, key);
    };
}

function propsEqual(a:any, b: any) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
        return false;
    }

    const keySet = new Set([ ...keysA, ...keysB ]);  
    if (keySet.size !== keysA.length) {
        return false;
    }

    for (const key of keysA) {
        if (a[key] !== b[key]) {
            return false;
        }
    }

    return true;
}