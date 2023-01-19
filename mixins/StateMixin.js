import styles from './StateMixin.css' assert { type: 'css' };

// Globals

let lastInteractionWasTouch = window?.matchMedia?.('(any-pointer: coarse)').matches;

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function StateMixin(Base) {
  return Base
    .extend()
    .observe({
      disabled: 'boolean',
      _lastInteraction: {
        /** @type {'mouse'|'touch'|'key'|null} */
        value: null,
      },
      _focused: 'boolean',
    })
    .css(styles)
    .html/* html */`
      <div id=state
        disabled={disabled}
        touched=${({ _lastInteraction }) => _lastInteraction === 'touch'}
        focused={_focused}
        aria-hidden=true></div>
    `
    .events({
      '~mousedown'() {
        this._lastInteraction ??= 'mouse';
      },
      '~touchstart'() {
        this._lastInteraction = 'touch';
      },
      '~keydown'() {
        this._lastInteraction = 'key';
      },
      blur() {
        this._focused = false;
        if (!this._lastInteraction) return;
        lastInteractionWasTouch = (this._lastInteraction === 'touch');
        this._lastInteraction = null;
      },
      focus() {
        this._focused = true;
        // Element was focused without a mouse or touch event (keyboard or programmatic)
        if (!this._lastInteraction && lastInteractionWasTouch) {
          // Replicate touch behavior
          this._lastInteraction = 'touch';
        }
      },
    })
    .on('disconnected', ({ element }) => {
      element._lastInteraction = null;
    });
}
