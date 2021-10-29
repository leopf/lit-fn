import { render, TemplateResult } from "lit-html";
import { currentScope, popScope, setScope } from "./data";
import { Scope } from "./scope";

export * from "./directives";
export * from "./hooks";
export * from "./component";

export function renderToElement(el: (props: undefined) => TemplateResult, container: HTMLElement) {
    const scope = new Scope();
    let isRendering: boolean = false;
    let rerenderRequired: boolean = false;

    const renderFn = () => {
        setScope(scope);
        const template = el(undefined);
        if (currentScope?.superScope) {
            throw new Error("Memory leak");
        }
        popScope();
        render(template, container);
        scope.close();
    };

    const renderFnOuter = () => {
        if (isRendering) {
            rerenderRequired = true;
        }
        else {
            isRendering = true;
            renderFn();
            isRendering = false;

            if (rerenderRequired) {
                rerenderRequired = false;
                renderFnOuter();
            }
        }
    };

    scope.on("update", () => {
        renderFnOuter();
    });
    renderFnOuter();
}
