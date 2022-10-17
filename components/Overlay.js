import Container from './Container.js';
import styles from './Overlay.css' assert { type: 'css' };

export default class Overlay extends Container {
  static elementName = 'mdw-overlay';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    '<div id=overlay aria-hidden=true/>',
  ];

  static lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

  /** @type {'mouse'|'touch'|'key'|null} */
  #lastInteraction = null;

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onOverlayMouseDown(event) {
    if (this.#lastInteraction) return;
    this.#lastInteraction = 'mouse';
    this.refs.overlay?.removeAttribute('touched');
  }

  /**
   * @param {TouchEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onOverlayTouchStart(event) {
    this.#lastInteraction = 'touch';
    this.refs.overlay?.setAttribute('touched', '');
  }

  /**
   * @param {KeyboardEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onOverlayKeyDown(event) {
    this.#lastInteraction = 'key';
    this.refs.overlay?.removeAttribute('touched');
  }

  /**
   * @param {FocusEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onOverlayBlur(event) {
    switch (this.#lastInteraction) {
      case null: return;
      case 'touch':
        Overlay.lastInteractionWasTouch = true;
        // this.refs.overlay.removeAttribute('touched');
        break;
      default:
        Overlay.lastInteractionWasTouch = false;
    }
    this.#lastInteraction = null;
  }

  /**
   * @param {FocusEvent} event
   * @this {Overlay}
   * @return {void}
   */
  static onOverlayFocus(event) {
    // Element was focused without a mouse or touch event (keyboard or programmatic)
    if (!this.#lastInteraction && Overlay.lastInteractionWasTouch) {
      // Replicate touch behavior
      this.#lastInteraction = 'touch';
      this.refs.overlay?.setAttribute('touched', '');
    }
  }

  connectedCallback() {
    // super.connectedCallback();
    this.addEventListener('mousedown', Overlay.onOverlayMouseDown, { passive: true });
    this.addEventListener('touchstart', Overlay.onOverlayTouchStart, { passive: true });
    this.addEventListener('keydown', Overlay.onOverlayKeyDown, { passive: true });
    this.addEventListener('blur', Overlay.onOverlayBlur, { passive: true });
    this.addEventListener('focus', Overlay.onOverlayFocus, { passive: true });
  }

  disconnectedCallback() {
    this.#lastInteraction = null;
  }
}

Overlay.prototype.refs = {
  ...Container.prototype.refs,
  ...Overlay.addRefNames('overlay'),
};
