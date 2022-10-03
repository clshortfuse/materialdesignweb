import styles from './Input.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @implements {Omit<HTMLInputElement,DeprecatedHTMLInputElementProperties>} */
export default class Input extends Ripple {
  static delegatesFocus = true;

  static formAssociated = true;

  static FORM_IPC_EVENT = 'mdw-input-changed';

  static GlobalListener = new EventTarget();

  #ipcListener = this.formIPCEvent.bind(this);

  /** @type {EventTarget} */
  #ipcTarget = null;

  constructor() {
    super();
    this.inputElement = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById('input'));
    this.labelElement = /** @type {HTMLLabelElement} */ this.shadowRoot.getElementById('label');
    this.labelElement.append(
      this.overlayElement,
      this.rippleElement,
      this.slotElement,
    );

    if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
      this.setAttribute('tabindex', '0');
    }
  }

  static idlInputElementAttributes = [
    'aria-labelledby', 'type', 'value', 'checked',
    'name', 'required', 'list',
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
    if (name === 'aria-controls' || Input.idlInputElementAttributes.includes(name)) {
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
            console.log('Input.attributeChangedCallback: unset', this.name, 'null');
            this.elementInternals.setFormValue(null);
          } else {
            // console.log('Input.attributeChangedCallback: set', this.name, this.value ?? 'on');
            this.elementInternals.setFormValue(this.value ?? 'on');
            this.#ipcTarget?.dispatchEvent(
              new CustomEvent(Input.FORM_IPC_EVENT, { detail: [this.name, this.value] }),
            );
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
      <label id=label>
        <input id=input aria-labelledby="slot">
      </label>
    `,
  ];

  
  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
   static onInputClick(event) {
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;

    this.checked = false;
    host.toggleAttribute('checked', false);
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputKeydown(event) {
    if (event.key !== 'Spacebar' && event.key !== ' ') return;
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;
    event.preventDefault();

    this.checked = false;
    host.toggleAttribute('checked', false);
    event.preventDefault();
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    host.toggleAttribute('checked', this.checked);
  }

  refreshFormAssociation() {
    const newTarget = this.elementInternals.form ?? Input.GlobalListener;
    if (newTarget === this.#ipcTarget) {
      console.warn('Already associated?', newTarget);
      return;
    }
    if (this.#ipcTarget) {
      this.#ipcTarget.removeEventListener(Input.FORM_IPC_EVENT, this.#ipcListener);
    }
    if (this.type !== 'radio') return;

    this.#ipcTarget = newTarget;
    this.#ipcTarget.addEventListener(Input.FORM_IPC_EVENT, this.#ipcListener);
  }

  /**
   * New lifecycle callback. This is called when association with
   * <form> is changed.
   * @param {HTMLFormElement?} form
   * @return {void}
   */
  formAssociatedCallback(form) {
    this.refreshFormAssociation();
  }

  /**
   * @param {CustomEvent<[string, string]>} event
   * @return {void}
   */
  formIPCEvent(event) {
    if (event.target !== this.#ipcTarget) {
      console.warn('Input.formIPCEvent: Abort from wrong form');
      return;
    }
    if (this.type !== 'radio') {
      console.warn('Input.formIPCEvent: Abort from not radio');
      return;
    }
    const [name, value] = event.detail;
    if (this.name !== name) return;
    if (value !== this.value) {
      console.log('Input.formIPCEvent: Unset self', this.name, this.value);
      this.checked = false;
      this.removeAttribute('checked');
    } else {
      console.log('Input.formIPCEvent: Continue match', this.name, this.value);
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
  focus(options = undefined) {
    super.focus(options);
    this.inputElement?.focus(options);
  }

  get form() { return this.elementInternals.form; }

  get name() { return this.getAttribute('name'); }

  get type() { return this.inputElement.type; }

  set type(value) {
    this.inputElement.type = value;
    if (value === 'radio') {
      this.refreshFormAssociation();
    }
  }

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
    console.log('Input.value =', v);
    this.inputElement.value = v;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() { return this.elementInternals.checkValidity(); }

  reportValidity() { return this.elementInternals.reportValidity(); }

  connectedCallback() {
    super.connectedCallback();
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
    this.inputElement.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    this.inputElement.addEventListener('click', Input.onInputClick);
    this.inputElement.addEventListener('change', Input.onInputChange);
    this.inputElement.addEventListener('keydown', Input.onInputKeydown);
    if (!this.elementInternals.form) {
      this.formAssociatedCallback(null);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.inputElement.removeEventListener('click', Input.onInputClick);
    this.inputElement.removeEventListener('change', Input.onInputChange);
    this.inputElement.removeEventListener('keydown', Input.onInputKeydown);
  }
}

Input.prototype.ariaControls = Input.idlString('aria-controls');
