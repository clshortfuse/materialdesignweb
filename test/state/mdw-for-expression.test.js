import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('mdw-for with expressions', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should access both iterable and item in expressions', async () => {
    const AddressList = CustomElement
      .extend()
      .observe({
        addresses: { type: 'array', value: [] },
      })
      .expressions({
        formatAddress({ addresses }, { address }) {
          if (!addresses) return '';
          if (!address) return '';
          return `Address: ${address}`;
        },
      })
      .html`
        <div>
          <div mdw-for="{address of addresses}" class="address-item">
            <span class="formatted">{formatAddress}</span>
          </div>
        </div>
      `
      .register('address-list-test');

    container.innerHTML = '<address-list-test></address-list-test>';
    
    await customElements.whenDefined('address-list-test');

    const list = container.querySelector('address-list-test');
    
    list.addresses = ['123 Main St', '456 Oak Ave', '789 Pine Rd'];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const items = list.shadowRoot.querySelectorAll('.address-item');
    
    assert.equal(items.length, 3);
    assert.equal(items[0].querySelector('.formatted').textContent, 'Address: 123 Main St');
    assert.equal(items[1].querySelector('.formatted').textContent, 'Address: 456 Oak Ave');
    assert.equal(items[2].querySelector('.formatted').textContent, 'Address: 789 Pine Rd');
  });

  it('should handle falsy values in mdw-for (false, 0, empty string)', async () => {
    const FalsyList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="item">
            <span class="value">{item}</span>
          </div>
        </div>
      `
      .register('falsy-list-test');

    container.innerHTML = '<falsy-list-test></falsy-list-test>';
    
    await customElements.whenDefined('falsy-list-test');

    const list = container.querySelector('falsy-list-test');
    
    list.items = [false, 0, '', true, 1, 'text'];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const items = list.shadowRoot.querySelectorAll('.item');
    
    // false renders empty, true renders 'true', 0 renders as '0'
    assert.equal(items.length, 6);
    assert.equal(items[0].querySelector('.value').textContent, ''); // false renders empty
    assert.equal(items[1].querySelector('.value').textContent, '0');
    assert.equal(items[2].querySelector('.value').textContent, '');
    assert.equal(items[3].querySelector('.value').textContent, 'true'); // true renders as 'true'
    assert.equal(items[4].querySelector('.value').textContent, '1');
    assert.equal(items[5].querySelector('.value').textContent, 'text');
  });

  it('should access array length and current item in expression', async () => {
    const CounterList = CustomElement
      .extend()
      .observe({
        items: { type: 'array', value: [] },
      })
      .expressions({
        formatCount({ items }, { item, index }) {
          return `Item ${index + 1} of ${items.length}: ${item}`;
        },
      })
      .html`
        <div>
          <div mdw-for="{item of items}" class="item">
            <span class="count">{formatCount}</span>
          </div>
        </div>
      `
      .register('counter-list-test');

    container.innerHTML = '<counter-list-test></counter-list-test>';
    
    await customElements.whenDefined('counter-list-test');

    const list = container.querySelector('counter-list-test');
    
    list.items = ['Apple', 'Banana', 'Cherry'];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const items = list.shadowRoot.querySelectorAll('.item');
    
    assert.equal(items.length, 3);
    assert.equal(items[0].querySelector('.count').textContent, 'Item 1 of 3: Apple');
    assert.equal(items[1].querySelector('.count').textContent, 'Item 2 of 3: Banana');
    assert.equal(items[2].querySelector('.count').textContent, 'Item 3 of 3: Cherry');
  });

  it('should access nested object properties in expressions within mdw-for', async () => {
    const UserList = CustomElement
      .extend()
      .observe({
        users: { type: 'array', value: [] },
      })
      .expressions({
        formatUser({ users }, { user }) {
          if (!user || !user.name) return 'Unknown';
          return `${user.name} (${user.age} years old)`;
        },
      })
      .html`
        <div>
          <div mdw-for="{user of users}" class="user">
            <span class="info">{formatUser}</span>
          </div>
        </div>
      `
      .register('user-list-test');

    container.innerHTML = '<user-list-test></user-list-test>';
    
    await customElements.whenDefined('user-list-test');

    const list = container.querySelector('user-list-test');
    
    list.users = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];

    await new Promise((resolve) => { setTimeout(resolve, 100); });

    const items = list.shadowRoot.querySelectorAll('.user');
    
    assert.equal(items.length, 3);
    assert.equal(items[0].querySelector('.info').textContent, 'Alice (30 years old)');
    assert.equal(items[1].querySelector('.info').textContent, 'Bob (25 years old)');
    assert.equal(items[2].querySelector('.info').textContent, 'Charlie (35 years old)');
  });
});
