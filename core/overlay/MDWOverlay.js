import MDWContainer from '../container/MDWContainer.js';

export default class MDWOverlay extends MDWContainer {
  constructor() {
    super();
    this.stylesElement.append(MDWOverlay.getStylesFragment().cloneNode(true));
    this.shadowRoot.prepend(MDWOverlay.getContentFragment().cloneNode(true));
  }

  static lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

  static register(tagname = 'mdw-overlay') {
    customElements.define(tagname, MDWOverlay);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWOverlay.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWOverlay.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWOverlay.css"]').href = new URL('MDWOverlay.css', import.meta.url).toString();
      MDWOverlay.#styles = template;
    }
    return MDWOverlay.#styles.content;
  }

  /** @type {HTMLTemplateElement} */
  static #content = null;

  /** @return {DocumentFragment} */
  static getContentFragment() {
    if (!MDWOverlay.#content) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <div class="mdw-overlay__container" part="overlay-container" aria-hidden="true"/>
        `,
      );
      template.content.appendChild(fragment);
      MDWOverlay.#content = template;
    }
    return MDWOverlay.#content.content;
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onMouseDown(event) {
    const element = /** @type {MDWOverlay} */ (event.currentTarget);
    if (element.hasAttribute('mdw-overlay-touch')) {
      return;
    }
    element.setAttribute('mdw-overlay-touch', 'false');
  }

  /**
   * @param {TouchEvent} event
   * @return {void}
   */
  static onTouchStart(event) {
    const element = /** @type {MDWOverlay} */ (event.currentTarget);
    element.setAttribute('mdw-overlay-touch', 'true');
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    const element = /** @type {MDWOverlay} */ (event.currentTarget);
    element.setAttribute('mdw-overlay-touch', 'false');
  }

  /**
   * @param {FocusEvent} event
   * @return {void}
   */
  static onBlur(event) {
    const element = /** @type {MDWOverlay} */ (event.currentTarget);
    const value = element.getAttribute('mdw-overlay-touch');
    if (value == null) {
      return;
    }
    MDWOverlay.lastInteractionWasTouch = (value === 'true');
    element.removeAttribute('mdw-overlay-touch');
  }

  /**
   * @param {FocusEvent} event
   * @return {void}
   */
  static onFocus(event) {
    const element = /** @type {MDWOverlay} */ (event.currentTarget);
    // Element was focused without a mouse or touch event (keyboard or programmatic)
    if (!element.hasAttribute('mdw-overlay-touch') && MDWOverlay.lastInteractionWasTouch) {
      element.setAttribute('mdw-overlay-touch', 'true');
    }
  }

  connectedCallback() {
    // super.connectedCallback();
    this.addEventListener('mousedown', MDWOverlay.onMouseDown, { passive: true });
    this.addEventListener('touchstart', MDWOverlay.onTouchStart, { passive: true });
    this.addEventListener('keydown', MDWOverlay.onKeyDown, { passive: true });
    this.addEventListener('blur', MDWOverlay.onBlur, { passive: true });
    this.addEventListener('focus', MDWOverlay.onFocus, { passive: true });
  }

  disconnectedCallback() {
    // super.disconnectedCallback();
    this.removeEventListener('mousedown', MDWOverlay.onMouseDown);
    this.removeEventListener('touchstart', MDWOverlay.onTouchStart);
    this.removeEventListener('keydown', MDWOverlay.onKeyDown);
    this.removeEventListener('blur', MDWOverlay.onBlur);
    this.removeEventListener('focus', MDWOverlay.onFocus);
  }
}
