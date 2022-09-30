// import fontStyles from 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1' assert { type: 'css'};

import Container from './Container.js';
import styles from './Progress.css' assert { type: 'css' };

/** @implements {HTMLProgressElement} */
export default class Progress extends Container {
  static elementName = 'mdw-progress';

  constructor() {
    super();
    this.progressElement = /** @type {HTMLProgressElement} */ (this.shadowRoot.getElementById('progress'));
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
      case 'value':
      case 'max':
        if (newValue == null) {
          this.progressElement.removeAttribute(name);
        } else {
          this.progressElement.setAttribute(name, newValue);
          this.progressElement.style.setProperty('--mdw-progress__value', (this.value / (this.max || 100)).toPrecision(12));
        }
        break;
      default:
    }
  }

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <progress id=progress></progress>
      <div id=line1 class=line></div>
      <div id=line2 class=line></div>
    `,
  ];

  get position() { return this.progressElement.position; }

  get labels() { return this.progressElement.labels; }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element

Progress.prototype.value = Progress.idlFloat('value');
Progress.prototype.max = Progress.idlFloat('max');
Progress.prototype.autoHide = Progress.idlBoolean('auto-hide');
