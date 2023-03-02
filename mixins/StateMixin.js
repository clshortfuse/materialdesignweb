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
        /** @type {'mouse'|'touch'|'key'|'pen'|null} */
        value: null,
      },
      _hovered: 'boolean',
      _focused: 'boolean',
      _pressed: 'boolean',
      stateLayer: 'boolean',
    })
    .observe({
      disabledState({ disabled }) { return disabled; },
      hoveredState({ _hovered }) { return _hovered; },
      focusedState({ _focused }) { return _focused; },
      pressedState({ _pressed }) { return _pressed; },
      touchedState({ _lastInteraction }) {
        return _lastInteraction === 'touch';
      },
    })
    .define({
      stateTargetElement() { return this; },
    })
    .css(styles)
    .html/* html */`
      <div id=state _if={stateLayer}
        disabled={disabledState}
        focused={focusedState}
        hovered={hoveredState}
        pressed={pressedState}
        interaction={_lastInteraction}
        touched=${({ _lastInteraction }) => _lastInteraction === 'touch'}
        aria-hidden=true></div>
    `
    .events({
      pointerenter(event) {
        if (!event.isPrimary) return;
        this._pressed = this.stateTargetElement.matches(':active');
        this._hovered = event.pointerType !== 'touch' && this.stateTargetElement.matches(':hover');
      },
      '~pointerdown'(event) {
        if (!event.isPrimary) return;
        this._lastInteraction = /** @type {'touch'|'mouse'|'pen'} */ (event.pointerType);
        this._pressed = true;
      },
      '~pointerup'(event) {
        if (!event.isPrimary) return;
        this._lastInteraction = /** @type {'touch'|'mouse'|'pen'} */ (event.pointerType);
        this._pressed = false;
      },
      pointercancel(e) {
        if (!e.isPrimary) return;
        this._pressed = this.stateTargetElement.matches(':active');
      },
      pointerleave(event) {
        if (!event.isPrimary) return;
        this._pressed = false;
        this._hovered = false;
      },
      '~keydown'(e) {
        this._lastInteraction = 'key';
        if (e.repeat) return;
        // console.debug('keydown', this.stateTargetElement.matches(':active'));
        requestAnimationFrame(() => {
          this._pressed = this.stateTargetElement.matches(':active');
          // console.debug('pressed? after one keydown frame', this._pressed);
        });
      },
      '~keyup'() {
        this._lastInteraction = 'key';
        // console.debug('keyup', this.stateTargetElement.matches(':active'));
        requestAnimationFrame(() => {
          this._pressed = this.stateTargetElement.matches(':active');
          // console.debug('pressed? after one keyUP frame?', this._pressed);
        });
      },
      blur() {
        this._focused = false;
        if (!this._lastInteraction) return;
        lastInteractionWasTouch = (this._lastInteraction === 'touch');
        // this._lastInteraction = null;
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
