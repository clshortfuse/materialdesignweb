import CustomElement from '../core/CustomElement.js';
import { isRtl } from '../core/dom.js';
import InputMixin from '../mixins/InputMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

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

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(InputMixin)
  .extend()
  .set({
    stateLayer: true,
    type: 'range',
  })
  .observe({
    ticks: 'string',
    showLabel: { type: 'boolean', reflect: false },
    _previewValue: { nullable: false },
    _roundedValue: 'float',
    _isHoveringThumb: 'boolean',
  })
  .methods({
    /**
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
        this._previewValue = roundedValue.toString(10);
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

    /** @param {Event} event */
    onLeaveEvent({ currentTarget }) {
      if (document.activeElement === currentTarget) return;
      this._isHoveringThumb = false;
    },

    /**
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlFinish(event) {
      const input = event.currentTarget;
      if (input.disabled) return;
      event.preventDefault();
      input.valueAsNumber = this._roundedValue;
      if (this._value !== input.value) {
        this._value = input.value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
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
      '~touchmove': 'onControlMouseOrTouch',
      '~touchstart': 'onControlMouseOrTouch',
      // @ts-expect-error Old spec
      '~touchleave': 'onControlMouseOrTouch',
      '~touchcancel': 'onControlMouseOrTouch',
      '~touchend': 'onControlMouseOrTouch',
      touchend: 'onControlFinish',
      click: 'onControlFinish',
    },
  })
  .expressions({
    computeTrackStyle({ ticks, _previewValue, min, max }) {
      return [
        ticks ? `--ticks:${ticks}` : null,
        `--value:${valueAsFraction(_previewValue, min, max)}`,
      ].filter(Boolean).join(';') || null;
    },
  })
  .html/* html */`
    <div id=track style={computeTrackStyle} aria-hidden=true disabled={disabledState}>
      <div mdw-if={ticks} id=ticks></div>
      <div id=track-active></div>
      <div id=thumb-anchor>
        <div id=thumb></div>
        <div id=thumb-label
          hidden=${({ _isHoveringThumb, focusedState }) => (!_isHoveringThumb && !focusedState)} 
          text={_previewValue}></div>
      </div>
    </div>
  `
  .on({
    composed() {
      const { thumb, state, control } = this.refs;
      thumb.append(state);
      control.removeAttribute('aria-labelledby');
    },
    valueChanged(oldValue, newValue) {
      this._previewValue = newValue;
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

    #track {
      --value: 0.5;
      position: absolute;
      inset-block-start: 50%;
      inset-inline: 0;

      block-size: 4px;
      margin-block-start: -2px;

      pointer-events: none;
      user-select: none;

      background-color: rgb(var(--mdw-color__surface-variant));
      border-radius: inherit;
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

      color: rgb(var(--mdw-bg));
    }

    #thumb::before {
      content: '';

      display: block;

      block-size: 20px;
      inline-size: 20px;

      background-color: currentColor;
      border-radius: 50%;

      transition: background-color 100ms;
    }

    /* Inactive ticks */

    #ticks::before,
    #ticks::after {
      content: '';

      position: absolute;
      inset: 0;

      padding-inline: 10px;

      background-clip: content-box;
      /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
      background-image: radial-gradient(circle at center, var(--tick-color) 0, var(--tick-color) 1px, transparent 0);
      background-position: center center;
      background-repeat: repeat-x;
      background-size: 0 100%;
      background-size: calc(100% / var(--ticks, 0)) 2px;
    }

    #ticks::before {
      --tick-color: rgb(var(--mdw-color__on-surface-variant));
    }

    #ticks::after {
      --tick-color: rgb(var(--mdw-ink));
      /* TODO: Use single-paint implementation */
      padding-inline-end: calc(100% - (100% * var(--value)) + 10px);

      z-index: 1;

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

      background-color: rgb(var(--mdw-bg));

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

      min-block-size: 28px;
      min-inline-size: 28px;

      z-index: 1;

      background-color: rgb(var(--mdw-bg));
      border-radius: 50%;
      color: rgb(var(--mdw-ink));
    }

    #thumb-label::after {
      /* Values from Figma SVG */
      --x-start: 14.6446%; /*4.1005px*/
      --x-end: 85.3554%;
      --y: 70.7106%; /*24.0416px*/

      content: "";

      position: absolute;
      inset: 0;
      inset-block-end: -6px;

      clip-path: polygon(var(--x-start) var(--y), var(--x-end) var(--y), 50% 100%, var(--x-start) var(--y));

      background-color: rgb(var(--mdw-bg));
    }

    #track[disabled] {
      --mdw-bg: var(--mdw-color__on-surface);
      cursor: not-allowed;

      opacity: 0.38;

      background-color: rgb(var(--mdw-color__on-surface), calc(0.12 / 0.38));
    }
  `
  .autoRegister('mdw-slider');
