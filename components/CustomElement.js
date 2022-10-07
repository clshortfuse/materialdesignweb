/** @typedef {'boolean'|'integer'|'float'|'string'} IDLOptionType */

/**
 * @template {IDLOptionType} T
 * @typedef IDLOptions
 * @prop {T} type
 * @prop {string} [attrName]
 * @prop {string} [propName]
 */

/**
 * @typedef RefOptions
 * @prop {string} [id]
 * @prop {string} [class]
 * @prop {string} [query]
 */

/**
 * @template {keyof HTMLElementTagNameMap|Function|undefined} T
 * @typedef {T extends undefined ? undefined : T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : T extends Function ? InstanceType<T> : HTMLElement } RefType<T>
 */

/**
 * Web Component that can cache templates for minification or performance
 */
export default class CustomElement extends HTMLElement {
  /** @type {string} */
  static elementName = null;

  /** @type {(string|URL|CSSStyleSheet)[]} */
  static styles = [];

  static ariaRole = 'none';

  static delegatesFocus = false;

  /** @type {(DocumentFragment|string)[]} */
  static fragments = [];

  /** @return {DocumentFragment} */
  static compose() {
    const fragment = document.createDocumentFragment();
    fragment.append(
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
      ...this.fragments.map((f) => {
        if (typeof f === 'string') {
          return document.createRange().createContextualFragment(f);
        }
        return fragment;
      }),
    );
    return fragment;
  }

  /** @type {Iterable<string>} */
  static get observedAttributes() {
    return this.idlMap.keys();
  }

  static supportsAdoptedStyleSheets = 'adoptedStyleSheets' in ShadowRoot.prototype;

  static supportsElementInternals = 'attachInternals' in HTMLElement.prototype;

  static supportsElementInternalsRole = CustomElement.supportsElementInternals
    && 'role' in ElementInternals.prototype;

  /** @type {WeakMap<typeof CustomElement, DocumentFragment>} */
  static #fragmentCache = new WeakMap();

  /** @type {WeakMap<typeof CustomElement, CSSStyleSheet[]>} */
  static #stylesCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, Map<string, IDLOptions<?>>>}
   */
  static idlCache = new WeakMap();

  /**
   * @private
   * @type {WeakMap<typeof CustomElement, Map<string, RefOptions>>}
   */
  static refCache = new WeakMap();

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

  /**
   * Converts property name to attribute name
   * (Similar to DOMStringMap)
   * @param {string} name
   * @return {string}
   */
  static propNameToAttrName(name) {
    const attrNameWords = name.split(/([A-Z])/);
    if (attrNameWords.length === 1) return name;
    return attrNameWords.reduce((prev, curr) => {
      if (prev == null) return curr;
      if (curr.length === 1 && curr.toUpperCase() === curr) {
        return `${prev}-${curr.toLowerCase()}`;
      }
      return prev + curr;
    });
  }

  /**
   * @this {typeof CustomElement}
   * @param {string} [elementName]
   */
  static register(elementName) {
    customElements.define(elementName || this.elementName, this);
  }

  static get idlMap() {
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

  static get refMap() {
    let map = this.refCache.get(this);
    if (!map) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let parent = this;
      let parentMap;
      while ((parent = Object.getPrototypeOf(parent)) !== CustomElement) {
        parentMap = this.refCache.get(parent);
        if (parentMap) break;
      }
      map = new Map(parentMap);
      this.refCache.set(this, map);
    }
    return map;
  }

  /**
   * @param {string} name
   * @param {RefOptions} options
   * @return {HTMLElement}
   */
  static ref(name, options) {
    this.refMap.set(name, options);
    return null;
  }

  /**
   * @template {string} T
   * @param  {...T} names
   * @return {{[P in T]: RefType<P> }}
   */
  static addRefNames(...names) {
    for (const name of names) {
      this.ref(name, { id: CustomElement.propNameToAttrName(name) });
    }
    return null;
  }

  /**
   * @template {keyof HTMLElementTagNameMap|Function} T1
   * @template {{id:string,type:T1}} T2
   * @template {Record<string, T1|T2>} T
   * @param {T} options
   * @return {{[P in keyof T]: RefType<T[P] extends T1 ? T[P] : T[P]['type']>}}
   */
  static addRefs(options) {
    for (const [key, value] of Object.entries(options)) {
      const id = typeof value === 'object' ? value?.id : null;
      this.ref(key, { id: id ?? CustomElement.propNameToAttrName(key) });
    }
    return null;
  }

  /**
   * @template {IDLOptionType} T
   * @param {string} name
   * @param {IDLOptions<T>} options
   * @return {T extends 'boolean' ? boolean : T extends 'integer'|'float' ? number : T extends 'string' ? string : unknown}
   */
  static idl(name, options) {
    this.idlMap.set(name, {
      ...options,
      propName: CustomElement.attrNameToPropName(name),
    });
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

  /** @type {Map<string,[boolean|number|string,string]>} */
  #idlValues = new Map();

  /** @type {Map<string,WeakRef<HTMLElement>>} */
  #weakRefs = new Map();

  constructor() {
    super();
    this.#attachIDLs();
    this.#attachShadow();
    this.#attachStyles();
    this.#attachContent();
    this.#attachRefs();
    this.#attachInternals();
    this.#attachARIA();
  }

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
    let content = CustomElement.#fragmentCache.get(component) ?? component.compose();
    if (!content) {
      content = component.compose();
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

  #attachIDLs() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    for (const [key, options] of component.idlMap) {
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

  #attachRefs() {
    const component = /** @type {typeof CustomElement} */ (this.constructor);
    const { refMap } = component;
    const refObject = {};
    for (const [key, options] of refMap) {
      let element;
      if (options.id) {
        element = this.shadowRoot.getElementById(options.id);
      } else if (options.class) {
        element = this.shadowRoot.querySelector(`.${options.class}`);
      } else if (options.query) {
        element = this.shadowRoot.querySelector(options.query);
      } else {
        throw new Error(`Invalid ref options: ${JSON.stringify(options)}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const scope = this;
      Object.defineProperty(refObject, key, {
        enumerable: true,
        get() {
          return scope.#getRef(key);
        },
        set(value) {
          scope.#setRef(key, value);
        },
      });
      // @ts-ignore TS doesn't process defineProperty
      refObject[key] = element;
    }
    this.refs = refObject;
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
   * @return {HTMLElement}
   */
  #getRef(key) {
    return this.#weakRefs.get(key)?.deref();
  }

  /**
   * @param {string} key
   * @param {?HTMLElement} value
   * @return {void}
   */
  #setRef(key, value) {
    if (value) {
      this.#weakRefs.set(key, new WeakRef(value));
    } else {
      this.#weakRefs.delete(key);
    }
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
