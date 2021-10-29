import { TemplateResult } from "lit-html";
export declare function comp<T>(compFn: (props: T) => TemplateResult, props: T): TemplateResult<2 | 1>;
export declare function makeComponent<T = undefined>(compFn: (props: T) => TemplateResult): (props: T) => TemplateResult<2 | 1>;
