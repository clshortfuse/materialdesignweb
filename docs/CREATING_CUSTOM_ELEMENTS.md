# CustomElement – A Composition‑Based Web Component Base Class

This module exports a single class `CustomElement` that extends the native `HTMLElement`.  It provides a **fluent, chainable API** for building web components with:

- **Reactive properties** (`observe`) – automatically create getters/setters and trigger re‑renders.
- **Template literals** (`html``) – define the component’s markup with interpolation of reactive values.
- **Scoped styles** (`css``) – add CSS that is scoped to the shadow DOM.
- **Automatic registration** (`autoRegister`) – register the element name with `customElements.define`.

The API is intentionally lightweight and composable, so you can extend a component multiple times or mix in additional behavior.

## Syntax Overview

```js
import CustomElement from './CustomElement.js';

export default CustomElement
  .extend()                     // Extend base class
  .observe({                    // Declare reactive properties
    propName: 'type',           // simple type string or an options object
    anotherProp: { type:'string', empty:'' }
  })
  .html`                         // Template literal – use `{prop}` for interpolation
    <div>{label}</div>
  `
  .css`                          // Scoped CSS
    :host { display:block; }
  `
  .autoRegister('my-element');   // Register with the browser
```

### Detailed Method Explanations

Below is a deeper dive into each of the core methods exposed by `CustomElement`.  The goal is to give developers a clear mental model of how the fluent API works and what side‑effects each call has.

#### `extend()`
`extend()` returns a **new subclass** of the class it is called on. It does not mutate the original constructor; instead, you receive a fresh prototype chain that inherits all static methods and instance behavior.  This pattern mirrors how many modern libraries (e.g., LitElement) allow you to create isolated component families.

* **Why do we need a starting element?**
  * If you are building a brand‑new component from scratch, call `CustomElement.extend()` on the core class itself.  This gives you a clean base with no pre‑existing properties or templates.
  * If you want to build upon an existing custom element (e.g., extending `<mdw-icon-button>` from `<mdw-button>`), import that component and call `.extend()` on it:

    ```js
    import Button from './Button.js';
    export default Button.extend()
      .observe({ icon: 'string' })
      .html`<mdw-icon>{icon}</mdw-icon>`
      .autoRegister('my-icon-button');
    ```

  In this case, the new subclass inherits all behavior of `Button`, including its own reactive properties and template.

* **Chaining multiple extensions** is supported.  Each call creates a fresh subclass that can be further extended or modified.

#### `observe(props)`
`observe()` declares **reactive properties** on the component’s prototype.  The argument is an object mapping property names to either:

1. **A type string** – e.g., `'string'`, `'boolean'`, `'number'`.  The framework automatically creates a getter/setter that syncs with attributes and triggers re‑render.
2. **An options object** – `{ type: 'string', empty: '' }`.  `empty` specifies the default value when the attribute is missing or set to an empty string.
3. **A full `ObserverOptions` instance** – a custom configuration that can control reflection, parsing, change callbacks, and more.

The method returns the class itself, enabling fluent chaining. Internally it registers each property with the `Composition` system so that any access during rendering marks a dependency.

##### Custom ObserverOptions
You can supply a custom `ObserverOptions` object to fine‑tune behavior.  The framework ships several common types in `core/customTypes.js`, such as:

```js
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';
```

`EVENT_HANDLER_TYPE` is an `ObserverOptions` that turns a string attribute into an event listener function.  It handles parsing the string, creating a scoped function, and wiring it to the element’s events.

Example – the **Card** component uses both simple type strings and a custom type:

```js
export default Box
  .extend()
  // ...mixins...
  .observe({
    elevated: 'boolean',          // simple boolean property
    filled: 'boolean',            // another boolean
    actionable: 'boolean',        // flag that enables an action button
    actionLabel: 'string',        // label for the action button
    onaction: EVENT_HANDLER_TYPE, // custom type that turns `onaction="..."` into a listener
  })
```

Because `.observe()` accepts either strings or full option objects, you can mix and match as needed.

##### Type‑checking support
All of the JSDoc annotations in `CustomElement.js` are designed to work with TypeScript’s type inference.  When you write:

```js
  .observe({ foo: 'string' })
```

TypeScript will infer that instances have a property `foo` of type `string`.  If you provide an options object, the inferred type comes from the `type` field.  This gives you compile‑time safety while keeping the runtime lightweight.

#### ``html`` (tagged template literal)
This tag defines the component’s **shadow DOM markup**.  Interpolations like `{label}` are replaced with the current value of the corresponding reactive property.  The resulting `DocumentFragment` is cached and reused unless a reactive dependency changes.

