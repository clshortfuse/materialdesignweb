import CustomElement from '../core/CustomElement.js';
import { SAFARI_VERSION, isFocused, isRtl } from '../core/dom.js';
import InputMixin from '../mixins/InputMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import { loadGlobalStyles } from '../services/rtl.js';

loadGlobalStyles();

/**
 * @param {string} value
 * @param {number} onNaN
 * @return {number}
 */
function parseFloat(value, onNaN = 0) {
  const number = Number.parseFloat(value);
  if (Number.isNaN(number)) return onNaN;
  return number;
}

/**
 * @param {string} value
 * @param {string} min
 * @param {string} max
 * @return {?number}
 */
function valueAsFraction(value, min, max) {
  const nValue = parseFloat(value);
  const nMin = parseFloat(min);
  const nMax = parseFloat(max, 100);

  return (nValue - nMin) / (nMax - nMin);
}

/**
 * Slider allows users to select a value from a range by dragging a thumb.
 * @see https://m3.material.io/components/sliders/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(InputMixin)
  .set({
    stateLayer: true,
    type: 'range',
  })
  .observe({
    /** Number of tick marks to show along the track (integer). */
    ticks: 'integer',
    /** Internal string representation of the current value used for formatting. */
    _valueAsText: { nullable: false },
    /** Text to show in the thumb label; when null the numeric value is shown. */
    thumbLabel: {
      type: 'string',
      reflect: 'read',
    },
    /** Rounded numeric value (used while dragging) tracked as a float. */
    _roundedValue: 'float',
    /** True while the pointer is hovering the thumb (used to show the label). */
    _isHoveringThumb: 'boolean',
    /** Last `value` string that produced a dispatched `change` event; used to avoid duplicates. */
    _lastDispatchedChangeValue: 'string',
  })
  .methods({
    /**
     * Handle pointer or touch interactions on the native control to compute
     * position and update the intermediate rounded value while dragging.
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlMouseOrTouch(event) {
      const input = event.currentTarget;
      if (input.disabled) return;

      if (this.disabledState) return;

      if (event.type === 'touchend') {
        this._isHoveringThumb = false;
        return;
      }

      let offsetX;
      let clientX;
      let pageX;
      let isActive;

      const isTouch = 'touches' in event;
      if (isTouch) {
        if (event.touches.length) {
          const [touch] = event.touches;
          isActive = true;
          // @ts-ignore Might exist
          ({ offsetX, clientX, pageX } = touch);
        }
      } else {
        // Ignore mouse drag-over
        // Firefox doesn't report `:active`
        // eslint-disable-next-line no-bitwise
        isActive = (event.buttons & 1) === 1
       && (event.type === 'mousedown' || input.matches(':active'));
        ({ offsetX, clientX, pageX } = event);
      }

      if (offsetX == null) {
        clientX ??= pageX - window.scrollX; // Safari
        offsetX = clientX - input.getBoundingClientRect().left;
      }

      const { clientWidth } = input;
      let position = (offsetX / clientWidth);
      if (position > 1) {
        position = 1;
      } else if (position < 0) {
        position = 0;
      }

      if (isActive) {
        this._isHoveringThumb = true;
        const { min, max, step } = this;

        const nMin = parseFloat(min);
        const nMax = parseFloat(max, 100);
        const nStep = parseFloat(step, 1);

        if (isRtl(this)) {
          position = 1 - position;
        }
        const currentValue = position * (nMax - nMin) + nMin;
        let roundedValue = Math.round(currentValue / nStep) * nStep;

        if (nStep < 1) {
          // Floating Point Numbers need to be rounded off based on step
          // eg: 3.4 / 10 with step of 0.1 yields 0.33999999999999997
          const log10 = Math.floor(Math.log10(nStep)); // e value in scientific notation
          const scale = 10 ** (-1 * log10); // multiplier to scale up to integer
          roundedValue = Math.round(roundedValue * scale) / scale;
        }

        this._roundedValue = roundedValue;
        this._valueAsText = roundedValue.toString(10);
        if (isTouch && SAFARI_VERSION) {
          // Safari does not update input when drag wasn't initiated at thumb
          if (event.type === 'touchstart') {
            // Default touch action on Safari is to magnify when on track
            event.preventDefault();
          }
          const { _input } = this;
          if (_input.valueAsNumber !== roundedValue) {
            _input.valueAsNumber = roundedValue;
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
          }
        }

        return;
      }

      if (isTouch) return;

      let fractionalValue = valueAsFraction(this.value, this.min, this.max);
      if (isRtl(this)) {
        fractionalValue = 1 - fractionalValue;
      }
      const thumbOffset = fractionalValue * clientWidth;
      const thumbMin = thumbOffset - 20;
      const thumbMax = thumbOffset + 20;
      this._isHoveringThumb = offsetX >= thumbMin && offsetX <= thumbMax;
    },

    /**
     * Pointer leave/blur handler for the control; hides the thumb label when focus is lost.
     * @param {Event} event
     */
    onLeaveEvent({ currentTarget }) {
      if (isFocused(/** @type {Element} */ (currentTarget))) return;
      this._isHoveringThumb = false;
    },

    /**
     * Finalize interaction with the control: commit the rounded value to the
     * native input and dispatch a `change` event if the value changed.
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlFinish(event) {
      const input = event.currentTarget;
      if (input.disabled) return;
      if (event.type === 'click') {
        event.preventDefault();
      }
      input.valueAsNumber = this._roundedValue;
      this._value = input.value;
      if (this._lastDispatchedChangeValue !== this._value) {
        this._lastDispatchedChangeValue = this._value;
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
  })
  .events({
    blur: 'onLeaveEvent',
    mouseout: 'onLeaveEvent',
  })
  .childEvents({
    control: {
      '~mousedown': 'onControlMouseOrTouch',
      '~mousemove': 'onControlMouseOrTouch',
      '~mouseout': 'onControlMouseOrTouch',
      touchstart: 'onControlMouseOrTouch',
      '~touchmove': 'onControlMouseOrTouch',
      '~touchleave': 'onControlMouseOrTouch',
      '~touchcancel': 'onControlMouseOrTouch',
      '~touchend': 'onControlMouseOrTouch',
      touchend: 'onControlFinish',
      click: 'onControlFinish',
      '~change'(event) {
        // Change event will be rethrown by ControlMixin
        // Track value to avoid double dispatch
        if (this._lastDispatchedChangeValue === this._value) {
          event.stopPropagation();
        }
        this._lastDispatchedChangeValue = this._value;
      },
    },
  })
  .expressions({
    /** Compute inline style variables for the track, including ticks and value fraction. */
    computeTrackStyle({ ticks, _valueAsText, min, max }) {
      return [
        ticks ? `--ticks:${ticks}` : null,
        `--value:${valueAsFraction(_valueAsText, min, max)}`,
      ].filter(Boolean).join(';') || null;
    },
    /** True when the thumb label should be hidden (not hovering and not focused). */
    _thumbLabelHidden({ _isHoveringThumb, focusedState }) {
      return (!_isHoveringThumb && !focusedState);
    },
    /** Compute the label text to show in the thumb: explicit `thumbLabel` or numeric value. */
    _computedThumbLabel({ thumbLabel, _valueAsText }) {
      return thumbLabel ?? _valueAsText;
    },
  })
  .html`
    <div id=track style={computeTrackStyle} aria-hidden=true disabled={disabledState}>
      <div mdw-if={ticks} id=ticks></div>
      <div id=track-active></div>
      <div id=thumb-anchor>
        <div id=thumb></div>
        <div id=thumb-label
          hidden={_thumbLabelHidden}
          text={_computedThumbLabel}></div>
      </div>
    </div>
  `
  .recompose(({ refs: { thumb, state, control } }) => {
    thumb.append(state);
    control.removeAttribute('aria-labelledby');
  })
  .on({
    valueChanged(oldValue, newValue) {
      this._valueAsText = newValue;
    },
  })
  .css`
    /* https://m3.material.io/components/sliders/specs */

    :host {
      --mdw-ink: var(--mdw-color__on-primary);
      --mdw-bg: var(--mdw-color__primary);

      display: block;
      vertical-align: middle;

      min-block-size: 40px;
      min-inline-size: 88px;

      background-color: transparent;
    }

    :host,
    :host([color]) {
      background-color: transparent;
    }

    #control {
      inset:0;

      overflow: visible;

      block-size: 100%;
      min-block-size: 0;
      inline-size: 100%;
      min-inline-size: 0;

      appearance: none;

      cursor: pointer;

      transform: none;

      background-color: transparent;
    }

    #control::-webkit-slider-runnable-track {
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin-inline: -10px;

      appearance: none;

      background-color: transparent;
    }

    @supports (-moz-appearance:none ){
      #control {
        inset-inline: -10px;

        inline-size: calc(100% + 20px);
      }
    }

    #control::-moz-range-track {
      inline-size: calc(100% + 20px) !important;

      appearance: none;
    }

    #control::-webkit-slider-thumb {
      display: block;

      block-size: 20px;
      inline-size: 20px;

      -webkit-appearance: none;
      cursor: inherit;

      transform: scale(2);

      background-color: transparent; /* Safari */

      border-radius: 50%;
      box-shadow: none; /* Safari */
    }

    #control::-moz-range-thumb {
      display: block;

      box-sizing: content-box;
      block-size: 20px;
      inline-size: 20px;
      border: none;

      appearance: none;
      cursor: inherit;

      transform: scale(2);

      background-color: transparent;
      border-radius: 50%;
    }

    #control[disabled] {
      cursor: not-allowed;
    }

    #track {
      --value: 0.5;
      position: absolute;
      inset-block-start: 50%;
      inset-inline: 0;

      block-size: 4px;
      margin-block-start: -2px;

      pointer-events: none;
      user-select: none;

      background-color: rgb(var(--mdw-color__surface-container-highest));
      border-radius: inherit;
      color: rgb(var(--mdw-bg));
    }

    #thumb {
      position: absolute;
      inset-block-start: -18px;
      inset-inline-start: -20px;

      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      block-size: 40px;
      inline-size: 40px;

      pointer-events: none;

      border-radius: 50%;

      color: currentColor;
    }

    #thumb::before {
      content: '';

      display: block;

      block-size: 20px;
      inline-size: 20px;

      background-color: currentColor;
      border-radius: 50%;

      transition: color 100ms, background-color 100ms;
    }

    /* Inactive ticks */

    #ticks::before,
    #ticks::after {
      content: '';

      position: absolute;
      inset: 0;

      padding-inline: 2px;

      background-clip: content-box;
      background-image: radial-gradient(circle at 1px, currentColor 0, currentColor 1px, transparent 0);
      background-position: -1px 50%;
      background-repeat: repeat-x;
      background-size: calc(100% / (var(--ticks, 0) + 1)) 2px;
    }

    #ticks::before {
      color: rgb(var(--mdw-color__on-surface-variant));
    }

    #ticks::after {
      /* TODO: Use single-paint implementation */
      padding-inline-end: calc(100% - (100% * var(--value)) + 10px);

      z-index: 1;

      color: rgb(var(--mdw-ink));

      will-change: padding-inline-end;
    }
    /* Active Indicator */
    #track-active {
      position: absolute;
      inset: 0;

      overflow: hidden;

      border-radius: 99px;
    }

    #track-active::before {
      content: '';

      position: absolute;
      inset: 0;

      transform: scaleX(var(--value));
      transform-origin: calc(100% * calc(-0.5 * var(--mdw-dir, 1) + 0.5)) 0;

      background-color: currentColor;

      will-change: transform;
    }

    #thumb-anchor {
      position: absolute;

      inset-inline-start: calc(var(--value) * 100%);

      display: flex;
      align-items: flex-start;
      flex-direction: column;

      z-index: 24;

      /* stylelint-disable-next-line liberty/use-logical-spec */
      will-change: inset-inline-start, left, right;
    }

    #thumb-label {
      position: absolute;
      /* stylelint-disable-next-line liberty/use-logical-spec */
      left: 0;
      inset-block-end: 14px;

      display: flex;
      align-items: center;
      justify-content: center;

      box-sizing: content-box;
      margin-block-end: 6px;

      transform: translateX(-50%) scale(1);
      transform-origin: 50% 100%;

      font-weight: var(--mdw-typescale__label-medium__font-weight);
      line-height: var(--mdw-typescale__label-medium__line-height);
      font-family: var(--mdw-typescale__label-medium__font-family);
      letter-spacing: var(--mdw-typescale__label-medium__letter-spacing);

      transition: transform 200ms;
      will-change: transform;
    }

    #thumb-label:is([hidden],[text=""]) {
      transform: translateX(-50%) scale(0);
    }

    #thumb-label::before {
      content: attr(text);

      display: flex;
      align-items: center;
      justify-content: center;

      box-sizing: border-box;

      min-block-size: 28px;
      min-inline-size: 28px;
      padding: 4px;

      z-index: 1;

      background-color: rgb(var(--mdw-bg));
      border-radius: 14px;
      color: rgb(var(--mdw-ink));
    }

    #thumb-label::after {
      /* Values from Figma SVG */
      --x-start: 4.1005px; /*4.1005px*/
      --x-end: calc(100% - 4.1005px);
      --y: calc(100% - 9.9584px); /*24.0416px*/

      content: "";

      position: absolute;
      inset: 0;
      inset-block-end: -6px;

      clip-path: polygon(var(--x-start) var(--y), var(--x-end) var(--y), 50% 100%, var(--x-start) var(--y));

      background-color: currentColor;
    }

    #track[disabled] {
      --mdw-bg: var(--mdw-color__on-surface);
      cursor: not-allowed;

      opacity: 0.38;

      background-color: rgb(var(--mdw-color__on-surface), calc(0.12 / 0.38));
    }
  `
  .autoRegister('mdw-slider');
