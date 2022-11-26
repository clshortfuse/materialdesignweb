import Composition from './Composition.js';
import { attrNameFromPropName, attrValueFromDataValue } from './dom.js';
import { defineObservableProperty } from './observe.js';
import { generateFragment, html } from './template.js';

/**
 * @template {import('./observe.js').ObserverPropertyType} T1
 * @template {any} T2
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
 * @prop {WeakMap<CustomElement, T1>} [values]
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

  /** @type {Iterable<string>} */
  static get observedAttributes() {
    return this.readAttributeIdls.keys();
  }

  /** @type {(string|URL|CSSStyleSheet)[]} */
  static styles = [];

  /** @type {(DocumentFragment|string)[]} */
  static fragments = [];

  /** @type {?DocumentFragment} */
  static get template() {
    if (!this.hasOwnProperty('_template')) {
      this._template = generateFragment();
      this._template.append(
        ...this.styles.map((style) => {
          if (typeof style === 'string') {
            const el = document.createElement('style');
            el.textContent = style;
            return el;
          }
          if (style instanceof URL) {
            const el = document.createElement('link');
            el.rel = 'stylesheet';
            el.href = style.href;
            return el;
          }
          if (CustomElement.supportsAdoptedStyleSheets) return null;
          const el = document.createElement('style');
          el.textContent = [...style.cssRules].map((r) => r.cssText).join('\n');
          return el;
        }).filter(Boolean),
        ...this.fragments.map((f) => ((typeof f === 'string') ? generateFragment(f) : f)),
      );
    }

    return this._template;
  }

  /** @type {Iterable<((data: Partial<any>) => any)>} */
  static get watchers() { return []; }

  /** @type {Composition<?>} */
  static _composition = null;

  /** @type {Map<string, IDLOptions<?,?>>} */
  static _idls = new Map();

  /** @type {Map<keyof any & string, Attr['name']>} */
  static _writeAttributeIdls = new Map();

  /** @type {Map<Attr['name'],import('./observe.js').ObserverConfiguration<?,?,?>} */
  static _readAttributeIdls = new Map();

  /** @type {WeakSet<Function>} */
  static _reusableFunctions = new WeakSet();

  /** @type {CSSStyleSheet[]} */
  static _adoptedStyleSheets = [];

  static interpolatesTemplate = true;

  static supportsAdoptedStyleSheets = 'adoptedStyleSheets' in ShadowRoot.prototype;

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

  static get readAttributeIdls() {
    if (!this.hasOwnProperty('_readAttributeIdls')) {
      this._readAttributeIdls = new Map(this._readAttributeIdls);
    }
    return this._readAttributeIdls;
  }

  static get writeAttributeIdls() {
    if (!this.hasOwnProperty('_writeAttributeIdls')) {
      this._writeAttributeIdls = new Map(this._writeAttributeIdls);
    }
    return this._writeAttributeIdls;
  }

  static get adoptedStyleSheets() {
    if (!this.hasOwnProperty('_adoptedStyleSheets')) {
      this._adoptedStyleSheets = /** @type {CSSStyleSheet[]} */ (this.styles
        .filter((style) => style instanceof CSSStyleSheet));
    }
    return this._adoptedStyleSheets;
  }

  /**
   * @template {import('./observe.js').ObserverPropertyType} [T1=any]
   * @template {any} [T2=import('./observe.js').ParsedObserverPropertyType<T1>]
   * @param {string} name
   * @param {T1|IDLOptions<T1,T2>} [typeOrOptions='string']
   * @return {unknown extends T2 ? string : T2}
   */
  static idl(name, typeOrOptions) {
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

    if (reflect === true || reflect === 'read') {
      // console.log(this.name, 'adding read attribute', attr, config);
      this.readAttributeIdls.set(attr, config);
    }
    if (reflect === true || reflect === 'write') {
      // console.log(this.name, 'adding write attribute', name, attr);
      this.writeAttributeIdls.set(name, attr);
    }
    return /** @type {any} */ (config.default);
  }

  /**
   * Wraps composeHtml with bind to `this` (not natively set with tagged template literals)
   * @return {import('./template.js').HTMLTemplater<?>}
   */
  static get html() {
    if (!this._html) {
      this._html = html.bind(this);
    }
    return this._html;
  }

  /** @type {Record<string, HTMLElement>}} */
  #refsProxy;

  /** @type {Map<string,string|null>} */
  _idlAttributeCache;

  /** @param {any[]} args */
  constructor(...args) {
    super();

    this.attachShadow({ mode: 'open', delegatesFocus: this.static.delegatesFocus });

    if (!CustomElement.supportsAdoptedStyleSheets) {
      this.shadowRoot.adoptedStyleSheets = this.static.adoptedStyleSheets;
    }

    this.composition.initialRender(this.shadowRoot, this);

    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }

    if (this.static.supportsElementInternalsRole) {
      this.elementInternals.role = this.static.ariaRole;
    } else if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.static.ariaRole);
    }
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
    const config = this.static.readAttributeIdls.get(name);
    if (!config) return;
    const attrValue = this.attributeCache.get(name) ?? null;
    if (attrValue === newValue) return;

    const previousDataValue = this[config.key];
    const parsedValue = newValue == null
      ? config.nullParser(newValue)
      : (config.parser === Boolean ? true : config.parser(newValue));

    if (parsedValue === previousDataValue) {
      // No internal value change
      return;
    }
    config.values.set(this, parsedValue);
    this.attributeCache.set(name, newValue);
    this.idlChangedCallback(name, previousDataValue, parsedValue);
  }

  _onObserverPropertyChanged(name, oldValue, newValue) {
    const attrName = this.static.writeAttributeIdls.get(name);
    if (attrName) {
      const attrValue = attrValueFromDataValue(newValue);
      const lastAttrValue = this.attributeCache.get(attrName) ?? null;
      if (lastAttrValue !== attrValue) {
        this.attributeCache.set(attrName, attrValue);
        if (attrValue == null) {
          this.removeAttribute(attrName);
        } else {
          this.setAttribute(attrName, attrValue);
        }
      }
    }

    // Invoke render
    this.idlChangedCallback(name, oldValue, newValue);
  }

  get refs() {
    // eslint-disable-next-line no-return-assign
    return (this.#refsProxy ??= new Proxy({}, {
      /**
       * @param {any} target
       * @param {string} id
       * @return {HTMLElement}
       */
      // @ts-ignore
      get: (target, id) => this.composition.getElement(this.shadowRoot, { id }),
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

  /** @return {Composition<?>} */
  get composition() {
    if (this.static.hasOwnProperty('_composition')) {
      return this.static._composition;
    }

    const composition = new Composition(this.static.template, this);

    for (const watcher of this.static.watchers) {
      composition.bindWatcher(watcher, this);
    }
    this.static._composition = composition;

    return composition;
  }

  connectedCallback() {
    // In case author calls super.connectedCallback();
  }

  disconnectedCallback() {
    // In case author calls super.disconnectedCallback();
  }
}
