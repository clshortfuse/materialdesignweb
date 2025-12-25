/* eslint-disable max-classes-per-file */
import { assert } from '@esm-bundle/chai';

import '../../loaders/theme.js';
import CustomElement from '../../core/CustomElement.js';
import { html } from '../utils.js';

/** @template T extends object */
class UserStore {
  /** @type {T|null} */
  _data = null;

  _et = new EventTarget();

  /** @type {Map<Function, EventListener>} */
  _wrappers = new Map();

  constructor() {
    this.reset();
  }

  reset() {
    this._data = null;
    this._et = new EventTarget();
    this._wrappers = new Map();
  }

  /** @return {T|null} */
  get() { return this._data; }

  /** @param {Partial<T>} obj */
  set(obj) {
    this._data = /** @type {T} */ (this._data ? Object.assign(this._data, obj) : ({ ...obj }));
    this._et.dispatchEvent(new CustomEvent('put', { detail: this._data }));
    this._et.dispatchEvent(new CustomEvent('patch', { detail: { patch: this._data, data: this._data } }));
  }

  /**
   * @param {Partial<T>} patch
   */
  patch(patch) {
    Object.assign(this._data, patch);
    this._et.dispatchEvent(new CustomEvent('patch', { detail: { patch, data: this._data } }));
  }

  /**
   * @template {'put'|'patch'} K
   * @param {K} name
   * @param {K extends 'patch' ? ((patch: Partial<T>, data: T) => void) : (K extends 'put' ? ((data: T) => void) : ((details: Partial<T>) => void))} handler
   * @return {EventListener}
   */
  on(name, handler) {
    /** @type {EventListener} */
    const wrapper = (/** @type {CustomEvent<Partial<T> | {patch: Partial<T>; data: T}>} */ e) => {
      const detail = /** @type {any} */ (e && e.detail);
      if (name === 'patch') {
        const d = /** @type {{patch: Partial<T>; data: T}} */ (detail);
        /** @type {(patch: Partial<T>, data: T) => void} */ (handler)(d.patch, d.data);
      } else {
        /** @type {(details: Partial<T>) => void} */ (handler)(/** @type {Partial<T>} */ (detail));
      }
    };
    this._wrappers.set(handler, wrapper);
    this._et.addEventListener(name, wrapper);
    return wrapper;
  }

  /**
   * @param {string} name
   * @param {Function} handler
   * @return {null}
   */
  off(name, handler) {
    const wrapper = this._wrappers.get(handler);
    if (wrapper) {
      this._et.removeEventListener(name, wrapper);
    }
    this._wrappers.delete(handler);
    return null;
  }
}

/**
 * @typedef UserObject
 * @prop {string} name
 * @prop {Object} address
 * @prop {string} address.city
 * @prop {string} address.state
 */

/** @type {UserStore<UserObject>} */
const store = new UserStore();

beforeEach(() => {
  document.body.replaceChildren();
  store.reset();
});

describe('STATE — MVP patterns (spec style)', () => {
  it('full state assignment updates DOM', async () => {
    CustomElement
      .extend()
      .observe({
        _user: {
          type: 'object',
          /** @type {UserObject} */
          value: null,
        },
        busy: 'boolean',
      })
      .set({
        /** @type {EventListener} */
        _listener: null,
      })
      .expressions({
        fullAddress({ _user }) {
          if (!_user?.address) return '';
          return `${_user.address.city}, ${_user.address.state}`;
        },
      })
      .html`<div id="name">{_user.name}</div><div id="addr">{fullAddress}</div>`
      .on({
        connected() {
          this._listener = store.on('put', (user) => {
            this._user = user;
          });
          this._user = store.get();
        },
        disconnected() {
          this._listener = store.off('put', this._listener);
        },
      })
      .autoRegister('spec-demo-full');

    const el = html`<spec-demo-full></spec-demo-full>`;
    await customElements.whenDefined('spec-demo-full');
    await Promise.resolve();

    store.set({ name: 'Pat Full', address: { city: 'Austin', state: 'TX' } });
    await new Promise((r) => setTimeout(r, 0));

    const name = el.shadowRoot.querySelector('#name').textContent;
    const addr = el.shadowRoot.querySelector('#addr').textContent;
    assert.equal(name, 'Pat Full');
    assert.equal(addr, 'Austin, TX');
  });

  it('partial/patch updates update expressions/dom selectively', async () => {
    CustomElement
      .extend()
      .observe(
        {
          name: 'string',
          address: {
            type: 'object',
            /** @type {UserObject['address']} */
            value: null,
          },
          busy: 'boolean',
        },
      )
      .set({
        /** @type {EventListener} */
        _listener: null,
      })
      .expressions({
        fullAddress({ address }) {
          if (!address) return '';
          return `${address.city}, ${address.state}`;
        },
      })
      .html`
        <div id="name">{name}</div>
        <div id="addr">{fullAddress}</div>
      `
      .on({
        connected() {
          this._listener = store.on('put', (data) => {
            // this.name = data.name;
            // this.address = data.address;

            // Use helper to patch only changed properties in batch
            this.patch(data);
          });

          const initial = store.get();
          // this.name = initial?.name;
          // this.address = initial?.address;

          // Use helper to patch only changed properties in batch
          this.patch(initial);
        },
        disconnected() {
          this._listener = store.off('put', this._listener);
        },
      })
      .autoRegister('spec-demo-partial');

    const el = html`<spec-demo-partial></spec-demo-partial>`;
    await customElements.whenDefined('spec-demo-partial');
    await Promise.resolve();

    store.set({ name: 'Pat', address: { city: 'Austin', state: 'TX' } });
    await new Promise((r) => setTimeout(r, 0));

    assert.equal(el.shadowRoot.querySelector('#name').textContent, 'Pat');
    assert.equal(el.shadowRoot.querySelector('#addr').textContent, 'Austin, TX');

    store.set({ name: 'Pat Updated' });
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(el.shadowRoot.querySelector('#name').textContent, 'Pat Updated');
    assert.equal(el.shadowRoot.querySelector('#addr').textContent, 'Austin, TX');
  });

  it('stateless: presenter provides patch and optional data to render(patch, data)', async () => {
    CustomElement
      .extend()
      .observe({
        busy: 'boolean',
      })
      .set({
        /** @type {EventListener} */
        _onPatch: null,
      })
      .expressions({
        // @ts-ignore weak type
        fullAddress({ address }) {
          if (!address) return '';
          return `${address.city}, ${address.state}`;
        },
      })
      .html`<div id="name">{name}</div><div id="addr">{fullAddress}</div>`
      .on({
        connected() {
          this._onPatch = store.on('patch', (patch, data) => {
            this.render(patch, data);
          });
          this.render(store.get());
        },
        disconnected() {
          store.off('patch', this._onPatch);
        },
      })
      .autoRegister('spec-demo-stateless');

    const el = html`<spec-demo-stateless></spec-demo-stateless>`;
    await customElements.whenDefined('spec-demo-stateless');
    await Promise.resolve();

    store.set({ name: 'Stateless', address: { city: 'Seattle', state: 'WA' } });
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(el.shadowRoot.querySelector('#name').textContent, 'Stateless');

    store.patch({ name: 'Stateless Patched' });
    await new Promise((r) => setTimeout(r, 0));
    assert.equal(el.shadowRoot.querySelector('#name').textContent, 'Stateless Patched');
  });
});
