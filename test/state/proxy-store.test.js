import { assert } from '@esm-bundle/chai';

import CustomElement from '../../core/CustomElement.js';
import { STORE_PROXY_TYPE } from '../../core/customTypes.js';
import { createSharedProxy } from '../../core/observe.js';

describe('proxy store custom type', () => {
  /** @type {HTMLDivElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('subscribes to shared proxy objects and renders updates', async () => {
    const DATA = {
      user: { name: { first: 'Ada' } },
      items: [{ label: 'A' }, { label: 'B' }],
    };
    const StoreView = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA>} */(STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <span class="name">{store.user.name.first}</span>
          <span mdw-for="{item of store.items}" class="item">{item.label}</span>
        </div>
      `
      .register('proxy-store-view');

    container.innerHTML = '<proxy-store-view></proxy-store-view>';
    await customElements.whenDefined('proxy-store-view');

    /** @type {InstanceType<StoreView>} */
    const el = container.querySelector('proxy-store-view');

    const shared = createSharedProxy(DATA);

    el.store = shared;

    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');
    let items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 2);
    assert.equal(items[1].textContent, 'B');

    shared.user.name.first = 'Bea';
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Bea');

    shared.items.push({ label: 'C' });
    items = el.shadowRoot.querySelectorAll('.item');
    assert.equal(items.length, 3);
    assert.equal(items[2].textContent, 'C');
  });

  it('unsubscribes when store is cleared', async () => {
    const DATA = {
      user: { name: { first: 'Ada' } },
      items: [{ label: 'A' }, { label: 'B' }],
    };
    const StoreView = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA>} */ (STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <span class="name">{store.user.name.first}</span>
        </div>
      `
      .register('proxy-store-clear');

    container.innerHTML = '<proxy-store-clear></proxy-store-clear>';
    await customElements.whenDefined('proxy-store-clear');

    /** @type {InstanceType<StoreView>} */
    const el = container.querySelector('proxy-store-clear');

    const shared = createSharedProxy(DATA);
    el.store = shared;
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');

    el.store = null;

    shared.user.name.first = 'Bea';
    assert.equal(el.shadowRoot.querySelector('.name').textContent, '');
  });

  it('updates multiple elements sharing the same proxy', async () => {
    const DATA = {
      user: { name: { first: 'Ada' } },
      items: [{ label: 'A' }, { label: 'B' }],
    };
    const StoreView = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA>} */ (STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <span class="name">{store.user.name.first}</span>
        </div>
      `
      .register('proxy-store-view-shared');

    container.innerHTML = [
      '<proxy-store-view-shared></proxy-store-view-shared>',
      '<proxy-store-view-shared></proxy-store-view-shared>',
    ].join('');
    await customElements.whenDefined('proxy-store-view-shared');

    /** @type {NodeListOf<InstanceType<StoreView>>} */
    const views = container.querySelectorAll('proxy-store-view-shared');

    const shared = createSharedProxy(DATA);

    views[0].store = shared;
    views[1].store = shared;

    assert.equal(views[0].shadowRoot.querySelector('.name').textContent, 'Ada');
    assert.equal(views[1].shadowRoot.querySelector('.name').textContent, 'Ada');

    shared.user.name.first = 'Bea';

    assert.equal(views[0].shadowRoot.querySelector('.name').textContent, 'Bea');
    assert.equal(views[1].shadowRoot.querySelector('.name').textContent, 'Bea');
  });

  it('disconnects one subscriber without affecting others', async () => {
    const DATA = {
      user: { name: { first: 'Ada' } },
    };
    const StoreView = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA>} */ (STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <span class="name">{store.user.name.first}</span>
        </div>
      `
      .register('proxy-store-dual');

    container.innerHTML = [
      '<proxy-store-dual></proxy-store-dual>',
      '<proxy-store-dual></proxy-store-dual>',
    ].join('');
    await customElements.whenDefined('proxy-store-dual');

    /** @type {NodeListOf<InstanceType<StoreView>>} */
    const views = container.querySelectorAll('proxy-store-dual');

    const shared = createSharedProxy(DATA);
    views[0].store = shared;
    views[1].store = shared;

    assert.equal(views[0].shadowRoot.querySelector('.name').textContent, 'Ada');
    assert.equal(views[1].shadowRoot.querySelector('.name').textContent, 'Ada');

    // Disconnect only one view.
    container.removeChild(views[0]);

    shared.user.name.first = 'Bea';

    // Connected view updates, disconnected view stays stale.
    assert.equal(views[1].shadowRoot.querySelector('.name').textContent, 'Bea');
    assert.equal(views[0].shadowRoot.querySelector('.name').textContent, 'Ada');

    // Reconnect and verify resync for the disconnected view.
    container.appendChild(views[0]);
    assert.equal(views[0].shadowRoot.querySelector('.name').textContent, 'Bea');
  });

  it('skips updates while disconnected and resyncs on reconnect', async () => {
    const DATA = {
      user: { name: { first: 'Ada' } },
    };
    const StoreView = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA>} */ (STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <span class="name">{store.user.name.first}</span>
        </div>
      `
      .register('proxy-store-disconnect');

    container.innerHTML = '<proxy-store-disconnect></proxy-store-disconnect>';
    await customElements.whenDefined('proxy-store-disconnect');

    /** @type {InstanceType<StoreView>} */
    const el = container.querySelector('proxy-store-disconnect');

    const shared = createSharedProxy(DATA);
    el.store = shared;
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');

    // Disconnect element and mutate store while offline
    container.removeChild(el);
    shared.user.name.first = 'Bea';
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Ada');

    // Reconnect and verify resync
    container.appendChild(el);
    assert.equal(el.shadowRoot.querySelector('.name').textContent, 'Bea');
  });

  it('updates list and detail views for shared contacts', async () => {
    const DATA = {
      contacts: [
        { first: 'Ada', last: 'Lovelace' },
        { first: 'Alan', last: 'Turing' },
      ],
    };
    const ContactList = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA>} */ (STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <div mdw-for="{contact of store.contacts}" class="contact">
            <span class="desc">{contact.last}, {contact.first}</span>
          </div>
        </div>
      `
      .register('proxy-store-contact-list');

    const ContactDetail = CustomElement
      .extend()
      .observe({
        store: /** @type {STORE_PROXY_TYPE<DATA['contacts'][number]>} */ (STORE_PROXY_TYPE),
      })
      .html`
        <div>
          <span class="detail">{store.last} {store.first}</span>
        </div>
      `
      .register('proxy-store-contact-detail');

    container.innerHTML = [
      '<proxy-store-contact-list></proxy-store-contact-list>',
      '<proxy-store-contact-detail></proxy-store-contact-detail>',
    ].join('');
    await customElements.whenDefined('proxy-store-contact-list');
    await customElements.whenDefined('proxy-store-contact-detail');

    /** @type {InstanceType<ContactList>} */
    const list = container.querySelector('proxy-store-contact-list');
    /** @type {InstanceType<ContactDetail>} */
    const detail = container.querySelector('proxy-store-contact-detail');

    const shared = createSharedProxy(DATA);
    list.store = shared;
    detail.store = shared.contacts[0];

    let rows = list.shadowRoot.querySelectorAll('.desc');
    assert.equal(rows.length, 2);
    assert.equal(rows[1].textContent, 'Turing, Alan');
    assert.equal(detail.shadowRoot.querySelector('.detail').textContent, 'Lovelace Ada');

    shared.contacts[1].first = 'Bea';

    rows = list.shadowRoot.querySelectorAll('.desc');
    assert.equal(rows[1].textContent, 'Turing, Bea');
    assert.equal(detail.shadowRoot.querySelector('.detail').textContent, 'Lovelace Ada');

    detail.store.first = 'Ada2';
    rows = list.shadowRoot.querySelectorAll('.desc');
    assert.equal(rows[0].textContent, 'Lovelace, Ada2');
    assert.equal(detail.shadowRoot.querySelector('.detail').textContent, 'Lovelace Ada2');
  });
});
