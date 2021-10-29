# Lit-Fn
A React-like hook implementation for lit-html.

**This package is not production ready. Many parts of lit-html especially directives are not fully tested.**

## Example
- Clone this Repository
- run ```npm i```
- run ```npm run start```

## Usage
### Components
```ts
const counter = makeComponent((props: {}) => {
    const [ counter, setCounter ] = useState(0);

    return html`
    <div>${counter}</div>
    <button @click=${() => setCounter(counter + 1)}>
    increase
    </button>
    `;
})
```

The ```makeComponent``` wrapper function is required, to seperate states and reduce key collisions and enable scoped rendering (future), when using the repeat directive. 

### Directives
There are some built-in directives in lit-html that cant be used directly with this library. This is mostly the case for conditional rendering directives, used to render subtemplates.

Currently only the ```repeat``` directive is implemented and must be imported from this package, instead of lit-html.

### Hooks
The following hooks are implemented:
- ```useState```

Example:
```ts
const [ counter, setCounter ] = useState(0);
```
- ```useEffect```

Example:
```ts
useEffect(() => {
    console.log("counter updated!");
}, [counter]);
```
- ```useMemo```

Example:
```ts
const counterSqrt = useMemo(() => {
    return Math.sqrt(counter);
}, [counter]);
```
- ```useRef```

Example:
```ts
const headerRef = useRef();
...
useEffect(() => {
    if (headerRef.value) {
        headerRef.value.innerHtml = "Counter (updated)";
    }
}, [headerRef.value]);
...
return html`
    <h1 ${ref(headerRef)}>Counter</h1>
    ...
`;
```




