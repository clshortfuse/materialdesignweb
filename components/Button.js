import styles from './Button.css' assert { type: 'css' };
import Icon from './Icon.js';
import Input from './Input.js';

export default class Button extends Input {
  static elementName = 'mdw-button';

  static fragments = [
    ...super.fragments,
    /* html */`
      <div id=touch-target aria-hidden="true"></div>
      <div id=outline aria-hidden="true"></div>
      <mdw-icon id=icon aria-hidden="true"></mdw-icon>
    `,
  ];

  static styles = [...super.styles, styles];

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onButtonClick(event) {
    if (this.disabled) return;
    if (this.type !== 'submit') return;
    /** @type {{host:Button}} */ // @ts-ignore Coerce
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

  constructor() {
    super();
    this.iconElement = /** @type {Icon} */ (this.shadowRoot.getElementById('icon'));
    this.touchTargetElement = this.shadowRoot.getElementById('touch-target');
    this.outlineElement = this.shadowRoot.getElementById('outline');
    this.labelElement.append(
      this.iconElement,
      this.rippleElement,
      this.touchTargetElement,
      this.outlineElement,
    );

    this.inputElement.setAttribute('role', 'button');
    if (!this.hasAttribute('type')) {
      this.type = 'button';
    }
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

  connectedCallback() {
    super.connectedCallback();
    this.inputElement.addEventListener('click', Button.onButtonClick, { passive: true });
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('click', Button.onButtonClick);
    super.disconnectedCallback();
  }
}

Button.prototype.elevated = Button.idlBoolean('elevated');
Button.prototype.filled = Button.idlBoolean('filled');
Button.prototype.outlined = Button.idlBoolean('outlined');
Button.prototype.icon = Button.idlString('icon');
Button.prototype.src = Button.idlString('src');
