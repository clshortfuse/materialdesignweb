/* eslint-disable max-classes-per-file */
import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import CustomElement from '../../core/CustomElement.js';
import { html } from '../utils.js';

beforeEach(() => {
  document.body.replaceChildren();
});

describe('STATE — Element-Local patterns', () => {
  it('basic observable properties update DOM', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoBasic = CustomElement
      .extend()
      .observe({
        count: {
          type: 'integer',
          value: 0,
        },
        name: {
          type: 'string',
          value: 'World',
        },
        // Includes change handler
        isPositive({ count }) {
          return count > 0;
        },
      })
      .set({
        // Not observable, just initial value
        wasEverPositive: false,
      })
      .expressions({
        greeting({ name }) {
          if (!name) return '';
          return `Hello, ${name}!`;
        },
        statusText({ isPositive }) {
          return isPositive ? 'Positive' : 'Zero or negative';
        },
      })
      .on({
        isPositiveChanged(oldValue, newValue) {
          if (newValue) {
            this.wasEverPositive = true;
          }
        },
      })
      .html`
        <div id="greeting">{greeting}</div>
        <div id="count">{count}</div>
        <div id="status" positive={isPositive}>{statusText}</div>
      `
      .autoRegister('local-demo-basic');

    /** @type {InstanceType<LocalDemoBasic>} */
    const el = html`<local-demo-basic></local-demo-basic>`;
    await customElements.whenDefined('local-demo-basic');
    await Promise.resolve();

    assert.equal(el.shadowRoot.querySelector('#greeting').textContent, 'Hello, World!');
    assert.equal(el.shadowRoot.querySelector('#count').textContent, '0');
    assert.equal(el.shadowRoot.querySelector('#status').textContent, 'Zero or negative');
    assert.isFalse(el.shadowRoot.querySelector('#status').hasAttribute('positive'));
    assert.isFalse(el.wasEverPositive);

    // Update count
    el.count = 5;
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#count').textContent, '5');
    assert.equal(el.shadowRoot.querySelector('#status').textContent, 'Positive');
    assert.isTrue(el.shadowRoot.querySelector('#status').hasAttribute('positive'));
    assert.isTrue(el.wasEverPositive);

    // Update name
    el.name = 'Alice';
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#greeting').textContent, 'Hello, Alice!');

    // Update count to negative
    el.count = -3;
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#count').textContent, '-3');
    assert.equal(el.shadowRoot.querySelector('#status').textContent, 'Zero or negative');
    assert.isFalse(el.shadowRoot.querySelector('#status').hasAttribute('positive'));
    assert.isTrue(el.wasEverPositive);
  });

  it('expressions handle null values during initialization', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoNullSafety = CustomElement
      .extend()
      .observe({
        firstName: 'string',
        lastName: 'string',
        price: 'float',
      })
      .expressions({
        fullName({ firstName, lastName }) {
          if (!firstName || !lastName) return '';
          return `${firstName} ${lastName}`;
        },
        priceLabel({ price }) {
          if (price == null) return '';
          return `$${price.toFixed(2)}`;
        },
      })
      .html`
        <div id="name">{fullName}</div>
        <div id="price">{priceLabel}</div>
      `
      .autoRegister('local-demo-null-safety');

    /** @type {InstanceType<LocalDemoNullSafety>} */
    const el = html`<local-demo-null-safety></local-demo-null-safety>`;
    await customElements.whenDefined('local-demo-null-safety');
    await Promise.resolve();

    // Should handle null gracefully
    assert.equal(el.shadowRoot.querySelector('#name').textContent, '');
    assert.equal(el.shadowRoot.querySelector('#price').textContent, '');

    // Update properties
    el.firstName = 'John';
    el.lastName = 'Doe';
    el.price = 19.99;
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#name').textContent, 'John Doe');
    assert.equal(el.shadowRoot.querySelector('#price').textContent, '$19.99');
  });

  it('multiple property updates trigger selective expression recalculation', async () => {
    let fullNameCalls = 0;
    let stockLabelCalls = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoSelective = CustomElement
      .extend()
      .observe({
        firstName: {
          type: 'string',
          value: 'Jane',
        },
        lastName: {
          type: 'string',
          value: 'Smith',
        },
        stock: {
          type: 'integer',
          value: 10,
        },
      })
      .expressions({
        fullName({ firstName, lastName }) {
          fullNameCalls++;
          if (!firstName || !lastName) return '';
          return `${firstName} ${lastName}`;
        },
        stockLabel({ stock }) {
          stockLabelCalls++;
          if (stock == null) return '';
          if (stock === 0) return 'Out of stock';
          if (stock < 5) return `Only ${stock} left`;
          return 'In stock';
        },
      })
      .html`
        <div id="name">{fullName}</div>
        <div id="stock">{stockLabel}</div>
      `
      .autoRegister('local-demo-selective');

    /** @type {InstanceType<LocalDemoSelective>} */
    const el = html`<local-demo-selective></local-demo-selective>`;
    await customElements.whenDefined('local-demo-selective');
    await Promise.resolve();

    const initialFullNameCalls = fullNameCalls;
    const initialStockCalls = stockLabelCalls;

    // Update only firstName - should only recalculate fullName
    el.firstName = 'John';
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#name').textContent, 'John Smith');
    assert.isTrue(fullNameCalls > initialFullNameCalls, 'fullName should recalculate');
    assert.equal(stockLabelCalls, initialStockCalls, 'stockLabel should NOT recalculate');

    const afterFirstNameUpdate = fullNameCalls;

    // Update only stock - should only recalculate stockLabel
    el.stock = 3;
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#stock').textContent, 'Only 3 left');
    assert.equal(fullNameCalls, afterFirstNameUpdate, 'fullName should NOT recalculate');
    assert.isTrue(stockLabelCalls > initialStockCalls, 'stockLabel should recalculate');
  });

  it('batch updates with patch() update multiple properties efficiently', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoPatch = CustomElement
      .extend()
      .observe({
        title: 'string',
        price: 'float',
        stock: 'integer',
        thumbnail: 'string',
      })
      .expressions({
        priceLabel({ price }) {
          if (price == null) return '';
          return `$${price.toFixed(2)}`;
        },
        hasStockLabel({ stock }) {
          if (stock == null) return '';
          return stock > 0 ? 'In Stock' : 'Out of Stock';
        },
        hasStock({ stock }) {
          return stock ? stock > 0 : false;
        },
      })
      .html`
        <div id="title">{title}</div>
        <div id="price">{priceLabel}</div>
        <div id="stock">{stock}</div>
        <img id="thumb" src={thumbnail} />
        <button id="add" disabled={!hasStock}>Add</button>
      `
      .autoRegister('local-demo-patch');

    /** @type {InstanceType<LocalDemoPatch>} */
    const el = html`<local-demo-patch></local-demo-patch>`;
    await customElements.whenDefined('local-demo-patch');
    await Promise.resolve();

    // Batch update with patch()
    el.patch({
      title: 'Product A',
      price: 29.99,
      stock: 5,
      thumbnail: '/img/product-a.jpg',
    });
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.getElementById('title').textContent, 'Product A');
    assert.equal(el.shadowRoot.getElementById('price').textContent, '$29.99');
    assert.equal(el.shadowRoot.getElementById('stock').textContent, '5');
    assert.equal(el.shadowRoot.getElementById('thumb').getAttribute('src'), '/img/product-a.jpg');
    assert.isFalse(el.shadowRoot.getElementById('add').hasAttribute('disabled'));

    // Partial patch - only update some properties
    el.patch({
      stock: 0,
    });
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.getElementById('title').textContent, 'Product A'); // unchanged
    assert.equal(el.shadowRoot.getElementById('stock').textContent, '0');
    assert.isTrue(el.shadowRoot.getElementById('add').hasAttribute('disabled'));
  });

  it('array updates create new array instances', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoArrays = CustomElement
      .extend()
      .observe({
        items: {
          type: 'array',
          value: [],
        },
      })
      .expressions({
        itemCount({ items }) {
          if (!items) return '';
          return items.length.toString();
        },
        itemList({ items }) {
          if (!items || items.length === 0) return 'No items';
          return items.join(', ');
        },
      })
      .html`
        <div id="count">{itemCount}</div>
        <div id="list">{itemList}</div>
      `
      .autoRegister('local-demo-arrays');

    /** @type {InstanceType<LocalDemoArrays>} */
    const el = html`<local-demo-arrays></local-demo-arrays>`;
    await customElements.whenDefined('local-demo-arrays');
    await Promise.resolve();

    assert.equal(el.shadowRoot.querySelector('#count').textContent, '0');
    assert.equal(el.shadowRoot.querySelector('#list').textContent, 'No items');

    // Add items using immutable pattern
    el.items = ['Apple'];
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#count').textContent, '1');
    assert.equal(el.shadowRoot.querySelector('#list').textContent, 'Apple');

    // Add more items
    el.items = [...el.items, 'Banana', 'Cherry'];
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#count').textContent, '3');
    assert.equal(el.shadowRoot.querySelector('#list').textContent, 'Apple, Banana, Cherry');
  });

  it('object updates create new object instances', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoObjects = CustomElement
      .extend()
      .observe({
        config: {
          type: 'object',
          /** @type {{ theme: string, locale: string } | null} */
          value: null,
        },
      })
      .expressions({
        themeLabel({ config }) {
          if (!config) return 'No config';
          return `Theme: ${config.theme || 'default'}`;
        },
        localeLabel({ config }) {
          if (!config) return '';
          return `Locale: ${config.locale || 'en'}`;
        },
      })
      .html`
        <div id="theme">{themeLabel}</div>
        <div id="locale">{localeLabel}</div>
      `
      .autoRegister('local-demo-objects');

    /** @type {InstanceType<LocalDemoObjects>} */
    const el = html`<local-demo-objects></local-demo-objects>`;
    await customElements.whenDefined('local-demo-objects');
    await Promise.resolve();

    assert.equal(el.shadowRoot.querySelector('#theme').textContent, 'No config');

    // Set initial config
    el.config = { theme: 'dark', locale: 'en' };
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#theme').textContent, 'Theme: dark');
    assert.equal(el.shadowRoot.querySelector('#locale').textContent, 'Locale: en');

    // Update config using immutable pattern
    el.config = { ...el.config, theme: 'light' };
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#theme').textContent, 'Theme: light');
    assert.equal(el.shadowRoot.querySelector('#locale').textContent, 'Locale: en');
  });

  it('increment/decrement operations update DOM', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoIncrement = CustomElement
      .extend()
      .observe({
        counter: { type: 'integer', value: 0 },
      })
      .html`
        <div id="value">{counter}</div>
      `
      .autoRegister('local-demo-increment');

    /** @type {InstanceType<LocalDemoIncrement>} */
    const el = html`<local-demo-increment></local-demo-increment>`;
    await customElements.whenDefined('local-demo-increment');
    await Promise.resolve();

    assert.equal(el.shadowRoot.querySelector('#value').textContent, '0');

    // Increment
    el.counter++;
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(el.shadowRoot.querySelector('#value').textContent, '1');

    // Increment again
    el.counter++;
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(el.shadowRoot.querySelector('#value').textContent, '2');

    // Decrement
    el.counter--;
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(el.shadowRoot.querySelector('#value').textContent, '1');
  });

  it('expressions can depend on other expressions', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const LocalDemoChainedExpressions = CustomElement
      .extend()
      .observe({
        quantity: { type: 'integer', value: 2 },
        pricePerUnit: { type: 'float', value: 10 },
        taxRate: { type: 'float', value: 0.08 },
        subtotal({ quantity, pricePerUnit }) {
          return quantity * pricePerUnit;
        },
        tax({ subtotal, taxRate }) {
          return subtotal * taxRate;
        },
        total({ subtotal, tax }) {
          return subtotal + tax;
        },
      })
      .expressions({
        totalLabel({ total }) {
          if (total == null) return '';
          return `$${total.toFixed(2)}`;
        },
      })
      .html`
        <div id="qty">{quantity}</div>
        <div id="subtotal">{subtotal}</div>
        <div id="tax">{tax}</div>
        <div id="total">{totalLabel}</div>
      `
      .autoRegister('local-demo-chained-expressions');

    /** @type {InstanceType<LocalDemoChainedExpressions>} */
    const el = html`<local-demo-chained-expressions></local-demo-chained-expressions>`;
    await customElements.whenDefined('local-demo-chained-expressions');
    await Promise.resolve();

    assert.equal(el.shadowRoot.querySelector('#qty').textContent, '2');
    assert.equal(el.shadowRoot.querySelector('#subtotal').textContent, '20');
    assert.equal(el.shadowRoot.querySelector('#tax').textContent, '1.6');
    assert.equal(el.shadowRoot.querySelector('#total').textContent, '$21.60');

    // Update quantity - should cascade through all dependent expressions
    el.quantity = 5;
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#qty').textContent, '5');
    assert.equal(el.shadowRoot.querySelector('#subtotal').textContent, '50');
    assert.equal(el.shadowRoot.querySelector('#tax').textContent, '4');
    assert.equal(el.shadowRoot.querySelector('#total').textContent, '$54.00');
  });
});
