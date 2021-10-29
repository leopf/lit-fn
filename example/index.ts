import { html } from "lit-html";
import { ref } from "lit-html/directives/ref.js";
import { useEffect, useRef, useState, repeat, renderToElement, makeComponent } from "../src/";

const buttonAlerter = makeComponent((props: {}) => {
    return html`<button @click=${() => window.alert("You made a mistake!")}>DONT PRESS ME</button>`;
});

const counter = makeComponent((props: { onSort: () => void, onRemoveLast: () => void }) => {
    const [ count, setCount ] = useState(0);

    useEffect(() => {
        console.log("counter updated!");
        if (count === 10) {
            props.onSort.call(null);
        }
        if (count === 12) {
            props.onRemoveLast.call(null);
        }
    }, [count]);

    return html`
    <div>${count}</div>
    <button @click=${() => {
        console.log("inc");
        setCount(count + 1);
    }}>increase</button>
    ${buttonAlerter({})}
    `;
})

const testComp = makeComponent(() => {
    const [ items, setItems ] = useState([
        {
            name: "Liam"
        }, 
        {
            name: "Oliver"
        },
        {
            name: "Noah"
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