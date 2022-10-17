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

  constructor() {
    super();
    this._value = this.refs.control.value;
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
          >
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
    const { control } = this.refs;
    if (!control) return;
    switch (name) {
      case 'aria-label':
        if (newValue == null) {
          control.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            control.setAttribute('aria-labelledby', 'slot');
          }
        } else {
          control.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            control.removeAttribute('aria-labelledby');
          }
        }
        break;
      case 'disabled':
        switch (control.getAttribute('role')) {
          case null:
          case 'button':
          case 'radio':
          case 'switch':
            control.disabled = newValue != null;
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
        control.removeAttribute(name);
      } else {
        control.setAttribute(name, newValue);
      }
    }

    const component = /** @type {typeof Control} */ (this.constructor);
    if (component.clonedContentAttributes.includes(name)) {
      if (newValue == null) {
        control.removeAttribute(name);
      } else {
        control.setAttribute(name, newValue);
      }
    }

    if (component.valueChangingContentAttributes.includes(name)) {
      if (!this.hasAttribute('value')) {
        // Force HTMLInputElement to recalculate default
        // Unintended effect of incrementally changing attributes (eg: range)
        control.setAttribute('value', '');
      }
      // Changing control attribute may change the value (eg: min/max)
      this._value = control.value;
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
    this.refs.control?.focus(options);
  }

  get form() { return this.elementInternals.form; }

  // get name() { return this.getAttribute('name'); }
  get value() {
    return this._value;
  }

  set value(v) {
    console.warn('setting value');
    this._dirtyValue = true;
    this.refs.control.value = v;
    this._value = this.refs.control.value;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() {
    const { control } = this.refs;
    const validityState = control.checkValidity();
    /** @type {Partial<ValidityState>} */
    const newValidity = {};
    // eslint-disable-next-line guard-for-in
    for (const key in control.validity) {
      // @ts-ignore Skip cast
      newValidity[key] = control.validity[key];
    }
    this.elementInternals.setValidity(newValidity, control.validationMessage);
    this._invalid = !validityState;
    this._validationMessage = control.validationMessage;
    this._badInput = control.validity.badInput;
    return validityState;
  }

  reportValidity() {
    this.checkValidity();
    this.refs.control.reportValidity();
    return this.elementInternals.reportValidity();
  }

  /**
   * @param {string} error
   * @return {void}
   */
  setCustomValidity(error) {
    this.refs.control.setCustomValidity(error);
    this.checkValidity();
  }

  labels() { return this.elementInternals.labels; }

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
    const { control } = this.refs;
    control.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    // control.addEventListener('invalid', Control.onControlInvalid);
    if (!this.elementInternals.form) {
      this.formAssociatedCallback(null);
    }
  }
}

Control.prototype.ariaControls = Control.idl('ariaControls');
Control.prototype._isFocused = Control.idlBoolean('_isFocused');

// https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

const DOMString = { onNullish: String };
const NOT_NULLABLE = { nullable: false };

Control.prototype.autocomplete = Control.idl('autocomplete', DOMString);
Control.prototype.disabled = Control.idlBoolean('disabled');
// readonly attribute HTMLFormElement? form;
Control.prototype.name = Control.idl('name', DOMString);
Control.prototype.readOnly = Control.idlBoolean('readOnly', { attr: 'readonly' });
Control.prototype.required = Control.idlBoolean('required');
Control.prototype.type = Control.idl('type', DOMString);
//  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
Control.prototype._value = Control.idl('_value', { default: '', reflect: false });
Control.prototype._invalid = Control.idlBoolean('_invalid', { attr: 'invalid' });
Control.prototype._badInput = Control.idlBoolean('_badInput');
Control.prototype._validationMessage = Control.idl('_validationMessage');
// readonly attribute boolean willValidate;
// readonly attribute ValidityState validity;
// readonly attribute DOMString validationMessage;
// boolean checkValidity();
// boolean reportValidity();
// undefined setCustomValidity(DOMString error);
// readonly attribute NodeList? labels;

Control.prototype.refs = {
  ...Ripple.prototype.refs,
  ...Control.addRefs({
    control: { id: 'control', type: /** @type {'input'|'textarea'|'select'} */ (null) },
  }),
};
