// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import Container from './Container.js';
import styles from './Progress.css' assert { type: 'css' };
import circleStyles from './ProgressCircle.css' assert { type: 'css' };
import lineStyles from './ProgressLine.css' assert { type: 'css' };

/** @implements {HTMLProgressElement} */
export default class Progress extends Container {
  static elementName = 'mdw-progress';

  static fragments = [
    ...super.fragments,
    /* html */`
      <progress id=progress></progress>
      <div id=indeterminate-line>
        <div id=line1 class=line></div>
        <div id=line2 class=line></div>
      </div>
      <div id=indeterminate-circle>
        <div id=arc2 class=arc></div>
        <div id=arc3 class=arc></div>
        <div id=arc4 class=arc></div>
      </div>
      <div id=circle>
        <div id=semi1 class=semi></div>
        <div id=semi2 class=semi></div>
      </div>
    `,
  ];

  static styles = [...super.styles, styles, lineStyles, circleStyles];

  constructor() {
    super();
    this.progressElement = /** @type {HTMLProgressElement} */ (this.shadowRoot.getElementById('progress'));
    this.circleElement = this.shadowRoot.getElementById('circle');
    this.slotElement.remove();
    this.slotElement = null;
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
      default:
        return;
      case 'value':
      case 'max':
        if (newValue == null) {
          this.circleElement.removeAttribute(name);
          this.progressElement.removeAttribute(name);
          return;
        }
    }
    this.circleElement.setAttribute(name, newValue);
    this.progressElement.setAttribute(name, newValue);

    const value = (this.value / (this.max || 100)).toPrecision(12);
    const previous = this.circleElement.style.getPropertyValue('--value') || value;

    this.circleElement.style.setProperty('--previous', previous);
    this.circleElement.style.setProperty('--value', value);
    this.progressElement.style.setProperty('--value', value);
  }

  get position() { return this.progressElement.position; }

  get labels() { return this.progressElement.labels; }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

Progress.prototype.value = Progress.idlFloat('value');
Progress.prototype.max = Progress.idlFloat('max');
Progress.prototype.autoHide = Progress.idlBoolean('auto-hide');
