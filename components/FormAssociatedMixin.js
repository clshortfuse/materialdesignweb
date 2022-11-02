/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import CustomElement from './CustomElement.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/**
 * @param {typeof CustomElement} Base
 */
export function FormAssociatedMixin(Base) {
  class FormAssociated extends Base {
    static formAssociated = true;

    static get observedAttributes() {
      return [
        ...super.observedAttributes,
        ...this.valueChangingContentAttributes,
        'aria-label',
      ];
    }

    static FORM_IPC_EVENT = 'mdw-form-associated-changed';

    static GlobalListener = new EventTarget();

    /** @type {string[]} */
    static valueChangingContentAttributes = [];

    static onControlFocus() {
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      host._isFocused = true;
    }

    /**
     * @this {HTMLControlElement}
     * @param {FocusEvent} event
     * @return {void}
     */
    static onControlBlur(event) {
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      host._isFocused = false;
      host.checkValidity();
    }

    /**
     * @param {MouseEvent|PointerEvent} event
     * @this {HTMLControlElement}
     * @return {void}
     */
    static onControlClick(event) {
    // Do nothing by default
    }

    /**
     * @param {KeyboardEvent} event
     * @this {HTMLControlElement}
     * @return {void}
     */
    static onControlKeydown(event) {
    // Do nothing by default
    }

    /**
     * @param {InputEvent} event
     * @this {HTMLInputElement}
     * @return {void}
     */
    static onControlInput(event) {
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
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
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();

      const previousValue = host._value;
      host._value = this.value;
      host.checkValidity();
      if (previousValue !== host._value) {
        host.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    #ipcListener = this.formIPCEvent.bind(this);

    /** @type {EventTarget} */
    #ipcTarget = null;

    _dirtyValue = false;

    /** @type {HTMLControlElement} */
    _control = this;

    constructor() {
      super();
      if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
        this.setAttribute('tabindex', '0');
      }
    }

    /** @type {CustomElement['idlChangedCallback']} */
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

    /**
     * @param {string} key
     * @param {string} value
     * @return {void}
     */
    _notifyRadioChange(key, value) {
      this.#ipcTarget?.dispatchEvent(
        new CustomEvent(FormAssociated.FORM_IPC_EVENT, { detail: [key, value] }),
      );
    }

    get dirtyValue() { return this._dirtyValue; }

    refreshFormAssociation() {
      const newTarget = this.elementInternals.form ?? FormAssociated.GlobalListener;
      if (newTarget === this.#ipcTarget) {
        console.warn('Already associated?', newTarget);
        return;
      }
      if (this.#ipcTarget) {
        this.#ipcTarget.removeEventListener(FormAssociated.FORM_IPC_EVENT, this.#ipcListener);
      }
      if (this.type !== 'radio') return;

      this.#ipcTarget = newTarget;
      this.#ipcTarget.addEventListener(FormAssociated.FORM_IPC_EVENT, this.#ipcListener);
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
    // eslint-disable-next-line class-methods-use-this
    formIPCEvent(event) {
      // virtual
    }

    // New lifecycle callback. This is called when ‘disabled’ attribute of
    // this element or an ancestor <fieldset> is updated.
    formDisabledCallback(disabled) {
    // console.log('formDisabledCallback', disabled, this);
    // TODO: Always disabled regardless of form disabled state
    // this.disabled = disabled;
    }

    formResetCallback() {
      this._dirtyValue = false;
      this.checkValidity();
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
      if (this._control === this) return;
      this._control.focus(options);
    }

    get form() { return this.elementInternals.form; }

    get value() {
      return this._value;
    }

    set value(v) {
      console.warn('setting value');
      this._dirtyValue = true;
      this._value = v;
    }

    get validity() { return this.elementInternals.validity; }

    get validationMessage() { return this.elementInternals.validationMessage; }

    get willValidate() { return this.elementInternals.willValidate; }

    checkValidity() { return this.elementInternals.checkValidity(); }

    reportValidity() { return this.elementInternals.reportValidity(); }

    /**
     * @param {string} error
     * @return {void}
     */
    setCustomValidity(error) {
      this.elementInternals.setValidity({
        ...this.elementInternals.validity,
        customError: !!error,
      }, this.elementInternals.validationMessage || error);
    }

    get labels() { return this.elementInternals.labels; }

    connectedCallback() {
      super.connectedCallback();
      // control.addEventListener('invalid', Control.onControlInvalid);
      if (!this.elementInternals.form) {
        this.formAssociatedCallback(null);
      }
    }
  }

  FormAssociated.prototype.ariaControls = FormAssociated.idl('ariaControls');
  FormAssociated.prototype._isFocused = FormAssociated.idl('_isFocused', 'boolean');

  // https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

  const DOMString = { onNullish: String };

  FormAssociated.prototype.autocomplete = FormAssociated.idl('autocomplete', DOMString);

  // disabled from Overlay component
  // readonly attribute HTMLFormElement? form;
  FormAssociated.prototype.name = FormAssociated.idl('name', DOMString);
  FormAssociated.prototype.readOnly = FormAssociated.idl('readOnly', { attr: 'readonly', type: 'boolean' });
  FormAssociated.prototype.required = FormAssociated.idl('required', 'boolean');
  FormAssociated.prototype.type = FormAssociated.idl('type', DOMString);
  //  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
  FormAssociated.prototype._value = FormAssociated.idl('_value', { empty: '' });
  FormAssociated.prototype._invalid = FormAssociated.idl('_invalid', { attr: 'invalid', type: 'boolean' });
  FormAssociated.prototype._badInput = FormAssociated.idl('_badInput', 'boolean');
  FormAssociated.prototype._validationMessage = FormAssociated.idl('_validationMessage');
  // readonly attribute boolean willValidate;
  // readonly attribute ValidityState validity;
  // readonly attribute DOMString validationMessage;
  // boolean checkValidity();
  // boolean reportValidity();
  // undefined setCustomValidity(DOMString error);
  // readonly attribute NodeList? labels;
  return FormAssociated;
}