* **Attribute interpolation** – You can pass properties to child components using syntax such as `x={x}` or `y={y}`; the framework will serialize the value appropriately.
* **Conditional rendering** – By returning `null` or an empty fragment from an expression, you can hide parts of the template.

#### ``css`` (tagged template literal)
Adds CSS that is scoped to the component’s shadow root.  The styles are inserted into a `<style>` element inside the shadow DOM, ensuring no leakage to the global stylesheet.

* **`:host` selector** – Targets the custom element itself.
* **Element selectors** – Target elements defined in the template.
* **Custom properties** – You can define and use CSS variables within the component.

#### `autoRegister(name)`
Registers the class with the browser’s `customElements` registry. If you omit this call, you must register manually using `customElements.define(name, YourClass)`.

#### Additional Utility Methods
While not part of the fluent chain, several static helpers are available:

* **`onPropChanged(options)`** – Register callbacks that run when a property changes.  The callback receives `(oldValue, newValue, element)`.
* **`onAttributeChanged(options)`** – Similar to `onPropChanged`, but for attribute changes.
* **`observeStatic(props)` / `defineStatic(props)`** – Define static properties or methods on the class itself.

These helpers are useful when you need fine‑grained control over lifecycle events without embedding logic in the template.

## Example: DemoPreviewCard

The following snippet from **DemoPreviewCard.js** demonstrates a typical usage pattern:

```js
import CustomElement from '../../core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    label: 'string',
    x: { type: 'string', empty: 'center' },
    y: { type: 'string', empty: 'center' }
  })
  .html`
    <mdw-card id=card role=region outlined x=stretch aria-labelledby=label>
      <mdw-title id=label text-padding=0 padding=16 aria-hidden=true>{label}</mdw-title>
      <mdw-divider></mdw-divider>
      <demo-preview id=preview gap=8 wrap x={x} y={y} padding=16 flex-1>
        <slot id=slot></slot>
      </demo-preview>
    </mdw-card>
  `
  .css`
    :host {
      display: flex;
      align-items: stretch; 
      flex-direction: column;
    }

    #card { flex: 1; }
  `
  .autoRegister('demo-preview-card');
```

- **Properties** – `label`, `x`, and `y` are reactive. Changing them updates the template automatically.
- **Template** – Uses `{label}` interpolation, and passes `x={x}`/`y={y}` to a child component.
- **Styles** – Scoped CSS ensures layout is applied only inside this component’s shadow DOM.
- **Registration** – The element becomes available as `<demo-preview-card>` in the document.

## Event Binding

The core of the event system is the **`.events()`** method.  It registers listeners on the *host element* (the custom element itself).  The keys are event names – plain DOM events (`click`, `input`) or custom events using the `{eventName}` syntax.

If you need to listen for events that originate from a **sub‑element** inside the component’s shadow DOM, use **`.childEvents()`**.  This method accepts an object whose keys are *tag names* (or property names that map to tag names via `attrNameFromPropName`).  For each tag it registers the supplied listeners on all matching elements.

There is also a convenience wrapper **`.rootEvents()`** which attaches listeners directly to the shadow root – useful for events that bubble from slotted content.

### Bind events by child element id:

```js
export default CustomElement
  .extend()
  .observe({ count: {type: 'integer', value: 0} })
  .html`
    <button id="btn">Clicks: {count}</button>
  ` 
  .childEvents({
    btn: {
      click(event) {
        this.count++;
      }
    }
  })
  .autoRegister('counter-button');
```

### Attribute‑based event binding with `on-` prefix

```js
export default CustomElement
  .extend()
  .observe({ count: {type: 'integer', nullable: false} })
  .methods({
    incrementCount(event) {
      this.count++;
    }
  })
  .html`
    <button id=btn on-click={incrementCount}>Clicks: {count}</button>
  `
  .autoRegister('counter-button');
```

Expressions are evaluated lazily – they run only when a reactive property used inside them changes.  This keeps the component efficient while still allowing complex derived state.

```js
export default CustomElement
  .extend()
  .observe({ count: { value: 0 } })
  .html`
    <button id=btn on-click="${function onClick() { this.count++; }}">Clicks: {count}</button>
  `
  .autoRegister('counter-button');
```

Custom events are also supported. For example, the `Menu` component listens for a custom cascade event from its items:

```js
.events({
  'mdw-menu-item:cascade'(event) {
    const menuItem = event.target;
    const subMenuId = event.detail;
    // ...handle submenu logic...
  }
})
```

## Expressions

`CustomElement` provides a lightweight way to define **computed properties** or helper functions that can be used inside the template.  The `.expressions()` method accepts an object where each key is a function name and the value is a function that receives the component instance (and optionally data).  These functions are automatically cached and re‑evaluated only when their dependencies change.

