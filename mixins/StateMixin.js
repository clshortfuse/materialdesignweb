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
      /** Force focus state (independent of document) */
      focused: 'boolean',
      /** Force hover state (independent of interaction) */
      hovered: 'boolean',
      /** Force pressed state (independent of interaction) */
      pressed: 'boolean',
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
      hoveredState({ _hovered, hovered }) { return _hovered || hovered; },
      focusedState({ _focused, focused }) { return _focused || focused; },
      pressedState({ _pressed, pressed }) { return _pressed || pressed; },
      touchedState({ _lastInteraction }) {
        return _lastInteraction === 'touch';
      },
    })
    .define({
      stateTargetElement() { return this; },
    })
    .html`
      <div id=state mdw-if={stateLayer}
        disabled={disabledState}
        focused={focusedState}
        hovered={hoveredState}
        pressed={pressedState}
        interaction={_lastInteraction}
        touched={touchedState}
        aria-hidden=true></div>
    `
    .events({
      pointerenter(event) {
        if (!event.isPrimary) return;
        this._pressed = this.stateTargetElement.matches(':active');
        if (event.pointerType === 'touch') return;
        this._hovered = true;
        // Firefox lags a frame before reporting :hover
        // requestAnimationFrame(() => {
        //  this._hovered = this.stateTargetElement.matches(':hover');
        // });
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
    .on({
      disconnected() {
        this._lastInteraction = null;
      },
    })
    .css`
      /* https://m3.material.io/foundations/interaction-states */

      :host {
        --mdw-state__hovered-opacity: 0.08;
        --mdw-state__focused-opacity: 0.12;
        --mdw-state__pressed-opacity: 0.12;
        --mdw-state__dragged-opacity: 0.12;
        position: relative;

        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      /* Remove Firefox inner */
      :host(::-moz-focus-inner) {
        border: 0;
      }

      #state {
        position: absolute;
        inset: 0;

        pointer-events: none;

        opacity: calc(
            var(--mdw-state__hovered-opacity) +
            var(--mdw-state__focused-opacity) +
            var(--mdw-state__pressed-opacity) +
            var(--mdw-state__dragged-opacity)
          );
        /* opacity handled by theme engine */
        background-color: currentColor;
        border-radius: inherit;

        transition-delay: 0ms;
        transition-duration: 000ms;
        transition-property: opacity, color, background-color;
        will-change: opacity;
      }

      #state[touched] {
        --mdw-state__hovered-opacity: 0;
        --mdw-state__focused-opacity: 0;
      }

      /* Remove Hover State */
      #state:is(
      :not([hovered]),
      [disabled]:not([state-disabled~="hover"]),
      [state-off~="hover"]) {
        --mdw-state__hovered-opacity: 0;
      }

      /* Remove Focus State */
      #state:is(
      :not([focused]),
      [disabled]:not([state-disabled~="focus"]),
      [state-off~="focus"]) {
        --mdw-state__focused-opacity: 0;
      }

      /* Remove Pressed State */

      #state:is(
      :not([pressed]),
      [disabled]:not([state-disabled~="pressed"]),
      [state-off~="pressed"]) {
        --mdw-state__pressed-opacity: 0;
      }

      /* Remove Dragged State */
      :host(:not([aria-dragged="true"])) #state,
      #state:is(
        [disabled]:not([state-disabled~="dragged"]),
        [state-off~="dragged"]) {
        --mdw-state__dragged-opacity: 0;
      }

      /* Disabled */
      #state[disabled]:not([state-disabled]) {
        display: none;
      }

    `;
}
