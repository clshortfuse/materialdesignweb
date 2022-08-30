import MDWContainer from '../container/MDWContainer.js';

import styles from './MDWOverlay.css' assert { type: 'css' };

export default class MDWOverlay extends MDWContainer {
  constructor() {
    super();
    this.overlayElement = this.shadowRoot.getElementById('overlay');
  }

  static elementName = 'mdw-overlay';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    '<div id="overlay" aria-hidden="true"/>',
  ];

  static lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

  /** @type {'mouse'|'touch'|'key'|null} */
  #lastInteraction = null;

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {MDWOverlay}
   * @return {void}
   */
  static onMouseDown(event) {
    if (this.#lastInteraction) return;
    this.#lastInteraction = 'mouse';
    this.overlayElement.removeAttribute('touched');
  }

  /**
   * @param {TouchEvent} event
   * @this {MDWOverlay}
   * @return {void}
   */
  static onTouchStart(event) {
    this.#lastInteraction = 'touch';
    this.overlayElement.setAttribute('touched', '');
  }

  /**
   * @param {KeyboardEvent} event
   * @this {MDWOverlay}
   * @return {void}
   */
  static onKeyDown(event) {
    this.#lastInteraction = 'key';
    this.overlayElement.removeAttribute('touched');
  }

  /**
   * @param {FocusEvent} event
   * @this {MDWOverlay}
   * @return {void}
   */
  static onBlur(event) {
    switch (this.#lastInteraction) {
      case null: return;
      case 'touch':
        MDWOverlay.lastInteractionWasTouch = true;
        this.overlayElement.removeAttribute('touched');
        break;
      default:
        MDWOverlay.lastInteractionWasTouch = false;
    }
  }

  /**
   * @param {FocusEvent} event
   * @this {MDWOverlay}
   * @return {void}
   */
  static onFocus(event) {
    // Element was focused without a mouse or touch event (keyboard or programmatic)
    if (!this.#lastInteraction && MDWOverlay.lastInteractionWasTouch) {
      // Replicate touch behavior
      this.#lastInteraction = 'touch';
      this.overlayElement.setAttribute('touched', '');
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
