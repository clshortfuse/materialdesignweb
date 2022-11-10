import Container from './Container.js';
import styles from './State.css' assert { type: 'css' };

export default class State extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-state';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.append(html`
      <div id=state disabled={disabled} aria-hidden=true>
    `);
    return template;
  }

  static lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {State}
   * @return {void}
   */
  static onStateMouseDown(event) {
    if (this.#lastInteraction) return;
    this.#lastInteraction = 'mouse';
    this.refs.state?.removeAttribute('touched');
  }

  /**
   * @param {TouchEvent} event
   * @this {State}
   * @return {void}
   */
  static onStateTouchStart(event) {
    this.#lastInteraction = 'touch';
    this.refs.state?.setAttribute('touched', '');
  }

  /**
   * @param {KeyboardEvent} event
   * @this {State}
   * @return {void}
   */
  static onStateKeyDown(event) {
    this.#lastInteraction = 'key';
    this.refs.state?.removeAttribute('touched');
  }

  /**
   * @param {FocusEvent} event
   * @this {State}
   * @return {void}
   */
  static onStateBlur(event) {
    this.refs.state?.removeAttribute('focus');
    switch (this.#lastInteraction) {
      case null: return;
      case 'touch':
        State.lastInteractionWasTouch = true;
        // this.refs.state.removeAttribute('touched');
        break;
      default:
        State.lastInteractionWasTouch = false;
    }
    this.#lastInteraction = null;
  }

  /**
   * @param {FocusEvent} event
   * @this {State}
   * @return {void}
   */
  static onStateFocus(event) {
    this.refs.state?.setAttribute('focus', '');
    // Element was focused without a mouse or touch event (keyboard or programmatic)
    if (!this.#lastInteraction && State.lastInteractionWasTouch) {
      // Replicate touch behavior
      this.#lastInteraction = 'touch';
      this.refs.state?.setAttribute('touched', '');
    }
  }

  /** @type {'mouse'|'touch'|'key'|null} */
  #lastInteraction = null;

  connectedCallback() {
    // super.connectedCallback();
    this.addEventListener('mousedown', State.onStateMouseDown, { passive: true });
    this.addEventListener('touchstart', State.onStateTouchStart, { passive: true });
    this.addEventListener('keydown', State.onStateKeyDown, { passive: true });
    this.addEventListener('blur', State.onStateBlur, { passive: true });
    this.addEventListener('focus', State.onStateFocus, { passive: true });
  }

  disconnectedCallback() {
    this.#lastInteraction = null;
  }
}

State.prototype.disabled = State.idl('disabled', { type: 'boolean' });
