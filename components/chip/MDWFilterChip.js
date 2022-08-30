import * as AriaCheckbox from '../../core/aria/checkbox.js';

import MDWChip from './MDWChip.js';
import styles from './MDWFilterChip.css' assert { type: 'css' };

export default class MDWFilterChip extends MDWChip {
  constructor() {
    super();

    this.inputElement = this.shadowRoot.querySelector('input');
    this.labelElement = this.shadowRoot.querySelector('label');
    this.trailingIconElement = this.shadowRoot.querySelector('.mdw-chip__trailing-icon');
    /** @type {HTMLImageElement} */
    this.trailingImageElement = this.shadowRoot.querySelector('.mdw-chip__trailing-image');
    this.inputElement.type = 'checkbox';

    // this.labelElement.append(...this.buttonElement.children);
    // Aria will use aria-labelledby instead
    // Fallback with wrapped HTMLLabelElement

    if (this.icon == null && this.src == null) {
      this.icon = 'check';
      super.attributeChangedCallback('icon', null, 'check');
    }

    if (this.getAttribute('trailing-icon') === '') {
      this.setAttribute('trailing-icon', 'dropdown');
      this.attributeChangedCallback('trailing-icon', null, 'dropdown');
    }
  }

  

  static elementName = 'mdw-filter-chip';

  static styles = [...super.styles, styles];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'trailing-icon':
        if (newValue) {
          this.trailingIconElement.textContent = newValue;
        }
        break;
      case 'trailing-src':
        if (newValue == null) {
          this.trailingImageElement.removeAttribute('src');
        } else {
          this.trailingImageElement.setAttribute('src', newValue);
        }
        break;
      default:
    }
  }

  static fragments = [
    ...super.fragments,
    /* html */`
      <label class="mdw-button__text" role=none>
        <input type="checkbox" aria-labelledby="slot" class="mdw-chip__checkbox">
        <div class="mdw-chip__trailing-icon" aria-hidden="true"></div>
      </label>
    `,
  ];

  /**
   * @param {InputEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputEvent(event) {
    if (this.disabled) return;
    /** @type {{host:MDWFilterChip}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.checked = this.checked;
  }

  connectedCallback() {
    super.connectedCallback();
    this.inputElement.addEventListener('input', MDWFilterChip.onInputEvent);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('input', MDWFilterChip.onInputEvent);
    super.disconnectedCallback();
  }
}
