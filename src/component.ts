import { TemplateResult } from "lit-html";
import { popScope, pushIndexedScope } from "./data";

export function comp<T>(compFn: (props: T) => TemplateResult, props: T) {
    pushIndexedScope();
    const res = compFn(props);
    popScope();
    return res;
}
export function makeComponent<T = undefined>(compFn: (props: T) => TemplateResult) {
    return (props: T) => {
        return comp(compFn, props);
    };
}