import { ItemTemplate, KeyFn, repeat as litRepeat } from "lit-html/directives/repeat.js";
import { getContext } from "./context";
import { popScope, pushKeyedScope } from "./data";

export const repeat = <T>(items: Iterable<T>, keyFnOrTemplate: KeyFn<T>, template: ItemTemplate<T>) => {
    const context = getContext();

    return litRepeat(items, (item, index) => keyFnOrTemplate(item, index), (item, index) => {
        const itemKey = keyFnOrTemplate(item, index); 

        context.scope.pushKeyedScope(itemKey);
        const res = template(item, index);
        popScope();
        
        return res;
    })
}
