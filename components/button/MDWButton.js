import MDWInput from '../../core/input/MDWInput.js';

import styles from './MDWButton.css' assert { type: 'css' };

export default class MDWButton extends MDWInput {
  constructor() {
    super();
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.labelElement.append(this.iconElement, this.rippleElement);

    this.inputElement.setAttribute('role', 'button');
    if (!this.hasAttribute('type')) {
      this.type = 'button';
    }
  }

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'elevated', 'filled', 'outlined',
  ];

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'icon', 'src',
  ];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'icon':
      case 'src':
        if (newValue == null) {
          this.iconElement.removeAttribute(name);
        } else {
          this.iconElement.setAttribute(name, newValue);
        }
        break;
      default:
    }
  }

  static elementName = 'mdw-button';

  static styles = [
    ...super.styles,
    styles,
  ];

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=touch-target aria-hidden="true"></div>
      <div id=outline aria-hidden="true"></div>
      <mdw-icon id=icon aria-hidden="true"></mdw-icon>
    `,
  ];

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onButtonClick(event) {
    if (this.disabled) return;
    if (this.type !== 'submit') return;
    /** @type {{host:MDWButton}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.disabled) return;
    const value = null;
    const form = host.elementInternals?.form;
    if (!form) return;
    host.elementInternals.setFormValue(value);
    if ((this.type ?? 'submit') !== 'submit') return;
    const duplicatedButton = /** @type {HTMLButtonElement} */ (this.cloneNode());
    duplicatedButton.hidden = true;
    form.append(duplicatedButton);
    if ('requestSubmit' in form) {
      form.requestSubmit(duplicatedButton);
    } else {
      duplicatedButton.click();
    }
    duplicatedButton.remove();
  }

  connectedCallback() {
    super.connectedCallback();
    this.inputElement.addEventListener('click', MDWButton.onButtonClick, { passive: true });
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('click', MDWButton.onButtonClick);
    super.disconnectedCallback();
  }
}
