import styles from './StateMixin.css' assert { type: 'css' };

// Globals

let lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function StateMixin(Base) {
  class State extends Base {
    static styles = [...super.styles, styles];

    static fragments = [
      ...super.fragments,
      /* html */ `
        <div id=state disabled={disabled} aria-hidden=true>
      `,
    ];

    /**
     * @param {PointerEvent|MouseEvent} event
     * @this {State}
     * @return {void}
     */
    onStateMouseDown(event) {
      if (this.#lastInteraction) return;
      this.#lastInteraction = 'mouse';
      this.refs.state?.removeAttribute('touched');
    }

    /**
     * @param {TouchEvent} event
     * @this {State}
     * @return {void}
     */
    onStateTouchStart(event) {
      this.#lastInteraction = 'touch';
      this.refs.state?.setAttribute('touched', '');
    }

    /**
     * @param {KeyboardEvent} event
     * @this {State}
     * @return {void}
     */
    onStateKeyDown(event) {
      this.#lastInteraction = 'key';
      this.refs.state?.removeAttribute('touched');
    }

    /**
     * @param {FocusEvent} event
     * @this {State}
     * @return {void}
     */
    onStateBlur(event) {
      this.refs.state?.removeAttribute('focus');
      switch (this.#lastInteraction) {
        case null: return;
        case 'touch':
          lastInteractionWasTouch = true;
          // this.refs.state.removeAttribute('touched');
          break;
        default:
          lastInteractionWasTouch = false;
      }
      this.#lastInteraction = null;
    }

    /**
     * @param {FocusEvent} event
     * @this {State}
     * @return {void}
     */
    onStateFocus(event) {
      this.refs.state?.setAttribute('focus', '');
      // Element was focused without a mouse or touch event (keyboard or programmatic)
      if (!this.#lastInteraction && lastInteractionWasTouch) {
      // Replicate touch behavior
        this.#lastInteraction = 'touch';
        this.refs.state?.setAttribute('touched', '');
      }
    }

    /** @type {'mouse'|'touch'|'key'|null} */
    #lastInteraction = null;

    /** @return {typeof State} */
    get static() { return /** @type {typeof State} */ (super.static); }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('mousedown', this.onStateMouseDown, { passive: true });
      this.addEventListener('touchstart', this.onStateTouchStart, { passive: true });
      this.addEventListener('keydown', this.onStateKeyDown, { passive: true });
      this.addEventListener('blur', this.onStateBlur, { passive: true });
      this.addEventListener('focus', this.onStateFocus, { passive: true });
    }

    disconnectedCallback() {
      this.#lastInteraction = null;
      super.disconnectedCallback();
    }
  }
  State.prototype.disabled = State.idl('disabled', { type: 'boolean' });
  return State;
}
