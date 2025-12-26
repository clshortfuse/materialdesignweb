# State Sharing — Service Pattern

For complex applications where multiple components need to stay synchronized, share state through centralized service stores.

> **Prerequisites**: Read [STATE.md](STATE.md) and [STATE-MVP.md](STATE-MVP.md) first.

## Core Pattern

Multiple components subscribe to the same store. When any component triggers a state change, all subscribed components automatically update.

**Key Benefits:**
- No direct component-to-component coupling
- Single source of truth
- Automatic synchronization
- Centralized business logic

## Scenario: Shopping Cart

Three interdependent components that must stay synchronized:

### Store Implementation

```js
// services/CartStore.js
class CartStore {
  _items = [];
  _et = new EventTarget();

  getItems() { return this._items; }
  
  getTotal() {
    return this._items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  addItem(product) {
    const existing = this._items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this._items.push({ ...product, quantity: 1 });
    }
    this._notify();
  }

  removeItem(productId) {
    this._items = this._items.filter(item => item.id !== productId);
    this._notify();
  }

  updateQuantity(productId, quantity) {
    const item = this._items.find(item => item.id === productId);
    if (item) item.quantity = quantity;
    this._notify();
  }

  clear() {
    this._items = [];
    this._notify();
  }

  _notify() {
    const data = { items: this._items, total: this.getTotal() };
    this._et.dispatchEvent(new CustomEvent('change', { detail: data }));
  }

  on(handler) {
    this._et.addEventListener('change', handler);
    return handler;
  }

  off(handler) {
    this._et.removeEventListener('change', handler);
    return null;
  }
}

export default new CartStore();
```

### Component 1: Cart Badge (displays count)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import CartStore from '../services/CartStore.js';

export default CustomElement
  .extend()
  .observe({
    count: { type: 'integer', value: 0 },
    hasItems({ count }) {
      return count > 0;
    },
  })
  .html`
    <div class="badge" hidden={!hasItems}>{count}</div>
  `
  .on({
    connected() {
      this._listener = CartStore.on((e) => {
        this.count = e.detail.items.length;
      });
      // Initialize from current state
      this.count = CartStore.getItems().length;
    },
    disconnected() {
      this._listener = CartStore.off(this._listener);
    },
  })
  .autoRegister('cart-badge');
```

### Component 2: Cart Total (displays price)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import CartStore from '../services/CartStore.js';

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
      this._listener = CartStore.on((e) => {
        this.total = e.detail.total;
      });
      // Initialize from current state
      this.total = CartStore.getTotal();
    },
    disconnected() {
      this._listener = CartStore.off(this._listener);
    },
  })
  .autoRegister('cart-total');
```

### Component 3: Product Card (triggers changes)

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import CartStore from '../services/CartStore.js';

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
        CartStore.addItem({
          id: this.productId,
          title: this.title,
          price: this.price,
        });
      },
    },
  })
  .autoRegister('product-card');
```

### How It Works

1. All three components subscribe to the same `CartStore` in their `connected()` lifecycle
2. When `product-card` calls `CartStore.addItem()`, the store notifies all subscribers
3. `cart-badge` and `cart-total` receive the event and update their observables
4. The framework automatically updates only the affected DOM nodes
5. No component knows about any other component - all communication flows through the store

## Cross-Store Dependencies

When stores need to coordinate with each other:

```js
// services/UserStore.js
class UserStore {
  _user = null;
  _et = new EventTarget();

  setUser(user) {
    this._user = user;
    this._et.dispatchEvent(new CustomEvent('change', { detail: user }));
    
    // When user logs out, clear their cart
    if (!user) {
      import('./CartStore.js').then(({ default: CartStore }) => {
        CartStore.clear();
      });
    }
  }

  getUser() { return this._user; }

  on(handler) {
    this._et.addEventListener('change', handler);
    return handler;
  }

  off(handler) {
    this._et.removeEventListener('change', handler);
    return null;
  }
}

export default new UserStore();
```

## Composite State Pattern

For complex interdependencies, create a state coordinator that aggregates multiple stores:

```js
// services/AppState.js
import CartStore from './CartStore.js';
import UserStore from './UserStore.js';

class AppState {
  _et = new EventTarget();

  constructor() {
    // Coordinate between stores
    UserStore.on((e) => {
      this._notifyChange();
    });
    
    CartStore.on((e) => {
      this._notifyChange();
    });
  }

  getState() {
    return {
      user: UserStore.getUser(),
      cart: CartStore.getItems(),
      cartTotal: CartStore.getTotal(),
      canCheckout: UserStore.getUser() && CartStore.getItems().length > 0,
    };
  }

  _notifyChange() {
    const state = this.getState();
    this._et.dispatchEvent(new CustomEvent('change', { detail: state }));
  }

  on(handler) {
    this._et.addEventListener('change', handler);
    return handler;
  }

  off(handler) {
    this._et.removeEventListener('change', handler);
    return null;
  }
}

export default new AppState();
```

### Using Composite State

```js
import CustomElement from '@shortfuse/materialdesignweb/core/CustomElement.js';
import AppState from '../services/AppState.js';

export default CustomElement
  .extend()
  .observe({
    username: 'string',
    itemCount: 'integer',
    total: 'float',
    canCheckout: 'boolean',
  })
  .html`
    <div class="header">
      <span>{username}</span>
      <span>Items: {itemCount}</span>
      <span>Total: $\{total}</span>
      <button disabled={!canCheckout}>Checkout</button>
    </div>
  `
  .on({
    connected() {
      this._listener = AppState.on((e) => {
        const { user, cart, cartTotal, canCheckout } = e.detail;
        this.patch({
          username: user?.name || 'Guest',
          itemCount: cart.length,
          total: cartTotal,
          canCheckout,
        });
      });
      // Initialize
      const state = AppState.getState();
      this.patch({
        username: state.user?.name || 'Guest',
        itemCount: state.cart.length,
        total: state.cartTotal,
        canCheckout: state.canCheckout,
      });
    },
    disconnected() {
      this._listener = AppState.off(this._listener);
    },
  })
  .autoRegister('app-header');
```

## Best Practices

1. **Always Initialize**: Synchronize state in `connected()` by reading current store values
2. **Always Cleanup**: Unsubscribe in `disconnected()` to prevent memory leaks
3. **Single Source of Truth**: Business logic lives in stores, not components
4. **Immutable Updates**: Stores should notify on all mutations
5. **Derived State**: Use computed observables in components for view-specific transformations
6. **Lazy Loading**: Use dynamic imports for cross-store dependencies to avoid circular imports
