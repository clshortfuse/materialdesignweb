# Complex Custom Elements

This guide covers patterns used when components go beyond basic props + template.
It assumes familiarity with `creating-custom-elements.md`.

## 1.0 Composition and recompose

- `html\`...\`` composes a template into a `Composition` instance.
- `recompose(cb)` runs after composition steps and exposes `refs`.
- `recompose` is most useful when **extending** an existing element, so the
  callback can patch or wire additional refs after the base template is composed.

```js
import BaseCard from '../components/Card.js';

BaseCard
  .extend()
  .recompose(({ refs }) => {
    // Patch extra wiring after the base template is composed.
    refs.cardTitle.textContent = refs.cardTitle.textContent.toUpperCase();
  })
  .register('x-card-variant');
```

## 2.0 Events at scale

- `events()` for host events.
- `childEvents()` for specific nodes by id.
- `rootEvents()` for shadow-root delegation.

```js
CustomElement
  .extend()
  .observe({ count: { type: 'integer', value: 0 } })
  .html`<button id="btn">{count}</button>`
  .childEvents({
    btn: { click() { this.count += 1; } },
  })
  .rootEvents({
    keydown(event) {
      if (event.key === 'ArrowUp') this.count += 1;
    },
  })
  .register('x-events');
```

## 3.0 Expressions for derived state

Use `.expressions()` for derived values that affect bindings:

```js
CustomElement.extend()
  .observe({
    first: { type: 'string', value: 'Ada' },
    last: { type: 'string', value: 'Lovelace' },
  })
  .expressions({
    fullName({ first, last }) { return `${first} ${last}`; },
  })
  .html`<span>{fullName}</span>`
  .register('x-name');
```

## 4.0 Rendering and patching

- `render({ prop: value })` updates without mutating state.
- `patch({ prop: value })` applies JSON merge patch, then renders.
- Observed props call `render.byProp` automatically.

Use explicit `render()`/`patch()` when:
- updates come from external data sources
- multiple props are updated at once

## 5.0 Refs and naming

See `creating-custom-elements.md` for the kebab-case ↔ camelCase mapping.

## 6.0 Custom types

Custom observer types live in `core/customTypes.js` and provide specialized parsing:

```js
import { EVENT_HANDLER_TYPE } from '../core/customTypes.js';

CustomElement.extend().observe({
  onaction: EVENT_HANDLER_TYPE,
});
```

Common uses:
- event handler parsing
- animation / style parsing
- structured attribute parsing

## 7.0 Styling strategies

- `.css\`...\`` adds scoped styles inside shadow DOM.
- Use `:host` for layout and exported styling hooks.
- Prefer CSS custom properties for theme integration.

## 8.0 Shared composition and caching

- `Composition` is cached per class.
- Multiple instances share template compilation.
- `refs` caches both template refs and live DOM refs.

## 9.0 When to split components

Split when:
- templates grow beyond a few dozen bindings
- logic for a region becomes its own state model
- event handling becomes difficult to reason about

Focus each component on a single state slice and delegate via child components.
