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
     * @param {MouseEvent|TouchEvent} event
     * @this {HTMLInputElement} this
     * @return {void}
     */
    onControlMouseOrTouch(event) {
      if (this.disabled) return;
      /** @type {{host:InstanceType<import('./Slider.js').default>}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      if (host.hasAttribute('disabled')) return;

      if (event.type === 'touchend') {
        host._isHoveringThumb = false;
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
       && (event.type === 'mousedown' || this.matches(':active'));
        ({ offsetX, clientX, pageX } = event);
      }

      if (offsetX == null) {
        clientX ??= pageX - window.scrollX; // Safari
        offsetX = clientX - this.getBoundingClientRect().left;
      }

      const { clientWidth } = this;
      let position = (offsetX / clientWidth);
      if (position > 1) {
        position = 1;
      } else if (position < 0) {
        position = 0;
      }

      if (isActive) {
        host._isHoveringThumb = true;
        const { min, max, step } = this;

        const nMin = parseFloat(min);
        const nMax = parseFloat(max, 100);
        const nStep = parseFloat(step, 1);

        const currentValue = position * (nMax - nMin) + nMin;
        const roundedValue = Math.round(currentValue / nStep) * nStep;

        host._roundedValue = roundedValue;
        host._previewValue = roundedValue.toString(10);
        return;
      }

      if (isTouch) return;

      const fractionalValue = valueAsFraction(host.value, host.min, host.max);
      const thumbOffset = fractionalValue * clientWidth;
      const thumbMin = thumbOffset - 20;
      const thumbMax = thumbOffset + 20;
      host._isHoveringThumb = offsetX >= thumbMin && offsetX <= thumbMax;
    },

    onLeaveEvent() {
      if (document.activeElement === this) return;
      this._isHoveringThumb = false;
    },

    /**
     * @param {MouseEvent|TouchEvent} event
     * @this {HTMLInputElement} this
     * @return {void}
     */
    onControlFinish(event) {
      if (this.disabled) return;
      event.preventDefault();
      /** @type {any} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      this.valueAsNumber = host._roundedValue;
      if (host._value !== this.value) {
        host._value = this.value;
        this.dispatchEvent(new Event('change', { bubbles: true }));
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
