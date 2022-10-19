/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import styles from './Control.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} HTMLControlElement */

/** @implements {HTMLElement} */
export default class Control extends Ripple {
  static elementName = 'mdw-control';

  static styles = [...super.styles, styles];

  static delegatesFocus = true;

  static formAssociated = true;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...this.clonedContentAttributes,
      ...this.valueChangingContentAttributes,
      'aria-label',
    ];
  }

  static controlTagName = 'input';

  static controlVoidElement = true;

  static FORM_IPC_EVENT = 'mdw-control-changed';

  static GlobalListener = new EventTarget();

  /** @type {string[]} */
  static clonedContentAttributes = ['autocomplete', 'disabled', 'name', 'readonly', 'required'];

  /** @type {string[]} */
  static valueChangingContentAttributes = [];

  _dirtyValue = false;

  #ipcListener = this.formIPCEvent.bind(this);

  /** @type {EventTarget} */
  #ipcTarget = null;

  #control = /** @type {HTMLControlElement} */ (this.refs.control);

  constructor() {
    super();
    this._value = this.#control.value;
    if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
      this.setAttribute('tabindex', '0');
    }
  }

  static onControlFocus() {
    /** @type {{host:Control}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host._isFocused = true;
  }

  /**
   * @this {HTMLControlElement}
   * @param {FocusEvent} event
   * @return {void}
   */
  static onControlBlur(event) {
    /** @type {{host:Control}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host._isFocused = false;
    host.checkValidity();
  }

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLControlElement}
   * @return {void}
   */
  static onControlClick(event) {}

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLControlElement}
   * @return {void}
   */
  static onControlKeydown(event) {}

  /**
   * @param {InputEvent} event
   * @this {HTMLControlElement}
   * @return {void}
   */
  static onControlInput(event) {
    /** @type {{host:Control}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (!host.validity.valid) {
      // Perform check in case user has validated
      host.checkValidity();
    } else {
      // Track internally
      this.checkValidity();
      host._badInput = this.validity.badInput;
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLControlElement} this
   * @return {void}
   */
  static onControlChange(event) {
    /** @type {{host:Control}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host._value = this.value;
    host.checkValidity();
  }

  compose() {
    const fragment = super.compose();
    const { html } = this;
    const component = /** @type {typeof Control} */ (this.constructor);
    fragment.append(html`
      <label id=label>
        <${component.controlTagName} id=control aria-labelledby="slot"
          onclick="{constructor.onControlClick}"
          onchange="{constructor.onControlChange}"
          onkeydown="{constructor.onControlKeydown}"
          onfocus="{~constructor.onControlFocus}"
          onblur="{~constructor.onControlBlur}"
          oninput="{constructor.onControlInput}"
          >${component.controlVoidElement ? '' : `</${component.controlTagName}>`}
      </label>
    `);
    fragment.getElementById('label').append(
      fragment.getElementById('overlay'),
      fragment.getElementById('ripple'),
      fragment.getElementById('slot'),
    );
    return fragment;
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
          this.#control.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            this.#control.setAttribute('aria-labelledby', 'slot');
          }
        } else {
          this.#control.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            this.#control.removeAttribute('aria-labelledby');
          }
        }
        break;
      case 'disabled':
        switch (this.#control.getAttribute('role')) {
          case null:
          case 'button':
          case 'radio':
          case 'switch':
            this.#control.disabled = newValue != null;
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
    if (name === 'aria-controls') {
      if (newValue == null) {
        this.#control.removeAttribute(name);
      } else {
        this.#control.setAttribute(name, newValue);
      }
    }

    const component = /** @type {typeof Control} */ (this.constructor);
    if (component.clonedContentAttributes.includes(name)) {
      if (newValue == null) {
        this.#control.removeAttribute(name);
      } else {
        this.#control.setAttribute(name, newValue);
      }
    }

    if (component.valueChangingContentAttributes.includes(name)) {
      if (!this.hasAttribute('value')) {
        // Force HTMLInputElement to recalculate default
        // Unintended effect of incrementally changing attributes (eg: range)
        this.#control.setAttribute('value', '');
      }
      // Changing control attribute may change the value (eg: min/max)
      this._value = this.#control.value;
    }
  }

  get dirtyValue() { return this._dirtyValue; }

  /** @type {Ripple['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case '_value':
        // Reinvoke change event for components tracking 'value';
        this.idlChangedCallback('value', oldValue, newValue);
        break;
      default:
    }
  }

  refreshFormAssociation() {
    const newTarget = this.elementInternals.form ?? Control.GlobalListener;
    if (newTarget === this.#ipcTarget) {
      console.warn('Already associated?', newTarget);
      return;
    }
    if (this.#ipcTarget) {
      this.#ipcTarget.removeEventListener(Control.FORM_IPC_EVENT, this.#ipcListener);
    }
    if (this.type !== 'radio') return;

    this.#ipcTarget = newTarget;
    this.#ipcTarget.addEventListener(Control.FORM_IPC_EVENT, this.#ipcListener);
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
  formIPCEvent(event) {}

  // this element or an ancestor <fieldset> is updated.
  formDisabledCallback(disabled) {
    // console.log('formDisabledCallback', disabled, this);
    // TODO: Always disabled regardless of form disabled state
    // this.disabled = disabled;
  }

  // New lifecycle callback. This is called when ‘disabled’ attribute of
  formResetCallback() {
    this.value = this.getAttribute('value') || '';
  }

  /**
   *
   * @param {string|FormData} state
   * @param {'autocomplete'|'restore'} mode
   */
  formStateRestoreCallback(state, mode) {
    console.log('formStateRestoreCallback', state);
    if (typeof state === 'string') {
      this.value = state;
    } else {
      console.warn('Could not restore', state);
    }
  }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    this.#control.focus(options);
  }

  get form() { return this.elementInternals.form; }

  // get name() { return this.getAttribute('name'); }
  get value() {
    return this._value;
  }

  set value(v) {
    console.warn('setting value');
    this._dirtyValue = true;
    this.#control.value = v;
    this._value = this.#control.value;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() {
    const validityState = this.#control.checkValidity();
    /** @type {Partial<ValidityState>} */
    const newValidity = {};
    // eslint-disable-next-line guard-for-in
    for (const key in this.#control.validity) {
      // @ts-ignore Skip cast
      newValidity[key] = this.#control.validity[key];
    }
    this.elementInternals.setValidity(newValidity, this.#control.validationMessage);
    this._invalid = !validityState;
    this._validationMessage = this.#control.validationMessage;
    this._badInput = this.#control.validity.badInput;
    return validityState;
  }

  reportValidity() {
    this.checkValidity();
    this.#control.reportValidity();
    return this.elementInternals.reportValidity();
  }

  /**
   * @param {string} error
   * @return {void}
   */
  setCustomValidity(error) {
    this.#control.setCustomValidity(error);
    this.checkValidity();
  }

  get labels() { return this.elementInternals.labels; }

  /**
   * @param {string} key
   * @param {string} value
   * @return {void}
   */
  _notifyRadioChange(key, value) {
    this.#ipcTarget?.dispatchEvent(
      new CustomEvent(Control.FORM_IPC_EVENT, { detail: [key, value] }),
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
    this.#control.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    // control.addEventListener('invalid', Control.onControlInvalid);
    if (!this.elementInternals.form) {
      this.formAssociatedCallback(null);
    }
  }
}

Control.prototype.ariaControls = Control.idl('ariaControls');
Control.prototype._isFocused = Control.idl('_isFocused', 'boolean');

// https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

const DOMString = { onNullish: String };

Control.prototype.autocomplete = Control.idl('autocomplete', DOMString);
Control.prototype.disabled = Control.idl('disabled', 'boolean');
// readonly attribute HTMLFormElement? form;
Control.prototype.name = Control.idl('name', DOMString);
Control.prototype.readOnly = Control.idl('readOnly', { attr: 'readonly', type: 'boolean' });
Control.prototype.required = Control.idl('required', 'boolean');
Control.prototype.type = Control.idl('type', DOMString);
//  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
Control.prototype._value = Control.idl('_value', { empty: '' });
Control.prototype._invalid = Control.idl('_invalid', { attr: 'invalid', type: 'boolean' });
Control.prototype._badInput = Control.idl('_badInput', 'boolean');
Control.prototype._validationMessage = Control.idl('_validationMessage');
// readonly attribute boolean willValidate;
// readonly attribute ValidityState validity;
// readonly attribute DOMString validationMessage;
// boolean checkValidity();
// boolean reportValidity();
// undefined setCustomValidity(DOMString error);
// readonly attribute NodeList? labels;
