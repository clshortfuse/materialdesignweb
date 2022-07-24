import * as AriaButton from '../../core/aria/button.js';
import MDWRipple from '../../core/ripple/MDWRipple.js';

import styles from './MDWButton.css' assert { type: 'css' };

export default class MDWButton extends MDWRipple {
  constructor() {
    super();
    this.iconElement = this.shadowRoot.querySelector('.mdw-button__icon');
    /** @type {HTMLImageElement} */
    this.imageElement = this.shadowRoot.querySelector('.mdw-button__image');
    if (!this.hasAttribute('mdw-type')) {
      this.setAttribute('mdw-type', 'label-large');
    }
  }

  static get observedAttributes() {
    return ['mdw-icon', 'mdw-src', 'aria-disabled', 'mdw-outlined'];
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'mdw-icon':
        if (newValue) {
          this.iconElement.textContent = newValue;
        }
        break;
      case 'mdw-src':
        if (newValue == null) {
          this.imageElement.removeAttribute('src');
        } else {
          this.imageElement.setAttribute('src', newValue);
        }
        break;
      case 'aria-disabled':
        if (this.getAttribute('role') !== 'button') return;
        if (newValue === 'true') {
          this.removeAttribute('tabindex');
        } else {
          this.setAttribute('tabindex', '0');
        }
        break;
      default:
    }
  }

  static elementName = 'mdw-button';

  static get styles() {
    return [
      ...super.styles,
      new URL('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:FILL@0..1'),
      styles,
    ];
  }

  static get fragments() {
    return [
      ...super.fragments,
      /* html */`
        <div class="mdw-button__touch-target" aria-hidden="true"></div>
        <div class="mdw-button__outline" aria-hidden="true"></div>
        <div class="mdw-button__icon material-symbols-outlined" aria-hidden="true">
          <img class="mdw-button__image" aria-hidden="true"/>
        </div>
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    AriaButton.attach(this);
  }

  disconnectedCallback() {
    AriaButton.detach(this);
    super.disconnectedCallback();
  }
}
