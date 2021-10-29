import { html } from "lit-html";
import { ref } from "lit-html/directives/ref.js";
import { useEffect, useRef, useState, repeat, renderToElement, makeComponent } from "../src/";

const counter = makeComponent((props: { onSort: () => void, onRemoveLast: () => void }) => {
    const [ counter, setCounter ] = useState(0);

    useEffect(() => {
        console.log("counter updated!");
        if (counter === 10) {
            props.onSort.call(null);
        }
        if (counter === 12) {
            props.onRemoveLast.call(null);
        }
    }, [counter]);

    return html`
    <div>${counter}</div>
    <button @click=${() => {
        console.log("inc");
        setCounter(counter + 1);
    }}>increase</button>
    `;
})

const testComp = makeComponent(() => {
    const [ items, setItems ] = useState([
        {
            name: "Liam"
        }, 
        {
            name: "Noah"
        }, 
        {
            name: "Oliver"
        }
    ]);

    const headerRef = useRef();
    
    useEffect(() => {
        console.log(headerRef.value);
    }, [headerRef.value]);

    const sort = () => {
        console.log("sorting!");
        setItems(pv => pv.slice().sort((a, b) => a.name.localeCompare(b.name)));
    };
    const removeLast = () => {
        setItems(items.slice(0, items.length - 1));
    };

    return html`
    <h1 @click=${() => sort()} ${ref(headerRef)}>Sortable counters</h1>
    ${repeat(items, item => item.name, item => html`
    <h3>${item.name}</h3>
    ${counter({
        onRemoveLast: removeLast,
        onSort: sort
    })}
    `)}`;
})

renderToElement(testComp, document.getElementById("root")!);