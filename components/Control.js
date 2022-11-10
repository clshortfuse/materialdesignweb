/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import styles from './Control.css' assert { type: 'css' };
import { FormAssociatedMixin } from './FormAssociatedMixin.js';
import Ripple from './Ripple.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} HTMLControlElement */

export default class Control extends FormAssociatedMixin(Ripple) {
  static delegatesFocus = true;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...this.clonedContentAttributes,
    ];
  }

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.append(html`
      <label id=label>
        <${this.controlTagName} id=control aria-labelledby="slot"
          onclick={static.onControlClick}
          onchange={static.onControlChange}
          onkeydown={static.onControlKeydown}
          onfocus={~static.onControlFocus}
          onblur={~static.onControlBlur}
          oninput={static.onControlInput}
          >${this.controlVoidElement ? '' : `</${this.controlTagName}>`}
          ${template.getElementById('state')}
          ${template.getElementById('ripple')}
          ${template.getElementById('slot')}
      </label>
    `);
    return template;
  }

  static controlTagName = 'input';

  static controlVoidElement = true;

  /** @type {string[]} */
  static clonedContentAttributes = [
    'autocomplete', 'disabled', 'name', 'readonly', 'required',
  ];

  /** @type {string[]} */
  static valueChangingContentAttributes = [];

  _control = /** @type {HTMLControlElement} */ (this.refs.control);

  constructor() {
    super();
    this._value = this._control.value;
    if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'aria-label':
        if (newValue == null) {
          this._control.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            this._control.setAttribute('aria-labelledby', 'slot');
          }
        } else {
          this._control.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            this._control.removeAttribute('aria-labelledby');
          }
        }
        break;
      case 'disabled':
        this._control.disabled = newValue != null;
        if (newValue === null) {
          this.setAttribute('tabindex', '0');
        } else {
          this.removeAttribute('tabindex');
        }
        break;
      default:
    }
    if (name === 'aria-controls') {
      if (newValue == null) {
        this._control.removeAttribute(name);
      } else {
        this._control.setAttribute(name, newValue);
      }
    }

    if (this.static.clonedContentAttributes.includes(name)) {
      if (newValue == null) {
        this._control.removeAttribute(name);
      } else {
        this._control.setAttribute(name, newValue);
      }
    }

    if (this.static.valueChangingContentAttributes.includes(name)) {
      if (!this.hasAttribute('value')) {
        // Force HTMLInputElement to recalculate default
        // Unintended effect of incrementally changing attributes (eg: range)
        this._control.setAttribute('value', '');
      }
      // Changing control attribute may change the value (eg: min/max)
      this._value = this._control.value;
    }
  }

  /** @return {typeof Control} */
  get static() { return /** @type {typeof Control} */ (super.static); }

  get form() { return this.elementInternals.form; }

  // get name() { return this.getAttribute('name'); }
  get value() {
    return this._value;
  }

  set value(v) {
    this._dirtyValue = true;
    this._control.value = v;
    this._value = this._control.value;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() {
    const validityState = this._control.checkValidity();
    /** @type {Partial<ValidityState>} */
    const newValidity = {};

    // eslint-disable-next-line guard-for-in
    for (const key in this._control.validity) {
      // @ts-ignore Skip cast
      newValidity[key] = this._control.validity[key];
    }
    this.elementInternals.setValidity(newValidity, this._control.validationMessage);
    this._invalid = !validityState;
    this._validationMessage = this._control.validationMessage;
    this._badInput = this._control.validity.badInput;
    return validityState;
  }

  reportValidity() {
    this.checkValidity();
    this._control.reportValidity();
    return this.elementInternals.reportValidity();
  }

  /**
   * @param {string} error
   * @return {void}
   */
  setCustomValidity(error) {
    this._control.setCustomValidity(error);
    this.checkValidity();
  }

  get labels() { return this.elementInternals.labels; }

  connectedCallback() {
    super.connectedCallback();
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
    this._control.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    // control.addEventListener('invalid', Control.onControlInvalid);
  }
}
