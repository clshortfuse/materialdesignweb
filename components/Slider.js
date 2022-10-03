import Input from './Input.js';
import styles from './Slider.css' assert { type: 'css' };

export default class Slider extends Input {
  constructor() {
    super();
    if (!this.hasAttribute('type')) {
      this.type = 'range';
      this.attributeChangedCallback('type', null, 'range');
    }
    this.rippleElement.remove();
    this.overlayElement.remove();
    this.trackElement = this.shadowRoot.getElementById('track');
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
      case 'min':
      case 'max':
      case 'value':
        if (newValue == null) {
          this.inputElement.removeAttribute(name);
        } else {
          this.inputElement.setAttribute(name, newValue);
        }
        this.updateTrack();
        break;
      default:
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    /** @type {{host:Slider}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
    }
    host.updateTrack();
  }

  updateTrack() {
    const { min, max, valueAsNumber } = this.inputElement;
    const nMin = (min === '') ? 0 : Number.parseFloat(min);
    const nMax = (max === '') ? 100 : Number.parseFloat(max);
    const value = (valueAsNumber - nMin) / (nMax - nMin);
    this.trackElement.style.setProperty('--value', value.toPrecision(12));
  }

  static elementName = 'mdw-slider';

  static styles = [...super.styles, styles];

  connectedCallback() {
    super.connectedCallback();
    this.inputElement.addEventListener('change', Slider.onInputChange);
    this.updateTrack();
  }

  get valueAsNumber() {
    return this.inputElement.valueAsNumber;
  }

  set valueAsNumber(v) {
    this.inputElement.valueAsNumber = v;
  }

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div id=track></div>
    `,
  ];
}

Slider.prototype.min = Slider.idlString('min');
Slider.prototype.max = Slider.idlString('max');
Slider.prototype.step = Slider.idlString('step');
