import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('proxy observable properties', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('re-renders when a deep property changes', async () => {
    const ProxyProfile = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { user: { name: 'Ada' }, count: 0 } },
      })
      .html`
        <div>
          <span class="name">{state.user.name}</span>
          <span class="count">{state.count}</span>
        </div>
      `
      .register('proxy-profile-test');

    container.innerHTML = '<proxy-profile-test></proxy-profile-test>';
    await customElements.whenDefined('proxy-profile-test');

    /** @type {InstanceType<ProxyProfile>} */
    const el = container.querySelector('proxy-profile-test');

    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');
    assert.equal(el.shadowRoot.querySelector('.count').textContent, '0');

    el.state.user.name = 'Bea';
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Bea');
  });

  it('updates mdw-for when proxy array is mutated', async () => {
    const ProxyList = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { items: [] } },
      })
      .html`
        <div>
          <span mdw-for="{item of state.items}" class="item">{item.label}</span>
        </div>
      `
      .register('proxy-list-test');

    container.innerHTML = '<proxy-list-test></proxy-list-test>';
    await customElements.whenDefined('proxy-list-test');

    /** @type {InstanceType<ProxyList>} */
    const el = container.querySelector('proxy-list-test');

    el.state.items.push({ label: 'A' });
    let items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 1);
    assert.equal(items[0].textContent, 'A');

    el.state.items.push({ label: 'B' });
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 2);
    assert.equal(items[1].textContent, 'B');

    el.state.items[0].label = 'A2';
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items[0].textContent, 'A2');
  });

  it('reflects deleteProperty changes in template output', async () => {
    const ProxyDelete = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { user: { name: 'Ada', title: 'Dev' } } },
      })
      .html`
        <div>
          <span class="name">{state.user.name}</span>
          <span class="title">{state.user.title}</span>
        </div>
      `
      .register('proxy-delete-test');

    container.innerHTML = '<proxy-delete-test></proxy-delete-test>';
    await customElements.whenDefined('proxy-delete-test');

    /** @type {InstanceType<ProxyDelete>} */
    const el = container.querySelector('proxy-delete-test');

    assert.equal(el.shadowRoot.querySelector('.title').textContent, 'Dev');

    // Delete should emit a patch with null and clear the binding
    delete el.state.user.title;
    assert.equal(el.shadowRoot.querySelector('.title').textContent, '');
  });

  it('updates when proxy arrays are spliced', async () => {
    const ProxySplice = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { items: [] } },
      })
      .html`
        <div>
          <span mdw-for="{item of state.items}" class="item">{item.label}</span>
        </div>
      `
      .register('proxy-splice-test');

    container.innerHTML = '<proxy-splice-test></proxy-splice-test>';
    await customElements.whenDefined('proxy-splice-test');

    /** @type {InstanceType<ProxySplice>} */
    const el = container.querySelector('proxy-splice-test');

    el.state.items.push({ label: 'A' }, { label: 'B' }, { label: 'C' });
    let items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 3);
    assert.equal(items[1].textContent, 'B');

    el.state.items.splice(1, 1);
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 2);
    assert.equal(items[0].textContent, 'A');
    assert.equal(items[1].textContent, 'C');
  });

});
