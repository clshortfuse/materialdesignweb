import Container from './Container.js';
import styles from './Overlay.css' assert { type: 'css' };

export default class Overlay extends Container {
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
   * @this {Overlay}
   * @return {void}
   */
  static onMouseDown(event) {
    if (this.#lastInteraction) return;
    this.#lastInteraction = 'mouse';
    this.overlayElement.removeAttribute('touched');
  }

  /**
   * @param {TouchEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onTouchStart(event) {
    this.#lastInteraction = 'touch';
    this.overlayElement.setAttribute('touched', '');
  }

  /**
   * @param {KeyboardEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onKeyDown(event) {
    this.#lastInteraction = 'key';
    this.overlayElement.removeAttribute('touched');
  }

  /**
   * @param {FocusEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onBlur(event) {
    switch (this.#lastInteraction) {
      case null: return;
      case 'touch':
        Overlay.lastInteractionWasTouch = true;
        this.overlayElement.removeAttribute('touched');
        break;
      default:
        Overlay.lastInteractionWasTouch = false;
    }
  }

  /**
   * @param {FocusEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onFocus(event) {
    // Element was focused without a mouse or touch event (keyboard or programmatic)
    if (!this.#lastInteraction && Overlay.lastInteractionWasTouch) {
      // Replicate touch behavior
      this.#lastInteraction = 'touch';
      this.overlayElement.setAttribute('touched', '');
    }
  }

  connectedCallback() {
    // super.connectedCallback();
    this.addEventListener('mousedown', Overlay.onMouseDown, { passive: true });
    this.addEventListener('touchstart', Overlay.onTouchStart, { passive: true });
    this.addEventListener('keydown', Overlay.onKeyDown, { passive: true });
    this.addEventListener('blur', Overlay.onBlur, { passive: true });
    this.addEventListener('focus', Overlay.onFocus, { passive: true });
  }

  disconnectedCallback() {
    // super.disconnectedCallback();
    this.removeEventListener('mousedown', Overlay.onMouseDown);
    this.removeEventListener('touchstart', Overlay.onTouchStart);
    this.removeEventListener('keydown', Overlay.onKeyDown);
    this.removeEventListener('blur', Overlay.onBlur);
    this.removeEventListener('focus', Overlay.onFocus);
  }
}
