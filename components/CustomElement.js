/** @typedef {'boolean'|'integer'|'float'|'string'} IDLOptionType */

/**
 * @template {IDLOptionType} T
 * @typedef IDLOptions
 * @prop {T} type
 * @prop {string} [attrName]
 * @prop {string} [propName]
 */

/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
  static supportsAdoptedStyleSheets = 'adoptedStyleSheets' in ShadowRoot.prototype;

  static supportsElementInternals = 'attachInternals' in HTMLElement.prototype;

  static supportsElementInternalsRole = CustomElement.supportsElementInternals
    && 'role' in ElementInternals.prototype;

  static ariaRole = 'none';

  static delegatesFocus = false;

  /** @type {Iterable<string>} */
  static get observedAttributes() {
    return this.getIdlMap().keys();
  }

  /** @type {(DocumentFragment|string)[]} */
  static fragments = [];

  /** @type {(string|URL|CSSStyleSheet)[]} */
  static styles = [];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == null && newValue == null) return;
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const map = CustomElement.idlCache.get(component);
    if (!map) return;
    const options = map.get(name);
    if (!options) return;
    const tuple = this.#getIdlValue(name);
    if (tuple[1] === newValue) return;
    tuple[1] = newValue;
    switch (options.type) {
      case 'boolean':
        tuple[0] = newValue != null;
        break;
      case 'string':
        tuple[0] = newValue;
        break;
      case 'integer':
        if (newValue == null) {
          tuple[0] = null;
        } else {
          const numValue = Number.parseInt(newValue, 10);
          tuple[0] = Number.isNaN(numValue) ? null : numValue;
        }
        break;
      case 'float':
        if (newValue == null) {
          tuple[0] = null;
        } else {
          const numValue = Number.parseFloat(newValue);
          tuple[0] = Number.isNaN(numValue) ? null : numValue;
        }
        break;
      default:
    }
  }

  constructor() {
    super();
    this.#attachIDLs();
    this.#attachShadow();
    this.#attachStyles();
    this.#attachContent();
    this.#attachInternals();
    this.#attachARIA();
  }

  #attachShadow() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    this.attachShadow({ mode: 'open', delegatesFocus: component.delegatesFocus });
  }

  #attachStyles() {
    if (!CustomElement.supportsAdoptedStyleSheets) return;
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    let array = CustomElement.#stylesCache.get(component);
    if (!array) {
      // @ts-ignore Skip cast
      array = component.styles.filter((style) => style instanceof CSSStyleSheet);
      CustomElement.#stylesCache.set(component, array);
    }
    this.shadowRoot.adoptedStyleSheets = array;
  }

  #attachContent() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    let content = CustomElement.#fragmentCache.get(component);
    if (!content) {
      content = document.createDocumentFragment();
      content.append(
        ...component.styles.map((style) => {
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
        ...component.fragments.map((fragment) => {
          if (typeof fragment === 'string') {
            return document.createRange().createContextualFragment(fragment);
          }
          return fragment;
        }),
      );
      CustomElement.#fragmentCache.set(component, content);
    }
    this.shadowRoot.prepend(content.cloneNode(true));
  }

  #attachInternals() {
    if (CustomElement.supportsElementInternals) {
      this.elementInternals = this.attachInternals();
    }
  }

  #attachARIA() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    if (component.supportsElementInternalsRole) {
      this.elementInternals.role = component.ariaRole;
    } else {
      if (this.hasAttribute('role')) return;
      this.setAttribute('role', component.ariaRole);
    }
  }

  /**
   * Converts attribute name to property name
   * (Similar to DOMStringMap)
   * @param {string} name
   * @return {string}
   */
  static attrNameToPropName(name) {
    const propNameWords = name.split('-');
    if (propNameWords.length === 1) return name;
    return propNameWords.reduce((prev, curr) => {
      if (prev == null) return curr;
      return prev + curr[0].toUpperCase() + curr.slice(1);
    });
  }

  #attachIDLs() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    for (const [key, options] of CustomElement.idlCache.get(component) ?? []) {
      const propName = options.propName ?? CustomElement.attrNameToPropName(key);
      switch (options.type) {
        case 'boolean':
          Object.defineProperty(this, propName, {
            enumerable: true,
            get() {
              const tuple = this.#getIdlValue(key);
              return tuple[0];
            },
            set(value) {
              const parsedValue = !!value;
              this.#storeIdl(key, parsedValue, parsedValue ? '' : null);
              this.toggleAttribute(key, parsedValue);
            },
          });
          break;
        case 'integer':
        case 'float':
          Object.defineProperty(this, propName, {
            enumerable: true,
            get() {
              return this.#getIdlValue(key)[0];
            },
            set(value) {
              if (value == null) {
                this.#storeIdl(key, null);
                this.removeAttribute(key);
                return;
              }
              if (typeof value !== 'number') throw new TypeError('Value must be a number');
              const stringValue = String(value);
              this.#storeIdl(key, value, stringValue);
              this.setAttribute(key, stringValue);
            },
          });
          break;
        case 'string':
          Object.defineProperty(this, propName, {
            enumerable: true,
            get() {
              return this.#getIdlValue(key)[0];
            },
            set(value) {
              if (value == null) {
                this.#storeIdl(key, null);
                this.removeAttribute(key);
                return;
              }
              const stringValue = String(value);
              this.#storeIdl(key, stringValue, stringValue);
              this.setAttribute(key, stringValue);
            },
          });
          break;
        default:
      }
    }
  }

  /**
   * @this {typeof CustomElement}
   * @param {string} [elementName]
   */
  static register(elementName) {
    customElements.define(elementName || this.elementName, this);
  }

  /** @type {WeakMap<typeof CustomElement, DocumentFragment>} */
  static #fragmentCache = new WeakMap();

  /** @type {WeakMap<typeof CustomElement, CSSStyleSheet[]>} */
  static #stylesCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, Map<string, IDLOptions<?>>>}
   */
  static idlCache = new WeakMap();

  /** @type {string} */
  static elementName = null;

  /** @type {Map<string,[boolean|number|string,string]>} */
  #idlValues = new Map();

  static getIdlMap() {
    let map = this.idlCache.get(this);
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let parent = this;
      let parentMap;
      while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
        parentMap = this.idlCache.get(parent);
        if (parentMap) break;
      }
      map = new Map(parentMap);
      this.idlCache.set(this, map);
    }
    return map;
  }

  /**
   * @template {IDLOptionType} T
   * @param {string} name
   * @param {IDLOptions<T>} options
   * @return {T extends 'boolean' ? boolean : T extends 'integer'|'float' ? number : T extends 'string' ? string : unknown}
   */
  static idl(name, options) {
    const map = this.getIdlMap();
    map.set(name, options);
    return null;
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {boolean}
   */
  static idlBoolean(attrName, propName) {
    return this.idl(attrName, { type: 'boolean', attrName, propName });
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {number}
   */
  static idlInteger(attrName, propName) {
    return this.idl(attrName, { type: 'integer', attrName, propName });
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {number}
   */
  static idlFloat(attrName, propName) {
    return this.idl(attrName, { type: 'float', attrName, propName });
  }

  /**
   * @param {string} attrName
   * @param {string} [propName]
   * @return {string}
   */
  static idlString(attrName, propName) {
    return this.idl(attrName, { type: 'string', attrName, propName });
  }

  /**
   * @param {string} key
   * @param {boolean|number|string} value
   * @param {string} stringValue
   * @return {void}
   */
  #storeIdl(key, value, stringValue) {
    const tuple = this.#getIdlValue(key);
    tuple[0] = value;
    tuple[1] = stringValue;
  }

  /**
   * @param {string} key
   * @return {[boolean|number|string,string]}
   */
  #getIdlValue(key) {
    let value = this.#idlValues.get(key);
    if (!value) {
      value = [null, null];
      this.#idlValues.set(key, value);
    }
    return value;
  }
}
