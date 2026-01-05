import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';

describe('docs/core/state-proxy.md', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('3.0 deep mutations update bindings', async () => {
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
      .register('proxy-doc-deep');

    container.innerHTML = '<proxy-doc-deep></proxy-doc-deep>';
    await customElements.whenDefined('proxy-doc-deep');

    /** @type {InstanceType<ProxyProfile>} */
    const el = container.querySelector('proxy-doc-deep');

    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');
    assert.equal(el.shadowRoot.querySelector('.count').textContent, '0');

    el.state.user.name = 'Bea';
    el.state.count += 1;

    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Bea');
    assert.equal(el.shadowRoot.querySelector('.count').textContent, '1');
  });

  it('4.0 deletes clear bindings', async () => {
    const ProxyDelete = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { user: { title: 'Dev' } } },
      })
      .html`
        <div>
          <span class="title">{state.user.title}</span>
        </div>
      `
      .register('proxy-doc-delete');

    container.innerHTML = '<proxy-doc-delete></proxy-doc-delete>';
    await customElements.whenDefined('proxy-doc-delete');

    /** @type {InstanceType<ProxyDelete>} */
    const el = container.querySelector('proxy-doc-delete');

    assert.equal(el.shadowRoot.querySelector('.title').textContent, 'Dev');

    delete el.state.user.title;

    assert.equal(el.shadowRoot.querySelector('.title').textContent, '');
  });

  it('5.0 arrays update via push/splice', async () => {
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
      .register('proxy-doc-array');

    container.innerHTML = '<proxy-doc-array></proxy-doc-array>';
    await customElements.whenDefined('proxy-doc-array');

    /** @type {InstanceType<ProxyList>} */
    const el = container.querySelector('proxy-doc-array');

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

  it('6.0 custom get does not react to proxy mutations', async () => {
    const ProxyView = CustomElement
      .extend()
      .observe({
        state: { type: 'proxy', value: { user: { name: 'Ada' } } },
        view: {
          type: 'proxy',
          get() {
            return { label: this.state.user.name };
          },
        },
      })
      .html`
        <div>
          <span class="name">{view.label}</span>
        </div>
      `
      .register('proxy-doc-view');

    container.innerHTML = '<proxy-doc-view></proxy-doc-view>';
    await customElements.whenDefined('proxy-doc-view');

    /** @type {InstanceType<ProxyView>} */
    const el = container.querySelector('proxy-doc-view');

    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');

    el.state.user.name = 'Bea';
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');
  });
});
