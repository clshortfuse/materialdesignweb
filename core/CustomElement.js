import Composition from './Composition.js';
import { attrNameFromPropName, attrValueFromDataValue, findElement } from './dom.js';
import { defineObservableProperty } from './observe.js';
import { html } from './template.js';

/** @typedef {import('./observe.js').ObserverPropertyType} ObserverPropertyType */
/** @template T @typedef {import('./observe.js').ParsedObserverPropertyType<T>} ParsedObserverPropertyType<T> */

/**
 * @template {ObserverPropertyType} T1
 * @template {any} [T2=any]
 * @typedef IDLOptions
 * @prop {T1} [type]
 * @prop {string} [attr]
 * @prop {boolean|'write'|'read'} [reflect=true]
 * @prop {boolean} [enumerable]
 * @prop {boolean} [nullable] Defaults to false if boolean
 * @prop {T2} [empty] Empty value when not nullable
 * @prop {(value: T2) => T2} [onNullish] Function used when null passed
 * @prop {T2} [default] Initial value (empty value if not specified)
 * @prop {boolean} [initialized]
 * @prop {WeakMap<CustomElement, T2>} [values]
 * @prop {WeakMap<CustomElement, string>} [attrValues]
 */

/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
  /** @type {string} */
  static elementName = null;

  static ariaRole = 'none';

  static delegatesFocus = false;

  /** @return {Iterable<string>} */
  static get observedAttributes() {
    const s = new Set();
    for (const config of this.idls.values()) {
      if (config.reflect === true || config.reflect === 'read') {
        s.add(config.attr);
      }
    }
    return s;
  }

  /** @type {import('./Composition.js').Compositor<?>} */
  compose(...parts) {
    if (this.#composition) {
      console.warn('Already composed. Generating *new* composition...');
    }
    this.#composition = new Composition(
      ...parts,
    );
    return this.#composition;
  }

  /** @type {Composition<?>} */
  static _composition = null;

  /** @type {Map<string, import('./observe.js').ObserverConfiguration<?,?,?,?> & {reflect:boolean|'read'|'write', attr:string}>} */
  static _idls = new Map();

  /** @type {WeakSet<Function>} */
  static _reusableFunctions = new WeakSet();

  static interpolatesTemplate = true;

  static supportsElementInternals = 'attachInternals' in HTMLElement.prototype;

  static supportsElementInternalsRole = CustomElement.supportsElementInternals
    && 'role' in ElementInternals.prototype;

  static IDL_INIT = Symbol('IDL_INIT');

  /** @type {boolean} */
  static templatable = null;

  static defined = false;

  static autoRegistration = true;

  /** @type {Map<string, typeof CustomElement>} */
  static registrations = new Map();

  static autoRegister() {
    queueMicrotask(() => {
      if (this.autoRegistration) {
        this.register();
      }
    });
  }

  /**
   * @param {string} [elementName]
   * @param {boolean} [force=false]
   * @return {string}
   */
  static register(elementName, force = false) {
    const name = elementName || this.elementName;
    if (this.hasOwnProperty('defined') && this.defined && !force) {
      // console.warn(name, 'already registered.');
      return this.elementName;
    }

    if (this.elementName !== name) {
      // console.log('Changing', this.elementName, '=>', name);
      this.elementName = name;
    }
    customElements.define(name, this);
    CustomElement.registrations.set(name, this);
    this.defined = true;
    return this.elementName;
  }

  static get idls() {
    if (!this.hasOwnProperty('_idls')) {
      this._idls = new Map(this._idls);
    }
    return this._idls;
  }

  /**
   * @template {ObserverPropertyType} [T1=null]
   * @template {ObserverPropertyType} [T2=null]
   * @template {any} [T3=null]
   * @param {string} name
   * @param {T1|IDLOptions<T2,T3>} [typeOrOptions='string']
   * @return {(
   *    T3 extends null ?
   *        T2 extends null ?
   *          T1 extends null ?
   *            string
   *          : ParsedObserverPropertyType<T1>
   *        : ParsedObserverPropertyType<T2>
   *    : T3
   * )}
   */
  static idl(name, typeOrOptions) {
    /** @type {IDLOptions<?,?>} */
    const options = {
      ...((typeof typeOrOptions === 'string') ? { type: typeOrOptions } : typeOrOptions),
    };

    let { enumerable, attr, reflect } = options;
    enumerable ??= name[0] !== '_';
    reflect ??= enumerable ? true : (attr ? 'write' : false);
    attr ??= (reflect ? attrNameFromPropName(name) : null);

    const config = defineObservableProperty(this.prototype, name, {
      ...options,
      changedCallback: this.prototype._onObserverPropertyChanged,
    });

    this.idls.set(name, {
      ...config,
      reflect,
      attr,
    });

    return /** @type {any} */ (config.default);
  }

  /** @type {Record<string, HTMLElement>}} */
  #refsProxy;

  /** @type {Composition<?>} */
  #composition;

  /** @type {Map<string,string|null>} */
  _idlAttributeCache;

  /** @param {any[]} args */
  constructor(...args) {
    super();

    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
      this.elementInternals.role = this.static.ariaRole;
    } else if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.static.ariaRole);
    }

    this.attachShadow({ mode: 'open', delegatesFocus: this.static.delegatesFocus });

    this.composition.initialRender(this.shadowRoot, this);
  }

  /**
   * Updates component nodes based on data
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {?} data
   * @return {void}
   */
  render(data) {
    // console.log('render', data);
    this.composition.render(this.shadowRoot, data, this);
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   * @return {void}
   */
  idlChangedCallback(name, oldValue, newValue) {
    // console.log('idlChangedCallback', name, oldValue, newValue);
    this.render({ [name]: newValue });
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(this.tagName, 'attributeChangedCallback', name, oldValue, newValue, '.');

    for (const config of this.static.idls.values()) {
      if (config.attr !== name) continue;
      if (config.reflect !== true && config.reflect !== 'read') continue;

      const attrValue = this.attributeCache.get(name) ?? null;
      if (attrValue === newValue) return;

      // @ts-expect-error any
      const previousDataValue = this[config.key];
      const parsedValue = newValue == null
        ? config.nullParser(newValue)
        : (config.type === 'boolean' ? true : config.parser(newValue));

      if (parsedValue === previousDataValue) {
        // No internal value change
        return;
      }
      config.values.set(this, parsedValue);
      this.attributeCache.set(name, newValue);
      this.idlChangedCallback(config.key, previousDataValue, parsedValue);
      return;
    }
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   */
  _onObserverPropertyChanged(name, oldValue, newValue) {
    const { reflect, attr } = this.static.idls.get(name);
    if (attr && (reflect === true || reflect === 'write')) {
      const attrValue = attrValueFromDataValue(newValue);
      const lastAttrValue = this.attributeCache.get(attr) ?? null;
      if (lastAttrValue !== attrValue) {
        this.attributeCache.set(attr, attrValue);
        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        }
      }
    }

    // Invoke change => render
    this.idlChangedCallback(name, oldValue, newValue);
  }

  /**
   * Wraps composeHtml with bind to `this` (not natively set with tagged template literals)
   * @return {import('./template.js').HTMLTemplater<this>}
   */
  get html() {
    if (!this._html) {
      this._html = html.bind(this);
    }
    return this._html;
  }

  get refs() {
    // eslint-disable-next-line no-return-assign
    return (this.#refsProxy ??= new Proxy({}, {
      /**
       * @param {any} target
       * @param {string} id
       * @return {Element}
       */
      get: (target, id) => {
        if (!this.#composition) {
          console.warn(this.static.name, 'Attempted to access references before composing!');
        }
        const composition = this.composition;
        if (!composition.interpolated) {
          console.warn('Returning template reference');
          return findElement(composition.template, { id });
        }
        return composition.getElement(this.shadowRoot, { id });
      },
    }));
  }

  get attributeCache() {
    this._idlAttributeCache ??= new Map();
    return this._idlAttributeCache;
  }

  get tabIndex() {
    return super.tabIndex;
  }

  set tabIndex(value) {
    if (value === super.tabIndex && value !== -1) {
      // Non -1 value already set
      return;
    }

    if (this.static.delegatesFocus && document.activeElement === this) {
      if (this.getAttribute('tabindex') === value.toString()) {
        // Skip if possible
        return;
      }

      // Chrome blurs on tabindex changes with delegatesFocus
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1346606
      const listener = (e) => {
        e.stopImmediatePropagation();
        this.focus(); // Give focus back
      };
      this.addEventListener('blur', listener, { capture: true, once: true });
      console.warn('Skipping blur');
      super.tabIndex = value;
      this.removeEventListener('blur', listener);
      return;
    }

    super.tabIndex = value;
  }

  get static() { return /** @type {typeof CustomElement} */ (/** @type {unknown} */ (this.constructor)); }

  get unique() { return false; }

  /** @return {Composition<?>} */
  get composition() {
    if (this.#composition) return this.#composition;

    if (!this.unique && this.static.hasOwnProperty('_composition')) {
      this.#composition = this.static._composition;
      return this.static._composition;
    }

    this.compose();

    if (!this.unique) {
      // Cache compilation into static property
      this.static._composition = this.#composition;
    }

    return this.#composition;
  }

  connectedCallback() {
    // In case author calls super.connectedCallback();
  }

  disconnectedCallback() {
    // In case author calls super.disconnectedCallback();
  }
}
