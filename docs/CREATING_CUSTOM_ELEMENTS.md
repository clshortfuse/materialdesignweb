# Creating Custom Elements

This guide focuses on authoring elements with `core/CustomElement.js`.
It covers state tracking, templates, events, and rendering.

## 1.0 Quick start (fluent API)

```js
import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    count: { type: 'integer', value: 0 },
    label: { type: 'string', value: 'Counter' },
  })
  .methods({
    inc() { this.count += 1; },
  })
  .html`
    <button id="btn" type="button" on-click={inc}>
      {label}: {count}
    </button>
  `
  .css`
    :host { display: inline-block; }
    #btn { font: inherit; }
  `
  .register('mdw-counter');
```

## 2.0 Class API

```js
import CustomElement from '../core/CustomElement.js';

class CounterElement extends CustomElement {
  inc() { this.count += 1; }
  static {
    this.observe({
      count: { type: 'integer', value: 0 },
      label: { type: 'string', value: 'Counter' },
    });
    this.html`
      <button id="btn" type="button" on-click={inc}>
        {label}: {count}
      </button>
    `;
    this.css`
      :host { display: inline-block; }
      #btn { font: inherit; }
    `;
    this.register('mdw-counter-class');
  }
}

export default CounterElement;
```

Equivalent post-class configuration (no `static {}` block):

```js
class CounterElement extends CustomElement {
  inc() { this.count += 1; }
}
CounterElement.observe({ count: { type: 'integer', value: 0 } });
CounterElement.html`<button on-click={inc}>{count}</button>`;
CounterElement.register('mdw-counter-class');
```

## 3.0 Observed properties (state tracking)

- `observe()` and `prop()` create accessor-backed properties on the prototype.
- Observed props reflect to attributes by default (except object-like types).
- Attribute reflection must be declared before instances exist.
- Observed props are the primary state-tracking mechanism: changing a prop
  updates only the bindings that read it.

```js
CustomElement.extend()
  .observe({
    value: { type: 'string', value: '' },
    disabled: { type: 'boolean', value: false },
  });
```

### 3.1 State tracking in practice

```js
const Counter = CustomElement
  .extend()
  .observe({ count: { type: 'integer', value: 0 } })
  .methods({
    inc() { this.count += 1; }, // triggers render.byProp('count', ...)
  })
  .html`<button on-click={inc}>{count}</button>`
  .register('mdw-counter');
```

## 4.0 Class field gotcha

Class fields overwrite observed accessors and break reactivity:

```js
class BadCounter extends CustomElement {
  count = 0; // shadows the accessor
  static { this.observe({ count: { type: 'integer', value: 0 } }); }
}
```

Use `setPrototype()` to keep TypeScript hints without class fields:

```js
class GoodCounter extends CustomElement {
  static {
    this.observe({ count: { type: 'integer', value: 0 } });
    this.html`<span>{count}</span>`;
    this.register('mdw-good-counter');
  }
}
GoodCounter.prototype.count = GoodCounter.setPrototype('count', { type: 'integer', value: 0 });
```

## 5.0 Templates (`html`) and styles (`css`)

- `.html\`...\`` appends a template to the `Composition`.
- `.css\`...\`` appends styles to the `Composition`.

Use tagged template syntax for both:

```js
CustomElement.extend()
  .html`<div id="root">{label}</div>`
  .css`
    :host { display: block; }
    #root { padding: 8px; }
  `;
```

## 6.0 Methods and expressions

- Fluent API: `.methods({ ... })`
- Class API: normal class methods
- `.expressions({ ... })` defines computed getters used in templates

```js
CustomElement.extend()
  .observe({ count: { type: 'integer', value: 0 } })
  .expressions({
    isEven({ count }) { return count % 2 === 0; },
  })
  .html`
    <div mdw-if={isEven}>Even</div>
  `;
```

## 7.0 Events

### 7.1 Inline event bindings

```js
CustomElement.extend()
  .methods({
    inc() { this.count += 1; },
  })
  .html`<button on-click={inc}>{count}</button>`;
```

### 7.2 childEvents by id

```js
CustomElement.extend()
  .observe({ count: { type: 'integer', value: 0 } })
  .html`<button id="btn">{count}</button>`
  .childEvents({
    btn: {
      click() { this.count += 1; },
    },
  });
```

### 7.3 rootEvents

```js
CustomElement.extend()
  .rootEvents({
    click(event) {
      if (event.target.matches('button')) this.count += 1;
    },
  });
```

## 8.0 Lifecycle hooks

- `onConstructed(fn)`
- `onConnected(fn)`
- `onDisconnected(fn)`
- `on('composed', fn)`

Hooks receive `callbackArguments` (composition, refs, html helper, template, element).

## 9.0 Rendering and patching

- Assignment (`el.someProp = next`) triggers a render for that prop.
- `el.render({ someProp: ... })` triggers a render without mutating state.
- `el.patch({ someProp: ... })` applies JSON merge patch then renders.

Use `render.byProp` indirectly via observed props or `render()` directly in advanced cases.
For array behavior details, see `docs/STATE-ARRAY.md`.

## 10.0 Refs

- `refs.fooBar` resolves `id="foo-bar"` inside the template or live DOM.
- Before interpolation, refs use the template cache.
- After interpolation, refs use the live DOM cache.

### 10.1 Tag and id naming conventions

- HTML uses kebab-case: `id="primary-btn"`, `<demo-preview-card>`.
- JavaScript uses camelCase: `refs.primaryBtn`, `childEvents({ primaryBtn: ... })`.
- The mapping is the same as `attrNameFromPropName` (kebab-case ↔ camelCase).

This applies to:
- `refs` lookup
- `childEvents` keys
- `recompose(({ refs }) => { ... })` usage

## 11.0 Typing without a build step

- JSDoc types work with the fluent API out of the box.
- Class API should use `setPrototype()` for observed prop typing.
- `/** @type {ClassType} */` on element queries is still valid JS.

Example:

```js
/** @type {CounterElement} */
const el = document.querySelector('mdw-counter-class');
```

## 11.1 Authoring checklist

- Avoid class fields for observed props (they overwrite accessors).
- Null-check in expressions (they run during initialization).
- Use `childEvents` ids in camelCase (`id="my-button"` → `childEvents({ myButton: ... })`).
- Use `render()` for external patches and `patch()` for batch updates.
- Use `createSharedProxy` + `STORE_PROXY_TYPE` for shared proxy stores.

## 12.0 See also

- `docs/CUSTOMELEMENT.md` for a full static/instance API reference
- `docs/STATE.md` for the state system overview
- `test/core/custom-element.test.js` for fluent vs class parity
- `docs/COMPLEX_CUSTOM_ELEMENTS.md` for advanced patterns and custom types

## 13.0 Mixins

Mixins provide shared behavior (forms, theming, ripple, input, etc.). They are optional.
See the mixin list and status in `docs/COMPONENTS.md`.
