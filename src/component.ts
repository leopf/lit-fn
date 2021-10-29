import { TemplateResult } from "lit-html";
import { currentScope, popScope, pushIndexedScope } from "./data";

export function comp<T>(compFn: (props: T) => TemplateResult, props: T) {
    pushIndexedScope();
    let res: TemplateResult;
    if (currentScope!.cachedResult) {
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
    return (props: T) => {
        return comp(compFn, props);
    };
}