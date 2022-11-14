import styles from './StateMixin.css' assert { type: 'css' };

// Globals

let lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

/** @param {typeof import('../core/CustomElement.js').default} Base */
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
    static onStateFocus(event) {
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
      this.addEventListener('mousedown', State.onStateMouseDown, { passive: true });
      this.addEventListener('touchstart', State.onStateTouchStart, { passive: true });
      this.addEventListener('keydown', State.onStateKeyDown, { passive: true });
      this.addEventListener('blur', State.onStateBlur, { passive: true });
      this.addEventListener('focus', State.onStateFocus, { passive: true });
    }

    disconnectedCallback() {
      this.#lastInteraction = null;
      super.disconnectedCallback();
    }
  }
  State.prototype.disabled = State.idl('disabled', { type: 'boolean' });
  return State;
}
