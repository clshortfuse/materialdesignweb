import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('State Events', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should synchronize components through window events', async () => {
    let cartState = { items: [], total: 0, count: 0 };

    // Component 1: Cart Manager (coordinates state)
    const CartManager = CustomElement
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
          cartState = {
            items: this._items,
            total,
            count: this._items.length,
          };
          window.dispatchEvent(new CustomEvent('test:cart:changed', {
            detail: cartState,
          }));
        },
      })
      .on({
        connected() {
          this._addListener = (e) => this._addItem(e.detail);
          this._removeListener = (e) => this._removeItem(e.detail.id);

          window.addEventListener('test:cart:add', this._addListener);
          window.addEventListener('test:cart:remove', this._removeListener);

          // Broadcast initial state
          this._broadcastState();
        },
        disconnected() {
          window.removeEventListener('test:cart:add', this._addListener);
          window.removeEventListener('test:cart:remove', this._removeListener);
        },
      })
      .register('cart-manager-test');

    // Component 2: Cart Badge (listens for changes)
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
          this._listener = (e) => {
            this.count = e.detail.count;
          };
          window.addEventListener('test:cart:changed', this._listener);
        },
        disconnected() {
          window.removeEventListener('test:cart:changed', this._listener);
        },
      })
      .register('cart-badge-event-test');

    // Component 3: Cart Total (listens for changes)
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
          this._listener = (e) => {
            this.total = e.detail.total;
          };
          window.addEventListener('test:cart:changed', this._listener);
        },
        disconnected() {
          window.removeEventListener('test:cart:changed', this._listener);
        },
      })
      .register('cart-total-event-test');

    // Component 4: Product Card (dispatches events)
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
            window.dispatchEvent(new CustomEvent('test:cart:add', {
              detail: {
                id: this.productId,
                title: this.title,
                price: this.price,
              },
            }));
          },
        },
      })
      .register('product-card-event-test');

    // Render components
    container.innerHTML = `
      <cart-manager-test></cart-manager-test>
      <cart-badge-event-test></cart-badge-event-test>
      <cart-total-event-test></cart-total-event-test>
      <product-card-event-test></product-card-event-test>
    `;

    await customElements.whenDefined('cart-manager-test');
    await customElements.whenDefined('cart-badge-event-test');
    await customElements.whenDefined('cart-total-event-test');
    await customElements.whenDefined('product-card-event-test');

    /** @type {InstanceType<CartManager>} */
    const manager = container.querySelector('cart-manager-test');
    /** @type {InstanceType<CartBadge>} */
    const badge = container.querySelector('cart-badge-event-test');
    /** @type {InstanceType<CartTotal>} */
    const total = container.querySelector('cart-total-event-test');
    /** @type {InstanceType<ProductCard>} */
    const product = container.querySelector('product-card-event-test');

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

    // Add item via event
    product.shadowRoot.querySelector('#add').click();
    await Promise.resolve();

    // Both badge and total should update
    assert.equal(badge.count, 1, 'Badge shows 1 item');
    assert.equal(total.total, 19.99, 'Total shows 19.99');
    assert.equal(badge.shadowRoot.querySelector('.badge').hidden, false, 'Badge visible with items');
    assert.equal(total.shadowRoot.querySelector('.total').textContent, '$19.99', 'Total displays $19.99');

    // Add same item again
    product.shadowRoot.querySelector('#add').click();
    await Promise.resolve();

    assert.equal(badge.count, 1, 'Badge still shows 1 item (quantity increased)');
    assert.equal(total.total, 39.98, 'Total shows 39.98 (2x price)');

    // Remove item via event
    window.dispatchEvent(new CustomEvent('test:cart:remove', {
      detail: { id: 1 },
    }));
    await Promise.resolve();

    assert.equal(badge.count, 0, 'Badge resets to 0');
    assert.equal(total.total, 0, 'Total resets to 0');
    assert.equal(badge.shadowRoot.querySelector('.badge').hidden, true, 'Badge hidden again');
  });

  it('should support element-level events with bubbling', async () => {
    let selectedId = null;

    // Child component that dispatches events
    const ListItem = CustomElement
      .extend()
      .observe({
        itemId: 'integer',
        label: 'string',
      })
      .html`<button id="btn">{label}</button>`
      .childEvents({
        btn: {
          click() {
            this.dispatchEvent(new CustomEvent('item-selected', {
              detail: { id: this.itemId },
              bubbles: true,
              composed: true,
            }));
          },
        },
      })
      .register('list-item-test');

    // Parent component that listens
    const ItemList = CustomElement
      .extend()
      .html`
        <div id="container">
          <slot></slot>
        </div>
      `
      .on({
        connected() {
          this.addEventListener('item-selected', (e) => {
            selectedId = e.detail.id;
          });
        },
      })
      .register('item-list-test');

    container.innerHTML = `
      <item-list-test>
        <list-item-test item-id="1" label="Item 1"></list-item-test>
        <list-item-test item-id="2" label="Item 2"></list-item-test>
      </item-list-test>
    `;

    await customElements.whenDefined('item-list-test');
    await customElements.whenDefined('list-item-test');

    const list = container.querySelector('item-list-test');
    const items = list.querySelectorAll('list-item-test');

    await Promise.resolve();

    assert.equal(selectedId, null, 'Nothing selected initially');

    // Click first item
    items[0].shadowRoot.querySelector('#btn').click();
    await Promise.resolve();

    assert.equal(selectedId, 1, 'First item selected');

    // Click second item
    items[1].shadowRoot.querySelector('#btn').click();
    await Promise.resolve();

    assert.equal(selectedId, 2, 'Second item selected');
  });

  it('should support cross-component queries', async () => {
    let queryResponse = null;

    // Manager that responds to queries
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const StateManager = CustomElement
      .extend()
      .set({
        _data: { value: 42 },
      })
      .on({
        connected() {
          this._queryListener = (e) => {
            e.detail.callback(this._data);
          };
          window.addEventListener('test:state:query', this._queryListener);
        },
        disconnected() {
          window.removeEventListener('test:state:query', this._queryListener);
        },
      })
      .register('state-manager-test');

    // Component that queries on mount
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const StateConsumer = CustomElement
      .extend()
      .observe({
        value: 'integer',
      })
      .html`<div class="value">{value}</div>`
      .on({
        connected() {
          window.dispatchEvent(new CustomEvent('test:state:query', {
            detail: {
              callback: (state) => {
                this.value = state.value;
                queryResponse = state;
              },
            },
          }));
        },
      })
      .register('state-consumer-test');

    container.innerHTML = `
      <state-manager-test></state-manager-test>
      <state-consumer-test></state-consumer-test>
    `;

    /** @type {InstanceType<StateManager>} */
    await customElements.whenDefined('state-manager-test');
    /** @type {InstanceType<StateConsumer>} */
    await customElements.whenDefined('state-consumer-test');

    const consumer = container.querySelector('state-consumer-test');
    await Promise.resolve();

    assert.equal(consumer.value, 42, 'Consumer received queried value');
    assert.deepEqual(queryResponse, { value: 42 }, 'Query callback received state');
    assert.equal(consumer.shadowRoot.querySelector('.value').textContent, '42', 'Value displayed');
  });

  it('should cleanup event listeners on disconnect', async () => {
    let eventFired = 0;

    const TestComponent = CustomElement
      .extend()
      .observe({
        count: 'integer',
      })
      .on({
        connected() {
          this._listener = () => {
            eventFired++;
            this.count++;
          };
          window.addEventListener('test:increment', this._listener);
        },
        disconnected() {
          window.removeEventListener('test:increment', this._listener);
        },
      })
      .register('cleanup-test');

    container.innerHTML = '<cleanup-test></cleanup-test>';
    await customElements.whenDefined('cleanup-test');

    /** @type {InstanceType<TestComponent>} */
    const component = container.querySelector('cleanup-test');
    await Promise.resolve();

    // Fire event while connected
    window.dispatchEvent(new Event('test:increment'));
    await Promise.resolve();

    assert.equal(eventFired, 1, 'Event fired once');
    assert.equal(component.count, 1, 'Count incremented');

    // Disconnect component
    component.remove();
    await Promise.resolve();

    // Fire event while disconnected
    window.dispatchEvent(new Event('test:increment'));
    await Promise.resolve();

    assert.equal(eventFired, 1, 'Event not fired after disconnect');
  });
});
