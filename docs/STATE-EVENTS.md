# State Sharing — Event Pattern

For loosely coupled components, use custom events dispatched on `window` or `document`. Since all CustomElements are EventTargets, they can dispatch and listen to events without centralized stores.

> **Prerequisites**: Read [STATE.md](STATE.md) and [STATE-MVP.md](STATE-MVP.md) first.

## Core Pattern

Components dispatch custom events to communicate. Other components listen for these events and update their state accordingly.

**Key Benefits:**
- Zero dependencies between components
- No shared service imports
- Built into web platform (EventTarget API)
- Easy to debug with DevTools (Event Listener Breakpoints)
- Components can be added/removed dynamically

## Event Naming Convention

Use namespaced event names to avoid collisions:

```js
// Good
'myapp:cart:add'
'myapp:cart:remove'
'myapp:user:login'
'myapp:user:logout'

// Avoid generic names
'add'
'update'
'change'
```

## Scenario: Shopping Cart

Same shopping cart example, but using events instead of a service:

### Component 1: Product Card (dispatches events)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    productId: 'integer',
    title: 'string',
    price: 'float',
  })
  .html`
    <h3>{title}</h3>
    <div class="price">$\{price}</div>
    <button id="add">Add to Cart</button>
  `
  .childEvents({
    add: {
      click() {
        // Dispatch event on window
        window.dispatchEvent(new CustomEvent('myapp:cart:add', {
          detail: {
            id: this.productId,
            title: this.title,
            price: this.price,
          },
        }));
      },
    },
  })
  .autoRegister('product-card');
```

### Component 2: Cart Manager (coordinates state)

This component maintains cart state and broadcasts changes:

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .set({
    _items: [],
  })
  .methods({
    _addItem(product) {
      const existing = this._items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this._items.push({ ...product, quantity: 1 });
      }
      this._broadcastState();
    },
    _removeItem(productId) {
      this._items = this._items.filter((item) => item.id !== productId);
      this._broadcastState();
    },
    _broadcastState() {
      const total = this._items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      window.dispatchEvent(new CustomEvent('myapp:cart:changed', {
        detail: {
          items: this._items,
          total,
          count: this._items.length,
        },
      }));
    },
  })
  .on({
    connected() {
      this._addListener = (e) => this._addItem(e.detail);
      this._removeListener = (e) => this._removeItem(e.detail.id);
      
      window.addEventListener('myapp:cart:add', this._addListener);
      window.addEventListener('myapp:cart:remove', this._removeListener);
      
      // Broadcast initial state
      this._broadcastState();
    },
    disconnected() {
      window.removeEventListener('myapp:cart:add', this._addListener);
      window.removeEventListener('myapp:cart:remove', this._removeListener);
    },
  })
  .autoRegister('cart-manager');
```

### Component 3: Cart Badge (listens for changes)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    count: { type: 'integer', value: 0 },
    hasItems({ count }) {
      return count > 0;
    },
  })
  .html`<div class="badge" hidden={!hasItems}>{count}</div>`
  .on({
    connected() {
      this._listener = (e) => {
        this.count = e.detail.count;
      };
      window.addEventListener('myapp:cart:changed', this._listener);
    },
    disconnected() {
      window.removeEventListener('myapp:cart:changed', this._listener);
    },
  })
  .autoRegister('cart-badge');
```

### Component 4: Cart Total (listens for changes)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';

export default CustomElement
  .extend()
  .observe({
    total: { type: 'float', value: 0 },
  })
  .expressions({
    totalLabel({ total }) {
      if (total == null) return '$0.00';
      return `$${total.toFixed(2)}`;
    },
  })
  .html`<div class="total">{totalLabel}</div>`
  .on({
    connected() {
      this._listener = (e) => {
        this.total = e.detail.total;
      };
      window.addEventListener('myapp:cart:changed', this._listener);
    },
    disconnected() {
      window.removeEventListener('myapp:cart:changed', this._listener);
    },
  })
  .autoRegister('cart-total');
```

### Usage

