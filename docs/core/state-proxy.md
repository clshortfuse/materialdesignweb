# State Proxy

This document describes proxy-based state observation (`type: 'proxy'`).
Implementation note: the system uses WeakMap caches/emitters to avoid mutating
the original object. A Symbol cache could be faster, but it would be intrusive.

## 1.0 Summary

- Proxy state emits deep changes automatically (no manual `render()`/`patch()`).
- Rendering is synchronous; no waiting is required.
- The proxy cache is stored in WeakMaps to avoid mutating the original object.
- Deletes emit `null` in the patch (bindings clear).
- Array mutations emit index/length changes and re-render affected rows.

## 2.0 Setup

Define a proxy observable:

```js
CustomElement
  .extend()
  .observe({
    state: { type: 'proxy', value: { user: { name: 'Ada' }, count: 0 } },
  })
```

## 3.0 Deep mutations

Updates on nested fields re-render automatically.

```js
el.state.user.name = 'Bea';
el.state.count += 1;
```

## 4.0 Deletes

Deleting a property emits a `null` patch for that key and clears bindings.

```js
delete el.state.user.title;
```

## 5.0 Arrays

Array mutations emit index changes (and `length` when applicable).

```js
el.state.items.push({ label: 'A' });
el.state.items.splice(1, 1);
```

## 6.0 Custom accessors

Custom `get`/`set` values are not invalidated by proxy mutations. If you need
reactive computed values, update the computed property directly or use explicit
`render()` calls.

```js
observe({
  state: { type: 'proxy', value: { user: { name: 'Ada' } } },
  view: {
    type: 'proxy',
    get() {
      return this.state;
    },
  },
});
```

## 7.0 External proxy stores

You can bind a shared proxy object to a property using a custom type that
subscribes to internal proxy emissions and forwards patches into `render.byProp`.

```js
import { STORE_PROXY_TYPE } from '../core/customTypes.js';
import { createSharedProxy } from '../core/observe.js';

observe({
  store: STORE_PROXY_TYPE,
});

const sharedProxy = createSharedProxy(rawStore);
el.store = sharedProxy;
sharedProxy.user.name.first = 'Bea';
```

Notes:
- `STORE_PROXY_TYPE` expects a **proxy created by `createSharedProxy`**.
- Raw objects do not emit patches unless wrapped.
- Setting `el.store = null` unsubscribes immediately.
- On connect, the element renders once with the current store snapshot.

## 7.1 Connected vs disconnected behavior

- Disconnected elements do **not** receive proxy updates.
- When reconnected, the element resubscribes and re-renders from the latest store state.
- Multiple elements can share the same proxy; disconnecting one does not affect the others.

## 8.0 Patch system vs proxy (MVP path)

Proxy is a convenience layer. The core rendering model is still patch-based:

- **Patch path (MVP / manual):** call `render()` or `patch()` with explicit
  changes. This is the most controllable and fastest path for performance work.
- **Proxy path (convenience):** mutate deep state directly and let the proxy
  emit patches automatically.

Both paths use the same renderer. Proxy just generates the patch for you.
If performance is critical, prefer manual patching.

## 9.0 Filtering Arrays in Proxy Stores

When using proxy stores with `mdw-for` loops, use `mdw-if` to toggle visibility of items instead of creating filtered arrays. The proxy will emit patches automatically when flags change.

### Basic Filtering with mdw-if

```js
CustomElement
  .extend()
  .observe({
    rows: { type: 'proxy', value: [] },
    showBeta: 'boolean',
    .expressions({
      rowMatches({ showBeta }, { row }) {
        if (!row?.child) return false;
        return showBeta ? row.child.option === 'beta' : row.child.option === 'alpha';
      },
    })
  })
  .html`
    <div mdw-for="{row of rows}" class="row">
      <span mdw-if={rowMatches}>{row.label}</span>
      <span mdw-if={row.show}>flag</span>
    </div>
  `
```

Toggle visibility by mutating proxy properties:

```js
// Toggle individual item visibility
el.rows[0].show = false;

// Toggle filter criteria
el.showBeta = true;

// Update nested property
el.rows[1].child.option = 'beta';
```

**Key benefits:**
- No need to create filtered arrays or track source data
- DOM nodes remain stable (just hidden/shown)
- Works seamlessly with nested properties
- Proxy emits patches automatically for the array mutation

### Nested Loop Filtering

For nested `mdw-for` loops, use `mdw-if` on the nested items:

```js
CustomElement
  .extend()
  .observe({
    rows: { type: 'proxy', value: [] },
    activeFilter: { type: 'string', value: 'all' },
    .expressions({
      childMatches({ activeFilter }, { child }) {
        return activeFilter === 'all' || child.type === activeFilter;
      },
    })
  })
  .html`
    <div mdw-for="{row of rows}" class="row">
      <span>{row.label}</span>
      <div mdw-for="{child of row.children}" mdw-if={childMatches} class="child">
        {child.label}
      </div>
    </div>
  `
```

Update the filter:

```js
// All children instantly re-evaluate mdw-if
el.activeFilter = 'beta';

// Or toggle individual child flags
el.rows[0].children[1].visible = false;
```

### Multiple Filter Criteria

Combine multiple conditions in expressions:

```js
.expressions({
  shouldShow({ searchText, category, showInactive }, { item }) {
    // Active filter
    if (!showInactive && !item.active) return false;
    
    // Category filter
    if (category !== 'all' && item.category !== category) return false;
    
    // Search filter
    if (searchText && !item.name.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    
    return true;
  },
})
.html`<div mdw-for="{item of items}" mdw-if={shouldShow}>{item.name}</div>`
```

**Advantages over array filtering:**
- No array copying or splicing needed
- Proxy automatically emits patches for all criteria changes
- Filter state and data state are separate
- DOM element recycling is more efficient

## 10.0 Gotchas

- Frozen/sealed objects cannot be proxied safely.
- If you mutate the raw object directly (not through the proxy), no change is emitted.
- Dates and class instances are proxied like normal objects. Prefer primitives for dates
  (epoch number or ISO string) and parse/format in expressions.
- Functions are not proxied; treat them as opaque values.
