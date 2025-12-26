/* eslint-disable max-classes-per-file */
import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('State Sharing', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should synchronize multiple components through shared store', async () => {
    // Create shared store
    class CartStore {
      _items = [];

      _et = new EventTarget();

      _notify() {
        const data = { items: this._items, total: this.getTotal() };
        this._et.dispatchEvent(new CustomEvent('change', { detail: data }));
      }

      getItems() { return this._items; }

      getTotal() {
        return this._items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      addItem(product) {
        const existing = this._items.find((item) => item.id === product.id);
        if (existing) {
          existing.quantity++;
        } else {
          this._items.push({ ...product, quantity: 1 });
        }
        this._notify();
      }

      removeItem(productId) {
        this._items = this._items.filter((item) => item.id !== productId);
        this._notify();
      }

      clear() {
        this._items = [];
        this._notify();
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

    const cartStore = new CartStore();

    // Component 1: Cart Badge
    const CartBadge = CustomElement
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
          this._listener = cartStore.on((e) => {
            this.count = e.detail.items.length;
          });
          this.count = cartStore.getItems().length;
        },
        disconnected() {
          this._listener = cartStore.off(this._listener);
        },
      })
      .register('cart-badge-test');

    // Component 2: Cart Total
    const CartTotal = CustomElement
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
          this._listener = cartStore.on((e) => {
            this.total = e.detail.total;
          });
          this.total = cartStore.getTotal();
        },
        disconnected() {
          this._listener = cartStore.off(this._listener);
        },
      })
      .register('cart-total-test');

    // Component 3: Product Card
    const ProductCard = CustomElement
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
            cartStore.addItem({
              id: this.productId,
              title: this.title,
              price: this.price,
            });
          },
        },
      })
      .register('product-card-test');

    // Render components
    container.innerHTML = `
      <cart-badge-test></cart-badge-test>
      <cart-total-test></cart-total-test>
      <product-card-test></product-card-test>
    `;

    await customElements.whenDefined('cart-badge-test');
    await customElements.whenDefined('cart-total-test');
    await customElements.whenDefined('product-card-test');

    const badge = container.querySelector('cart-badge-test');
    const total = container.querySelector('cart-total-test');
    const product = container.querySelector('product-card-test');

    await Promise.resolve();

    // Set product properties
    product.productId = 1;
    product.title = 'Widget';
    product.price = 19.99;

    await Promise.resolve();

    // Initial state - empty cart
    assert.equal(badge.count, 0, 'Badge starts at 0');
    assert.equal(total.total, 0, 'Total starts at 0');
    assert.equal(badge.shadowRoot.querySelector('.badge').hidden, true, 'Badge hidden when empty');
    assert.equal(total.shadowRoot.querySelector('.total').textContent, '$0.00', 'Total displays $0.00');

    // Add item to cart via product card
    product.shadowRoot.querySelector('#add').click();
    await Promise.resolve();

    // Both badge and total should update
    assert.equal(badge.count, 1, 'Badge shows 1 item');
    assert.equal(total.total, 19.99, 'Total shows 19.99');
    assert.equal(badge.shadowRoot.querySelector('.badge').hidden, false, 'Badge visible with items');
    assert.equal(total.shadowRoot.querySelector('.total').textContent, '$19.99', 'Total displays $19.99');

    // Add same item again (should increment quantity)
    product.shadowRoot.querySelector('#add').click();
    await Promise.resolve();

    assert.equal(badge.count, 1, 'Badge still shows 1 item (quantity increased)');
    assert.equal(total.total, 39.98, 'Total shows 39.98 (2x price)');
    assert.equal(total.shadowRoot.querySelector('.total').textContent, '$39.98', 'Total displays $39.98');

    // Clear cart
    cartStore.clear();
    await Promise.resolve();

    assert.equal(badge.count, 0, 'Badge resets to 0');
    assert.equal(total.total, 0, 'Total resets to 0');
    assert.equal(badge.shadowRoot.querySelector('.badge').hidden, true, 'Badge hidden again');
  });

  it('should handle cross-store dependencies', async () => {
    // User store
    class UserStore {
      _user = null;

      _et = new EventTarget();

      setUser(user) {
        this._user = user;
        this._et.dispatchEvent(new CustomEvent('change', { detail: user }));
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

    // Cart store that reacts to user changes
    class CartStore {
      _items = [];

      _et = new EventTarget();

      _userStore = null;

      constructor(userStore) {
        this._userStore = userStore;
        // Clear cart when user logs out
        this._userStore.on((e) => {
          if (!e.detail) {
            this.clear();
          }
        });
      }

      _notify() {
        this._et.dispatchEvent(new CustomEvent('change', { detail: this._items }));
      }

      getItems() { return this._items; }

      addItem(product) {
        this._items.push({ ...product, quantity: 1 });
        this._notify();
      }

      clear() {
        this._items = [];
        this._notify();
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

    const userStore = new UserStore();
    const cartStore = new CartStore(userStore);

    // Component that shows cart count
    const CartStatus = CustomElement
      .extend()
      .observe({
        count: { type: 'integer', value: 0 },
      })
      .html`<div class="count">{count}</div>`
      .on({
        connected() {
          this._listener = cartStore.on((e) => {
            this.count = e.detail.length;
          });
          this.count = cartStore.getItems().length;
        },
        disconnected() {
          this._listener = cartStore.off(this._listener);
        },
      })
      .register('cart-status-test');

    container.innerHTML = '<cart-status-test></cart-status-test>';
    await customElements.whenDefined('cart-status-test');

    const status = container.querySelector('cart-status-test');
    await Promise.resolve();

    // User logs in and adds items
    userStore.setUser({ id: 1, name: 'Alice' });
    cartStore.addItem({ id: 1, title: 'Widget', price: 9.99 });
    await Promise.resolve();

    assert.equal(status.count, 1, 'Cart has 1 item');

    // User logs out - cart should clear
    userStore.setUser(null);
    await Promise.resolve();

    assert.equal(status.count, 0, 'Cart cleared when user logs out');
  });

  it('should support composite state pattern', async () => {
    // User store
    class UserStore {
      _user = null;

      _et = new EventTarget();

      setUser(user) {
        this._user = user;
        this._et.dispatchEvent(new CustomEvent('change', { detail: user }));
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

    // Cart store
    class CartStore {
      _items = [];

      _et = new EventTarget();

      _notify() {
        this._et.dispatchEvent(new CustomEvent('change', { detail: this._items }));
      }

      getItems() { return this._items; }

      getTotal() {
        return this._items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      addItem(product) {
        this._items.push({ ...product, quantity: 1 });
        this._notify();
      }

      clear() {
        this._items = [];
        this._notify();
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

    // Composite app state
    class AppState {
      _et = new EventTarget();

      _userStore = null;

      _cartStore = null;

      constructor(userStore, cartStore) {
        this._userStore = userStore;
        this._cartStore = cartStore;

        // Coordinate between stores
        this._userStore.on(() => {
          this._notifyChange();
        });

        this._cartStore.on(() => {
          this._notifyChange();
        });
      }

      _notifyChange() {
        const state = this.getState();
        this._et.dispatchEvent(new CustomEvent('change', { detail: state }));
      }

      getState() {
        return {
          user: this._userStore.getUser(),
          cart: this._cartStore.getItems(),
          cartTotal: this._cartStore.getTotal(),
          canCheckout: this._userStore.getUser() && this._cartStore.getItems().length > 0,
        };
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

    const userStore = new UserStore();
    const cartStore = new CartStore();
    const appState = new AppState(userStore, cartStore);

    // Component using composite state
    const AppHeader = CustomElement
      .extend()
      .observe({
        username: { type: 'string', value: 'Guest' },
        itemCount: { type: 'integer', value: 0 },
        total: { type: 'float', value: 0 },
        canCheckout: { type: 'boolean', value: false },
      })
      .html`
        <div class="header">
          <span class="user">{username}</span>
          <span class="items">Items: {itemCount}</span>
          <span class="total">Total: $\{total}</span>
          <button disabled={!canCheckout}>Checkout</button>
        </div>
      `
      .on({
        connected() {
          this._listener = appState.on((e) => {
            const { user, cart, cartTotal, canCheckout } = e.detail;
            this.patch({
              username: user?.name || 'Guest',
              itemCount: cart.length,
              total: cartTotal,
              canCheckout,
            });
          });
          // Initialize
          const state = appState.getState();
          this.patch({
            username: state.user?.name || 'Guest',
            itemCount: state.cart.length,
            total: state.cartTotal,
            canCheckout: state.canCheckout,
          });
        },
        disconnected() {
          this._listener = appState.off(this._listener);
        },
      })
      .register('app-header-test');

    container.innerHTML = '<app-header-test></app-header-test>';
    await customElements.whenDefined('app-header-test');

    const header = container.querySelector('app-header-test');
    await Promise.resolve();

    // Initial state
    assert.equal(header.username, 'Guest', 'Username is Guest');
    assert.equal(header.itemCount, 0, 'No items');
    assert.equal(header.total, 0, 'Total is 0');
    assert.equal(header.canCheckout, false, 'Cannot checkout');
    assert.equal(header.shadowRoot.querySelector('button').disabled, true, 'Checkout button disabled');

    // User logs in
    userStore.setUser({ id: 1, name: 'Alice' });
    await Promise.resolve();

    assert.equal(header.username, 'Alice', 'Username is Alice');
    assert.equal(header.canCheckout, false, 'Still cannot checkout (empty cart)');

    // Add item to cart
    cartStore.addItem({ id: 1, title: 'Widget', price: 25.5 });
    await Promise.resolve();

    assert.equal(header.itemCount, 1, '1 item in cart');
    assert.equal(header.total, 25.5, 'Total is 25.50');
    assert.equal(header.canCheckout, true, 'Can checkout now');
    assert.equal(header.shadowRoot.querySelector('button').disabled, false, 'Checkout button enabled');
    assert.equal(header.shadowRoot.querySelector('.user').textContent, 'Alice', 'Displays Alice');
    assert.equal(header.shadowRoot.querySelector('.items').textContent, 'Items: 1', 'Displays 1 item');
    assert.equal(header.shadowRoot.querySelector('.total').textContent, 'Total: $25.5', 'Displays total');

    // Clear cart
    cartStore.clear();
    await Promise.resolve();

    assert.equal(header.itemCount, 0, 'No items');
    assert.equal(header.canCheckout, false, 'Cannot checkout (empty cart)');
    assert.equal(header.shadowRoot.querySelector('button').disabled, true, 'Checkout button disabled again');
  });
});
