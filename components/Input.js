import Container from './Container.js';
import styles from './Input.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @implements {Omit<HTMLInputElement,DeprecatedHTMLInputElementProperties>} */
export default class Input extends Ripple {
  static elementName = 'mdw-input';

  static styles = [...super.styles, styles];

  static delegatesFocus = true;

  static formAssociated = true;

  static fragments = [
    ...super.fragments,
    /* html */`
      <label id=label>
        <input id=input aria-labelledby="slot">
      </label>
    `,
  ];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('label').append(
      fragment.getElementById('overlay'),
      fragment.getElementById('ripple'),
      fragment.getElementById('slot'),
    );
    return fragment;
  }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...this.idlInputElementAttributes,
      'aria-label',
    ];
  }

  static FORM_IPC_EVENT = 'mdw-input-changed';

  static GlobalListener = new EventTarget();

  static idlInputElementAttributes = [
    'aria-labelledby', 'type', 'value', 'checked',
    'name', 'required', 'list',
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

  #ipcListener = this.formIPCEvent.bind(this);

  /** @type {EventTarget} */
  #ipcTarget = null;

  constructor() {
    super();
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
    if (oldValue == null && newValue == null) return;
    const { input } = this.refs;
    if (!input) return;
    switch (name) {
      case 'aria-label':
        if (newValue == null) {
          input.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            input.setAttribute('aria-labelledby', 'slot');
          }
        } else {
          input.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            input.removeAttribute('aria-labelledby');
          }
        }
        break;
      case 'disabled':
        switch (input.getAttribute('role')) {
          case null:
          case 'button':
          case 'radio':
          case 'switch':
            input.disabled = newValue != null;
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
        input.removeAttribute(name);
      } else {
        input.setAttribute(name, newValue);
      }
    }
    if (name === 'checked') {
      switch (this.type) {
        case 'checkbox':
        case 'radio':
          if (newValue == null) {
            // console.log('Input.attributeChangedCallback: unset', this.name, 'null');
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
      // console.log('Input.formIPCEvent: Unset self', this.name, this.value);
      this.checked = false;
      this.removeAttribute('checked');
    } else {
      // console.log('Input.formIPCEvent: Continue match', this.name, this.value);
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
    this.refs.input?.focus(options);
  }

  get form() { return this.elementInternals.form; }

  get name() { return this.getAttribute('name'); }

  get type() { return this.refs.input?.type; }

  set type(value) {
    this.refs.input.type = value;
    if (value === 'radio') {
      this.refreshFormAssociation();
    }
  }

  get checked() { return this.refs.input.checked; }

  set checked(value) {
    this.refs.input.checked = value;
  }

  get required() {
    return this.refs.input.required;
  }

  set required(v) {
    this.refs.input.required = v;
  }

  get value() { return this.refs.input.value; }

  set value(v) {
    // console.log('Input.value =', v);
    this.refs.input.value = v;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() { return this.elementInternals.checkValidity(); }

  reportValidity() { return this.elementInternals.reportValidity(); }

  connectedCallback() {
    super.connectedCallback();
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
    const { input } = this.refs;
    input.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    input.addEventListener('click', Input.onInputClick);
    input.addEventListener('change', Input.onInputChange);
    input.addEventListener('keydown', Input.onInputKeydown);
    if (!this.elementInternals.form) {
      this.formAssociatedCallback(null);
    }
  }
}

Input.prototype.ariaControls = Input.idlString('aria-controls');

Input.prototype.refs = {
  ...Ripple.prototype.refs,
  ...Input.addRefNames('label', 'input'),
};