The return value of an expression can be a string, boolean, or `null`.  When used in the template with `{exprName}`, the framework will insert the returned value.  Expressions can also be bound to attributes using the same syntax – for example, `mdw-if={isVisible}`.

```js
export default CustomElement
  .extend()
  .observe({
    count: {type: 'integer', value: 0},
    step: { value: 1 }
  })
  .expressions({
    // Show a message only if the counter is even.
    isEven({ count }) {
      return count % 2 === 0;
    }
  })
  .methods({
    increment() {
      this.count += this.step;
    }
  })
  .html`
    <button id=btn on-click={increment}>Clicks: {count}</button>
    <p mdw-if={isEven}>The counter is even!</p>
  `
  .autoRegister('counter-button');
```



You can also use the `propChangedCallback` to react to multiple properties, as shown in the [ObserverOptions examples](./observe.md).

## Advanced Topics

- **Composition API** – `CustomElement` internally uses a `Composition` class to track which properties are accessed during rendering, enabling fine‑grained reactivity.
- **Property change callbacks** – You can hook into property changes via `onPropChanged()` or by defining methods in the component’s prototype that match the pattern `propertyNameChanged`.
- **Attribute mapping** – Attributes are automatically mapped to properties based on the `observe` configuration; custom attribute names can be specified with the `empty` option.

For more details, refer to the source code comments and the [Composition](../core/Composition.js) module.

## TypeScript Types & JSDoc

`CustomElement.js` uses **JSDoc generics** so that editors with TypeScript support can provide full IntelliSense.  Below is a plain‑English summary of the key typedefs you’ll encounter:

| Typedef                      | Purpose                                                                                                                                                                                                                     | How it’s used                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `ObserverPropertyType`       | Primitive or complex property descriptors understood by the framework (e.g., `'string'`, `'boolean'`, custom objects).                                                                                                      | Passed to `.observe()` and `.prop()` to declare reactive properties.                                                                            |
| `ParsedProps<T>`             | A mapped type that resolves each property in a component’s prototype to its *actual* runtime type.  It handles functions, observer options, and nested objects.                                                             | Returned by `.defineStatic()`; used by TypeScript to infer the shape of static properties.                                                      |
| `ObserverOptions<T1,T2,C>`   | Configuration object for an observable property: type, default value (`empty`), parsing logic, change callbacks, etc.  `T1` is the declared type string, `T2` is the inferred runtime type, and `C` is the component class. | Supplied to `.observe()` when you need custom behavior (e.g., event handlers).  The framework passes this object to `defineObservableProperty`. |
| `ClassOf<T>`                 | Utility that extracts the constructor type from a class instance.                                                                                                                                                           | Used in mixin signatures to preserve static typing across extensions.                                                                           |
| `Class<A extends any[]>`     | Generic for an abstract constructor with arbitrary arguments.                                                                                                                                                               | Allows `.extend()` and `.mixin()` to be typed correctly.                                                                                        |
| `HTMLTemplater<T1,T2>`       | Function type for the tagged template literal used in `.html`.  It receives a `TemplateStringsArray` and substitutions that can be strings, elements, or functions bound to the component instance.                         | Ensures that interpolations like `{label}` are typed as the correct property.                                                                   |
| `CallbackArguments<T1,T2>`   | Object passed to lifecycle callbacks (`onPropChanged`, `onAttributeChanged`, etc.).  Contains references to the composition, element refs, and helper functions for rendering.                                              | Provides a consistent API for custom logic inside callbacks.                                                                                    |
| `CompositionCallback<T1,T2>` | Describes the shape of lifecycle hooks (`composed`, `connected`, `props`, `attrs`).  Each hook receives the component instance and relevant options.                                                                        | Used internally by the framework to register callbacks during `.observe()` or `.define()`.                                                      |
| `IDLParameter<C>`            | Maps property names to either primitive types, observer options, or functions that return values.                                                                                                                           | Passed to `.observe()` when defining properties via an object literal.                                                                          |
| `ObjectOrObjectEntries<T>`   | Utility type that accepts either a plain object or an array of `[key, value]` tuples.  Useful for passing props in a flexible way.                                                                                          | Used by `.defineStatic()` and other helper methods.                                                                                             |

Because these types are expressed as JSDoc comments, you get **full IntelliSense** in editors that support TypeScript inference on JavaScript files.  When you write:

```js
export default CustomElement.observe({ foo: 'string' })
```

TypeScript will infer that instances have a property `foo` of type `string`.  If you provide an options object, the inferred type comes from its `type` field.  This gives you compile‑time safety while keeping the runtime lightweight.
