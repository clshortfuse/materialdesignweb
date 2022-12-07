/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
 */
export default function FormAssociatedMixin(Base) {
  class FormAssociated extends Base {
    static formAssociated = true;

    /** @return {Iterable<string>} */
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

    #ipcListener = this.formIPCEvent.bind(this);

    /** @type {EventTarget} */
    #ipcTarget = null;

    _dirtyValue = false;

    /** @param {any[]} args */
    constructor(...args) {
      super(...args);
      if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
        this.tabIndex = 0;
        // this.setAttribute('tabindex', '0');
      }
    }

    /** @type {CustomElement['idlChangedCallback']} */
    idlChangedCallback(name, oldValue, newValue) {
      super.idlChangedCallback(name, oldValue, newValue);
      switch (name) {
        case '_value':
          // Reinvoke change event for components tracking 'value';
          this.idlChangedCallback('value', oldValue, newValue);
          break;
        default:
      }
    }

    /** @type {HTMLControlElement} */
    get _control() { return this; }

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

    /**
     * @this {HTMLControlElement}
     * @param {FocusEvent} event
     * @return {void}
     */
    onControlFocus(event) {
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      host._isFocused = true;
      // console.log('onControlFocus', this);
    }

    /**
     * @this {HTMLControlElement}
     * @param {FocusEvent} event
     * @return {void}
     */
    onControlBlur(event) {
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      host._isFocused = false;
      host.checkValidity();
      // console.log('onControlBlur', this);

      // event.stopPropagation(); // Prevent composed blur from bubbling to DOM
    }

    /**
     * @param {MouseEvent|PointerEvent} event
     * @this {HTMLControlElement}
     * @return {void}
     */
    onControlClick(event) {
    // Do nothing by default
    }

    /**
     * @param {KeyboardEvent} event
     * @this {HTMLControlElement}
     * @return {void}
     */
    onControlKeydown(event) {
    // Do nothing by default
    }

    /**
     * @param {InputEvent} event
     * @this {HTMLInputElement}
     * @return {void}
     */
    onControlInput(event) {
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
      host._value = this.value;
    }

    /**
     * @param {Event} event
     * @this {HTMLControlElement} this
     * @return {void}
     */
    onControlChange(event) {
    /** @type {{host:FormAssociated}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();
      host._value = this.value;
      host.checkValidity();
      host.dispatchEvent(new Event('change', { bubbles: true }));
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

    get form() { return this.elementInternals.form; }

    get value() {
      return this._value;
    }

    /** @param {string} v */
    set value(v) {
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

    /**
     * Reconstructs author-dispatched `click` event to control
     * @param {Event} event
     */
    onRootClick(event) {
      if (event.composedPath().includes(this.shadowRoot)) return;
      event.stopImmediatePropagation();
      if (this._control !== this) {
        this._control.click();
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('click', this.onRootClick, { capture: true });
      // control.addEventListener('invalid', this.onControlInvalid);
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

  // disabled from State component
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
