import Input from './Input.js';
import styles from './Slider.css' assert { type: 'css' };

export default class Slider extends Input {
  static elementName = 'mdw-slider';

  static styles = [...super.styles, styles];

  static rootTemplate = /* html */ `
    <mdw-slider>
  `;

  /**
   * @param {string} value
   * @param {number} onNaN
   * @return {number}
   */
  static parseFloat(value, onNaN = 0) {
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
  static valueAsFraction(value, min, max) {
    const nValue = Slider.parseFloat(value);
    const nMin = Slider.parseFloat(min);
    const nMax = Slider.parseFloat(max, 100);

    return (nValue - nMin) / (nMax - nMin);
  }

  /**
   * @param {Partial<Slider>} data
   * @return {?string}
   */
  static updateTrackStyle({ ticks, _previewValue, min, max }) {
    return [
      ticks ? `--ticks:${ticks}` : null,
      `--value:${Slider.valueAsFraction(_previewValue, min, max)}`,
    ].filter(Boolean).join(';') || null;
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputMouseOrTouch(event) {
    if (this.disabled) return;

    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) return;

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
      // eslint-disable-next-line no-bitwise
      isActive = (event.buttons & 1) === 1 && this.matches(':active');
      ({ offsetX, clientX, pageX } = event);
    }

    if (offsetX == null) {
      const rect = this.getBoundingClientRect();
      if (clientX == null) { // Safari
        clientX = pageX - window.scrollX;
      }
      offsetX = clientX - rect.left;
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

      const nMin = Slider.parseFloat(min);
      const nMax = Slider.parseFloat(max, 100);
      const nStep = Slider.parseFloat(step, 1);

      const currentValue = position * (nMax - nMin) + nMin;
      const roundedValue = Math.round(currentValue / nStep) * nStep;

      host._previewValue = roundedValue.toString(10);
      return;
    }

    if (isTouch) return;

    const valueAsFraction = Slider.valueAsFraction(host.value, host.min, host.max);
    const thumbOffset = valueAsFraction * clientWidth;
    const thumbMin = thumbOffset - 20;
    const thumbMax = thumbOffset + 20;
    host._isHoveringThumb = offsetX >= thumbMin && offsetX <= thumbMax;
  }

  /**
   * @this Slider
   */
  static onLeaveEvent() {
    if (document.activeElement === this) return;
    this._isHoveringThumb = false;
  }

  static onInputFocus() {
    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host._isFocused = true;
  }

  static onInputBlur() {
    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host._isFocused = false;
  }

  compose() {
    const fragment = super.compose();
    const { html } = this;
    fragment.getElementById('input').setAttribute('type', 'range');
    fragment.getElementById('ripple').remove();
    fragment.getElementById('overlay').remove();
    fragment.append(
      html`
        <div id=track aria-hidden=true style=${Slider.updateTrackStyle}>
          <div id=ticks></div>
          <div id="track-active"></div>
          <div id="track-label-anchor">
            <div id="track-label" 
            hidden=${({ _isFocused, _isHoveringThumb }) => (!_isHoveringThumb && !_isFocused)} 
            text=${({ _previewValue }) => _previewValue ?? ''}></div>
          </div>
        </div>
      `,
    );
    return fragment;
  }

  /** @type {Input['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'value':
        /** @type {string} */
        this._previewValue = newValue;
        break;
      default:
    }
  }

  get valueAsNumber() {
    if (this.refs.input) {
      return this.refs.input.valueAsNumber;
    }
    return Slider.parseFloat(this.value, 0);
  }

  set valueAsNumber(v) {
    this.refs.input.valueAsNumber = v;
    // this.#valueAsNumber = this.refs.input.valueAsNumber;
    this.value = this.refs.input.value;
  }

  connectedCallback() {
    super.connectedCallback();
    const { input } = this.refs;

    for (const type of ['mousedown', 'mousemove', 'mouseout',
      'touchmove', 'touchstart', 'touchend', 'touchleave', 'touchcancel']) {
      input.addEventListener(type, Slider.onInputMouseOrTouch, { passive: true });
    }
    input.addEventListener('focus', Slider.onInputFocus, { passive: true });
    input.addEventListener('blur', Slider.onInputBlur, { passive: true });

    this.addEventListener('mouseout', Slider.onLeaveEvent);
  }
}

Slider.prototype.ticks = Slider.idl('ticks');
Slider.prototype.showLabel = Slider.idlBoolean('showLabel', { reflect: false });
Slider.prototype._previewValue = Slider.idl('_previewValue');
Slider.prototype._isFocused = Slider.idlBoolean('_isFocused');
Slider.prototype._isHoveringThumb = Slider.idlBoolean('_isHoveringThumb');
