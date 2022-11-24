import Composition from './Composition.js';
import { parseIDLOptions } from './observe.js';
import { generateFragment, html } from './template.js';

/** @template T1 @template T2 @typedef {import('./observe.js').IDLOptions<T1,T2>} IDLOptions<T1,T2> */

/** @typedef {import('./observe.js').IDLOptionType} IDLOptionType */
/** @template T @typedef {import('./observe.js').ParsedIDLType<T>} ParsedIDLType<T> */

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
    return [...this.idls.values()]
      .filter((options) => options.attr && (options.reflect === true || options.reflect === 'read'))
      .map(({ attr }) => attr);
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

  static get adoptedStyleSheets() {
    if (!this.hasOwnProperty('_adoptedStyleSheets')) {
      this._adoptedStyleSheets = /** @type {CSSStyleSheet[]} */ (this.styles
        .filter((style) => style instanceof CSSStyleSheet));
    }
    return this._adoptedStyleSheets;
  }

  /**
   * @template {IDLOptionType} [T1=any]
   * @template {any} [T2=ParsedIDLType<T1>]
   * @param {string} name
   * @param {T1|IDLOptions<T1,T2>} [typeOrOptions='string']
   * @return {unknown extends T2 ? string : T2}
   */
  static idl(name, typeOrOptions) {
    const options = parseIDLOptions(name, typeOrOptions);

    this.idls.set(name, options);

    Object.defineProperty(this.prototype, name, {
      enumerable: options.enumerable,
      /**
       * @this {CustomElement}
       * @return {any}
       */
      get() {
        if (!options.values.has(this)) return options.default;
        return options.values.get(this) ?? (options.nullable ? null : options.empty);
      },
      /**
       * @this {CustomElement}
       * @param {any} value
       * @return {void}
       */
      set(value) {
        if (value === CustomElement.IDL_INIT) return;
        // console.log('set:', this.constructor.name, name, value);
        const previousValue = this[name];
        let newValue = value;
        if (!options.nullable && value == null) {
          newValue = options.onNullish ? options.onNullish(value) : options.empty;
        }

        if (previousValue == null && newValue == null) return;
        // Object.is()?
        if (previousValue === newValue) return;
        let parsedValue;
        /** @type {?string} */
        let attrValue;
        switch (options.type) {
          case 'boolean':
            parsedValue = !!newValue;
            attrValue = parsedValue ? '' : null;
            break;
          case 'integer':
          case 'float':
            if (newValue == null) {
              parsedValue = null;
              attrValue = null;
            } else {
              if (typeof newValue !== 'number') {
                throw new TypeError('Value must be a number');
              }
              parsedValue = newValue;
              attrValue = String(newValue);
            }
            break;
          // case 'string':
          default:
            if (newValue == null) {
              parsedValue = null;
              attrValue = null;
            } else {
              parsedValue = String(newValue);
              attrValue = parsedValue;
            }
        }
        if (previousValue === parsedValue) return;
        const lastAttrValue = options.attrValues.get(this);

        options.values.set(this, parsedValue);
        options.attrValues.set(this, attrValue);

        // console.log(this.static.name, 'Property change: idlChangedCallback', { name, previousValue, parsedValue });
        this.idlChangedCallback(name, previousValue, parsedValue);

        if (!options.reflect) return;
        if (lastAttrValue == null && attrValue == null) return;
        if (lastAttrValue === attrValue) return;

        if (attrValue == null) {
          this.removeAttribute(options.attr);
        } else {
          this.setAttribute(options.attr, attrValue);
        }
      },
    });

    return /** @type {any} */ (CustomElement.IDL_INIT);
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
  refs = new Proxy({}, {
    /**
     * @param {any} target
     * @param {string} id
     * @return {HTMLElement}
     */
    // @ts-ignore
    get: (target, id) => this.composition.getElement(this.shadowRoot, { id }),
  });

  /** @param {any[]} args */
  constructor(...args) {
    super();
    this.#attachShadow();
    this.#attachStyles();
    this.#attachContent();
    this.#attachInternals();
    this.#attachARIA();
  }

  /**
   * Updates component nodes based on data
   * Expects data in JSON Merge Patch format
   * @see https://www.rfc-editor.org/rfc/rfc7386
   * @param {?} data
   * @return {void}
   */
  render(data) {
    this.composition.render(this.shadowRoot, data, this);
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   * @return {void}
   */
  idlChangedCallback(name, oldValue, newValue) {
    this.render({ [name]: newValue });
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // TODO: Index attribute names?
    for (const [key, options] of this.static.idls) {
      if (options.attr !== name) continue;
      const previousDataValue = options.values.get(this);
      if (options.attrValues.get(this) === newValue) return;

      let parsedValue;
      switch (options.type) {
        case 'boolean':
          parsedValue = newValue != null;
          break;
        case 'string':
          parsedValue = newValue;
          break;
        case 'integer':
          if (newValue == null) {
            parsedValue = null;
          } else {
            const numValue = Number.parseInt(newValue, 10);
            parsedValue = Number.isNaN(numValue) ? null : numValue;
          }
          break;
        case 'float':
          if (newValue == null) {
            parsedValue = null;
          } else {
            const numValue = Number.parseFloat(newValue);
            parsedValue = Number.isNaN(numValue) ? null : numValue;
          }
          break;
        default:
      }
      if (!options.nullable && parsedValue == null) {
        parsedValue = options.empty;
      }
      if (parsedValue === previousDataValue) {
        // No internal value change
        return;
      }
      options.values.set(this, parsedValue);
      options.attrValues.set(this, newValue);
      this.idlChangedCallback(key, previousDataValue, parsedValue);
    }
  }

  #attachShadow() {
    this.attachShadow({ mode: 'open', delegatesFocus: this.static.delegatesFocus });
  }

  #attachStyles() {
    if (!CustomElement.supportsAdoptedStyleSheets) return;
    this.shadowRoot.adoptedStyleSheets = this.static.adoptedStyleSheets;
  }

  #attachContent() {
    this.composition.initialRender(this.shadowRoot, this);
  }

  #attachInternals() {
    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }
  }

  #attachARIA() {
    if (this.static.supportsElementInternalsRole) {
      this.elementInternals.role = this.static.ariaRole;
    } else if (!this.hasAttribute('role')) {
      this.setAttribute('role', this.static.ariaRole);
    }
  }

  get unique() { return false; }

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
