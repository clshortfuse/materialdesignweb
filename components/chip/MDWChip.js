import MDWButton from '../button/MDWButton.js';

import styles from './MDWChip.css' assert { type: 'css' };

export default class MDWChip extends MDWButton {
  constructor() {
    super();
    this.trailingIconElement = this.shadowRoot.querySelector('.mdw-chip__trailing-icon');
    /** @type {HTMLImageElement} */
    this.trailingImageElement = this.shadowRoot.querySelector('.mdw-chip__trailing-image');
    this.setAttribute('mdw-outlined', '');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'mdw-trailing-icon', 'mdw-trailing-src'];
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
      case 'mdw-trailing-icon':
        if (newValue) {
          this.trailingIconElement.textContent = newValue;
        }
        break;
      case 'mdw-trailing-src':
        if (newValue == null) {
          this.trailingImageElement.removeAttribute('src');
        } else {
          this.trailingImageElement.setAttribute('src', newValue);
        }
        break;
      default:
    }
  }

  static elementName = 'mdw-chip';

  static get styles() { return [...super.styles, styles]; }

  static get fragments() {
    return [
      ...super.fragments,
      /* html */`
        <div class="mdw-chip__trailing-icon material-symbols-outlined" aria-hidden="true">
            <img class="mdw-chip__trailing-image" aria-hidden="true"/>
        </div>
      `,
    ];
  }
}
