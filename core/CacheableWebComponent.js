/**
 * WebComponent that can cache templates for minification or performance
 */
export class CacheableWebComponent extends HTMLElement {
  static supportsAdoptedStyleSheets = 'adoptedStyleSheets' in ShadowRoot.prototype;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const component = /** @type {typeof CacheableWebComponent} */ (this.constructor);

    if (CacheableWebComponent.supportsAdoptedStyleSheets) {
      let array = CacheableWebComponent.#stylesCache.get(component);
      if (!array) {
        array = component.styles.filter((style) => style instanceof CSSStyleSheet);
        CacheableWebComponent.#stylesCache.set(component, array);
      }
      shadowRoot.adoptedStyleSheets = array;
    }

    let content = CacheableWebComponent.#fragmentCache.get(component);
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
          if (CacheableWebComponent.supportsAdoptedStyleSheets) return null;
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
      CacheableWebComponent.#fragmentCache.set(component, content);
    }
    shadowRoot.prepend(content.cloneNode(true));
  }

  /**
   * @this {typeof CacheableWebComponent}
   * @param {string} [elementName]
   */
  static register(elementName) {
    customElements.define(elementName || this.elementName, this);
  }

  /** @type {(DocumentFragment|string)[]} */
  static get fragments() { return []; }

  /** @type {WeakMap<typeof CacheableWebComponent, DocumentFragment>} */
  static #fragmentCache = new WeakMap();

  /** @type {WeakMap<typeof CacheableWebComponent, CSSStyleSheet[]>} */
  static #stylesCache = new WeakMap();

  /** @type {string} */
  static elementName = null;

  /** @type {(string|URL|CSSStyleSheet)[]} */
  static get styles() { return []; }
}
