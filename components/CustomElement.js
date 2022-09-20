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

  /** @type {string[]} */
  static idlBooleanAttributes = [];

  /** @type {string[]} */
  static idlIntegerAttributes = [];

  /** @type {string[]} */
  static idlFloatAttributes = [];

  /** @type {string[]} */
  static idlStringAttributes = [];

  static get observedAttributes() {
    return [
      ...this.idlBooleanAttributes,
      ...this.idlIntegerAttributes,
      ...this.idlFloatAttributes,
      ...this.idlStringAttributes,
    ];
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
    if (component.idlBooleanAttributes.includes(name)) {
      const tuple = this.#getIdlValue(name);
      if (tuple[1] === newValue) return;
      tuple[1] = newValue;
      tuple[0] = newValue != null;
      return;
    }
    if (component.idlStringAttributes.includes(name)) {
      const tuple = this.#getIdlValue(name);
      if (tuple[1] === newValue) return;
      tuple[1] = newValue;
      tuple[0] = newValue;
      return;
    }
    if (component.idlIntegerAttributes.includes(name)) {
      const tuple = this.#getIdlValue(name);
      if (tuple[1] === newValue) return;
      tuple[1] = newValue;
      if (newValue == null) {
        tuple[0] = null;
      } else {
        const numValue = Number.parseInt(newValue, 10);
        tuple[0] = Number.isNaN(numValue) ? null : numValue;
      }
    }
    if (component.idlFloatAttributes.includes(name)) {
      const tuple = this.#getIdlValue(name);
      if (tuple[1] === newValue) return;
      tuple[1] = newValue;
      if (newValue == null) {
        tuple[0] = null;
      } else {
        const numValue = Number.parseFloat(newValue);
        tuple[0] = Number.isNaN(numValue) ? null : numValue;
      }
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
    for (const key of component.idlBooleanAttributes) {
      const propName = CustomElement.attrNameToPropName(key);
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
    }
    for (const key of [...component.idlIntegerAttributes, ...component.idlFloatAttributes]) {
      const propName = CustomElement.attrNameToPropName(key);
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
    }
    for (const key of component.idlStringAttributes) {
      const propName = CustomElement.attrNameToPropName(key);
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

  /** @type {string} */
  static elementName = null;

  /** @type {Map<string,[boolean|number|string,string]>} */
  #idlValues = new Map();

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
