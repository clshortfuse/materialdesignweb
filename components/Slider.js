import InputMixin from '../mixins/InputMixin.js';

import Container from './Container.js';
import styles from './Slider.css' assert { type: 'css' };

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

export default Container
  .mixin(InputMixin)
  .extend()
  .define({
    type() { return 'range'; },
  })
  .observe({
    ticks: 'string',
    showLabel: { type: 'boolean', reflect: false },
    _previewValue: { nullable: false },
    _roundedValue: 'float',
    _isHoveringThumb: 'boolean',
    _isFocused: 'boolean',
  })
  .methods({
    /**
     * @param {(MouseEvent|TouchEvent) & {currentTarget:HTMLInputElement}} event
     * @return {void}
     */
    onControlMouseOrTouch(event) {
      const input = event.currentTarget;
      if (input.disabled) return;

      if (this.hasAttribute('disabled')) return;

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

      const fractionalValue = valueAsFraction(this.value, this.min, this.max);
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
  .events('#control', {
    '~mousedown': 'onControlMouseOrTouch',
    '~mousemove': 'onControlMouseOrTouch',
    '~mouseout': 'onControlMouseOrTouch',
    '~touchmove': 'onControlMouseOrTouch',
    '~touchstart': 'onControlMouseOrTouch',
    // @ts-expect-error Old spec
    '~touchleave': 'onControlMouseOrTouch',
    '~touchcancel': 'onControlMouseOrTouch',
    '~touchend': 'onControlMouseOrTouch',
    focus() {
      this._isFocused = true;
    },
    blur() {
      this._isFocused = false;
    },
    touchend: 'onControlFinish',
    click: 'onControlFinish',
  })
  .css(styles)
  .expressions({
    computeTrackStyle({ ticks, _previewValue, min, max }) {
      return [
        ticks ? `--ticks:${ticks}` : null,
        `--value:${valueAsFraction(_previewValue, min, max)}`,
      ].filter(Boolean).join(';') || null;
    },
  })
  .html/* html */`
    <div id=track aria-hidden=true style={computeTrackStyle}>
      <div _if={ticks} id=ticks></div>
      <div id="track-active"></div>
      <div id="thumb-anchor">
        <div id=thumb></div>
        <div id="thumb-label"
          hidden=${({ _isHoveringThumb, _isFocused }) => (!_isHoveringThumb && !_isFocused)} 
          text={_previewValue}></div>
      </div>
    </div>
  `
  .on('composed', ({ $ }) => {
    $('#thumb').append($('#state')); // Place state inside thumb
    $('#control').setAttribute('type', 'range');
    $('#ripple').remove();
  })
  .on('valueChanged', (oldValue, newValue, element) => {
    element._previewValue = newValue;
  })
  .autoRegister('mdw-slider');
