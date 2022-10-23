import Input from './Input.js';
import styles from './Slider.css' assert { type: 'css' };

export default class Slider extends Input {
  static elementName = 'mdw-slider';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    /** @type {Slider['html']} */
    const html = this.html;
    template.getElementById('control').setAttribute('type', 'range');
    template.getElementById('ripple').remove();
    template.getElementById('overlay').remove();
    template.append(
      html`
        <div id=track aria-hidden=true style={computeTrackStyle}>
          <div id=ticks></div>
          <div id="track-active"></div>
          <div id="track-label-anchor">
            <div id="track-label" 
            hidden=${({ _isHoveringThumb, _isFocused }) => (!_isHoveringThumb && !_isFocused)} 
            text=${({ _previewValue }) => _previewValue ?? ''}></div>
          </div>
        </div>
      `,
    );
    return template;
  }

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

  /** @return {InstanceType<Slider>} */
  static get self() { return this; }

  /**
   * @param {MouseEvent|TouchEvent} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onControlMouseOrTouch(event) {
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
   * @this {Slider}
   */
  static onLeaveEvent() {
    if (document.activeElement === this) return;
    this._isHoveringThumb = false;
  }

  computeTrackStyle() {
    return [
      this.ticks ? `--ticks:${this.ticks}` : null,
      `--value:${Slider.valueAsFraction(this._previewValue, this.min, this.max)}`,
    ].filter(Boolean).join(';') || null;
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

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'range'; }

  connectedCallback() {
    super.connectedCallback();
    const { control } = this.refs;

    for (const type of ['mousedown', 'mousemove', 'mouseout',
      'touchmove', 'touchstart', 'touchend', 'touchleave', 'touchcancel']) {
      control.addEventListener(type, Slider.onControlMouseOrTouch, { passive: true });
    }

    this.addEventListener('mouseout', Slider.onLeaveEvent);
  }
}

Slider.prototype.ticks = Slider.idl('ticks');
Slider.prototype.showLabel = Slider.idl('showLabel', { type: 'boolean', reflect: false });
Slider.prototype._previewValue = Slider.idl('_previewValue');
Slider.prototype._isHoveringThumb = Slider.idl('_isHoveringThumb', 'boolean');