```html
<!-- Cart manager coordinates state -->
<cart-manager></cart-manager>

<!-- Display components listen for changes -->
<cart-badge></cart-badge>
<cart-total></cart-total>

<!-- Product cards dispatch add events -->
<product-card product-id="1" title="Widget" price="19.99"></product-card>
<product-card product-id="2" title="Gadget" price="29.99"></product-card>
```

## How It Works

1. `product-card` dispatches `myapp:cart:add` event on `window`
2. `cart-manager` listens for add/remove events, updates internal state
3. `cart-manager` broadcasts `myapp:cart:changed` with new state
4. `cart-badge` and `cart-total` listen for changed events and update displays
5. No component imports any other component or service

## Element-Level Events

For parent-child communication, dispatch events on the element itself:

```js
// Child component
export default CustomElement
  .extend()
  .childEvents({
    button: {
      click() {
        // Dispatch on this element
        this.dispatchEvent(new CustomEvent('item-selected', {
          detail: { id: this.itemId },
          bubbles: true,  // Bubble up to parent
          composed: true, // Cross shadow DOM boundary
        }));
      },
    },
  })
  .autoRegister('list-item');

// Parent component
export default CustomElement
  .extend()
  .html`
    <div>
      <list-item item-id="1"></list-item>
      <list-item item-id="2"></list-item>
    </div>
  `
  .on({
    connected() {
      this.addEventListener('item-selected', (e) => {
        console.log('Selected:', e.detail.id);
      });
    },
  })
  .autoRegister('item-list');
```

## Comparison: Events vs Services

| Aspect              | Events (this doc)                | Services ([STATE-SERVICE.md](STATE-SERVICE.md)) |
| ------------------- | -------------------------------- | ----------------------------------------------- |
| **Coupling**        | Zero - no imports                | Components import service                       |
| **Discoverability** | Lower - harder to trace          | Higher - explicit imports                       |
| **Type Safety**     | Weaker - event names are strings | Stronger - TypeScript/JSDoc on service          |
| **Coordination**    | Manager component needed         | Service handles coordination                    |
| **Testing**         | Easy - just dispatch events      | Easy - mock service                             |
| **Performance**     | Event bubbling overhead          | Direct method calls                             |
| **Use Case**        | Loosely coupled UI widgets       | Shared business logic                           |

## Best Practices

1. **Always Cleanup**: Remove event listeners in `disconnected()` to prevent memory leaks. Store listener references (e.g., `this._listener`) in `connected()` so you can remove the exact same function reference in `disconnected()`.
2. **Use Namespaces**: Prefix events with app name (`myapp:`)
3. **Document Events**: Comment which events a component dispatches/listens for
4. **Bubbling Strategy**: Use `bubbles: true, composed: true` for parent-child only
5. **Window Events**: Use `window` for global app events between unrelated components
6. **State Owner**: Designate one manager component to own state
7. **Immutable Details**: Clone objects in `detail` to prevent mutations

> **Critical**: Failing to remove event listeners in `disconnected()` will cause memory leaks as the component instance remains referenced by the event target (`window`, `document`, etc.) even after removal from the DOM.

## When to Use Events

**Good for:**
- UI widgets that don't know about each other
- Plugin architectures
- Dynamic component loading
- Decoupled micro-frontends
- Broadcasting user actions

**Not ideal for:**
- Complex business logic (use services)
- Type-safe APIs (use services)
- Frequent updates (event overhead)
- Debugging (harder to trace event flow)

## Cross-Component Queries

For components that need to query state on mount:

```js
// Cart manager responds to queries
.on({
  connected() {
    this._queryListener = (e) => {
      e.detail.callback({
        items: this._items,
        total: this._getTotal(),
        count: this._items.length,
      });
    };
    window.addEventListener('myapp:cart:query', this._queryListener);
  },
  disconnected() {
    window.removeEventListener('myapp:cart:query', this._queryListener);
  },
})

// Component queries on mount
.on({
  connected() {
    window.dispatchEvent(new CustomEvent('myapp:cart:query', {
      detail: {
        callback: (state) => {
          this.count = state.count;
        },
      },
    }));
  },
})
```

Alternatively, the manager can broadcast initial state immediately on connect.
