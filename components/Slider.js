import Input from './Input.js';
import styles from './Slider.css' assert { type: 'css' };

export default class Slider extends Input {
  static elementName = 'mdw-slider';

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div id=track aria-hidden=true>
        <div id=ticks></div>
        <div id="track-active"></div>
        <div id="track-label-anchor">
          <div id="track-label" hidden text></div>
        </div>
      </div>
    `,
  ];

  static styles = [...super.styles, styles];

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    if (this.disabled) return;
    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
    }
    host.updateTrack();
    host.updateLabel();
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

    let isHoveringThumb = false;
    if (isActive) {
      isHoveringThumb = true;
      const { min, max, step } = this;
      const nMin = (min === '') ? 0 : Number.parseFloat(min);
      const nMax = (max === '') ? 100 : Number.parseFloat(max);
      const nStep = (step === '') ? 1 : Number.parseFloat(step);

      const currentValue = position * (nMax - nMin) + nMin;
      const roundedValue = Math.round(currentValue / nStep) * nStep;
      const roundedPosition = (roundedValue - nMin) / (nMax - nMin);
      host.updateTrack(roundedPosition);
      host.updateLabel(roundedValue.toString(10));
    } else if (!isTouch) {
      const valueAsFraction = host.getValueAsFraction();
      const thumbOffset = valueAsFraction * clientWidth;
      const thumbMin = thumbOffset - 20;
      const thumbMax = thumbOffset + 20;
      isHoveringThumb = offsetX >= thumbMin && offsetX <= thumbMax;
    }

    if (isHoveringThumb || document.activeElement === host) {
      host.showLabel();
    } else {
      host.hideLabel();
    }
  }

  /**
   * @this Slider
   */
  static onLeaveEvent() {
    if (document.activeElement === this) return;
    this.hideLabel();
  }

  static onInputFocus() {
    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.updateTrack();
    host.showLabel();
  }

  static onInputBlur() {
    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.hideLabel();
  }

  #labelShown = false;

  constructor() {
    super();
    if (!this.hasAttribute('type')) {
      this.type = 'range';
      this.attributeChangedCallback('type', null, 'range');
    }
    this.rippleElement.remove();
    this.overlayElement.remove();
    this.trackElement = this.shadowRoot.getElementById('track');
    this.trackLabelElement = this.shadowRoot.getElementById('track-label');
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'ticks': {
        if (newValue == null) {
          this.trackElement.style.removeProperty('--ticks');
        } else {
          this.trackElement.style.setProperty('--ticks', newValue);
        }
        break;
      }
      case 'step':
      case 'min':
      case 'max':
      case 'value':
        if (newValue == null) {
          this.inputElement.removeAttribute(name);
        } else {
          this.inputElement.setAttribute(name, newValue);
        }
        this.updateTrack();
        this.updateLabel();
        break;
      default:
    }
  }

  showLabel() {
    if (this.#labelShown) return;
    this.#labelShown = true;
    this.trackLabelElement.hidden = false;
  }

  hideLabel() {
    if (!this.#labelShown) return;
    this.#labelShown = false;
    this.trackLabelElement.hidden = true;
  }

  updateLabel(text = this.inputElement.value ?? '') {
    this.trackLabelElement.setAttribute('text', text);
  }

  getValueAsFraction() {
    const { min, max, valueAsNumber } = this.inputElement;
    const nMin = (min === '') ? 0 : Number.parseFloat(min);
    const nMax = (max === '') ? 100 : Number.parseFloat(max);

    return (valueAsNumber - nMin) / (nMax - nMin);
  }

  /**
   * @param {number} [value]
   * @return {void}
   */
  updateTrack(value = this.getValueAsFraction()) {
    this.trackElement.style.setProperty('--value', value.toPrecision(12));
  }

  /** @param {string} v */
  set value(v) {
    super.value = v;
    this.updateTrack();
    this.updateLabel();
  }

  get valueAsNumber() {
    return this.inputElement.valueAsNumber;
  }

  set valueAsNumber(v) {
    this.inputElement.valueAsNumber = v;
    this.updateTrack();
    this.updateLabel();
  }

  connectedCallback() {
    super.connectedCallback();
    this.inputElement.addEventListener('change', Slider.onInputChange);
    this.inputElement.addEventListener('mousedown', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('mousemove', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('touchmove', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('touchstart', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('touchend', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('touchleave', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('touchcancel', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('mouseout', Slider.onInputMouseOrTouch, { passive: true });
    this.inputElement.addEventListener('focus', Slider.onInputFocus, { passive: true });
    this.inputElement.addEventListener('blur', Slider.onInputBlur, { passive: true });
    this.addEventListener('mouseout', Slider.onLeaveEvent);
    this.updateTrack();
  }
}

Slider.prototype.min = Slider.idlString('min');
Slider.prototype.max = Slider.idlString('max');
Slider.prototype.step = Slider.idlString('step');
Slider.prototype.ticks = Slider.idlInteger('ticks');
