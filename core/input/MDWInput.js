import MDWRipple from '../ripple/MDWRipple.js';

import styles from './MDWInput.css' assert { type: 'css' };

/** @implements {HTMLInputElement} */
export default class MDWInput extends MDWRipple {
  static delegatesFocus = true;

  static formAssociated = true;

  static FORM_IPC_EVENT = 'mdw-input-changed';

  constructor() {
    super();
    this.inputElement = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('input'));
    this.labelElement = /** @type {HTMLLabelElement} */ this.shadowRoot.getElementById('label');
    this.labelElement.append(
      this.overlayElement,
      this.rippleElement,
      this.slotElement,
    );

    // Aria will use aria-labelledby instead
    // Fallback with wrapped HTMLLabelElement
    this.slotElement.setAttribute('aria-hidden', 'true');

    if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
      this.setAttribute('tabindex', '0');
    }
  }

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
  ];

  static idlInputElementAttributes = [
    'aria-labelledby', 'type', 'value', 'checked',
    'name', 'required',
  ];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...this.idlInputElementAttributes,
      'aria-label',
    ];
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
      case 'aria-label':
        if (newValue == null) {
          this.inputElement?.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            this.inputElement?.setAttribute('aria-labelledby', 'slot');
          }
        } else {
          this.inputElement?.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            this.inputElement?.removeAttribute('aria-labelledby');
          }
        }
        break;
      case 'disabled':
        if (!this.inputElement) break;
        switch (this.inputElement.getAttribute('role')) {
          case null:
          case 'button':
            this.inputElement.disabled = newValue != null;
            if (newValue === null) {
              this.setAttribute('tabindex', '0');
            } else {
              this.setAttribute('tabindex', '-1');
            }
            break;
          default:
        }
        break;
      default:
    }
    if (MDWInput.idlInputElementAttributes.includes(name)) {
      if (newValue == null) {
        this.inputElement?.removeAttribute(name);
      } else {
        this.inputElement?.setAttribute(name, newValue);
      }
    }
    if (name === 'checked') {
      switch (this.type) {
        case 'checkbox':
        case 'radio':
          if (newValue == null) {
            console.log('MDWInput.attributeChangedCallback: unset', this.name, 'null');
            this.elementInternals.setFormValue(null);
          } else {
            console.log('MDWInput.attributeChangedCallback: set', this.name, this.value ?? 'on');
            this.elementInternals.setFormValue(this.value ?? 'on');
            const { form } = this.elementInternals;
            if (form) {
              form.dispatchEvent(new CustomEvent(MDWInput.FORM_IPC_EVENT, { detail: [this.name, this.value] }));
              console.log('MDWInput.attributeChangedCallback: FORM_IPC_EVENT complete');
            }
          }
          break;
        default:
      }
    }
  }

  static elementName = 'mdw-input';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <label id=label role=none>
        <input id=input aria-labelledby="slot" >
      </label>
    `,
  ];

  /**
   * New lifecycle callback. This is called when association with
   * <form> is changed.
   * @param {HTMLFormElement?} form
   * @return {void}
   */
  formAssociatedCallback(form) {
    if (form == null) return;
    console.log('Form associated. Adding bind.');
    form.addEventListener(MDWInput.FORM_IPC_EVENT, this.formIPCEvent.bind(this));
  }

  /**
   * @param {CustomEvent<[string, string]>} event
   * @return {void}
   */
  formIPCEvent(event) {
    if (event.target !== this.elementInternals.form) {
      console.warn('MDWInput.formIPCEvent: Abort from wrong form');
      return;
    }
    if (this.type !== 'radio') {
      console.warn('MDWInput.formIPCEvent: Abort from not radio');
      return;
    }
    const [name, value] = event.detail;
    if (this.name !== name) return;
    if (value !== this.value) {
      console.log('MDWInput.formIPCEvent: Unset self', this.name, this.value);
      this.checked = false;
      this.removeAttribute('checked');
    } else {
      console.log('MDWInput.formIPCEvent: Continue match', this.name, this.value);
    }
  }

  // New lifecycle callback. This is called when ‘disabled’ attribute of
  // this element or an ancestor <fieldset> is updated.
  formDisabledCallback(disabled) {
    // console.log('formDisabledCallback', disabled, this);
    // TODO: Always disabled regardless of form disabled state
    // this.disabled = disabled;
  }

  formResetCallback() {
    this.value = this.getAttribute('value') || '';
  }

  formStateRestoreCallback(state, mode) {
    this.value = state;
  }

  /** @type {HTMLElement['focus']} */
  focus(options) {
    console.log('MDWInput.focus', this);
    super.focus(options);
    this.inputElement?.focus(options);
  }

  get form() { return this.elementInternals.form; }

  get name() { return this.getAttribute('name'); }

  get type() { return this.inputElement.type; }

  set type(value) { this.inputElement.type = value; }

  get checked() { return this.inputElement.checked; }

  set checked(value) {
    this.inputElement.checked = value;
  }

  get required() {
    return this.inputElement.required;
  }

  set required(v) {
    this.inputElement.required = v;
  }

  get value() { return this.inputElement.value; }

  set value(v) {
    console.log('MDWInput.value =', v);
    this.inputElement.value = v;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() { return this.elementInternals.checkValidity(); }

  reportValidity() { return this.elementInternals.reportValidity(); }

  connectedCallback() {
    super.connectedCallback();
    this.removeEventListener('keydown', MDWRipple.onKeyDown);
    this.inputElement.addEventListener('keydown', MDWRipple.onKeyDown, { passive: true });
  }
}
