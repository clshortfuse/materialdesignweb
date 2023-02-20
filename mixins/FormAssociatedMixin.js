/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

const DOMString = { nullParser: String };

const FORM_IPC_EVENT = 'mdw-form-associated-changed';

/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function FormAssociatedMixin(Base) {
  return Base
    .extend()
    .setStatic({
      formAssociated: true,
    })
    .set({
      _valueDirty: false,
      /** @type {EventListener} */
      _ipcListener: null,
      /** @type {EventTarget} */
      _ipcTarget: null,
    })
    .observe({
      ariaControls: 'string',
      autocomplete: DOMString,
      name: DOMString,
      readOnly: { attr: 'readonly', type: 'boolean' },
      required: 'boolean',
      type: DOMString,
      //  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
      _value: {
        empty: '',
        /**
         * @param {string} oldValue
         * @param {string} newValue
         */
        changedCallback(oldValue, newValue) {
          this.propChangedCallback('value', oldValue, newValue);
        },
      },
      _invalid: 'boolean',
      _badInput: 'boolean',
      _validationMessage: 'string',
      _formDisabled: {
        type: 'boolean',
        reflect: true,
        attr: 'disabled2',
      },
    })
    .observe({
      erroredState({ _invalid }) { return _invalid; },
    })
    .define({
      form() { return this.elementInternals.form; },
      validity() { return this.elementInternals.validity; },
      validationMessage() { return this.elementInternals.validationMessage; },
      willValidate() { return this.elementInternals.willValidate; },
      labels() { return this.elementInternals.labels; },
      value: {
        get() {
          return this._value;
        },
        /** @param {string} v */
        set(v) {
          this._valueDirty = true;
          this._value = v;
        },
      },
    })
    .observe({
      disabledState({ _formDisabled, disabled }) {
        if (_formDisabled) return true;
        return !!disabled;
      },
    })
    .methods({
      checkValidity() { return this.elementInternals.checkValidity(); },

      reportValidity() { return this.elementInternals.reportValidity(); },

      /**
       * @param {string} error
       * @return {void}
       */
      setCustomValidity(error) {
        this.elementInternals.setValidity({
          ...this.elementInternals.validity,
          customError: !!error,
        }, this.elementInternals.validationMessage || error);
      },

      /**
       * @param {string} key
       * @param {string} value
       * @return {void}
       */
      _notifyRadioChange(key, value) {
        this._ipcTarget?.dispatchEvent(
          new CustomEvent(FORM_IPC_EVENT, { detail: [key, value] }),
        );
      },

      refreshFormAssociation() {
        const newTarget = this.elementInternals.form ?? this.getRootNode();
        if (newTarget === this._ipcTarget) {
          // console.warn('Already associated?', newTarget);
          return;
        }
        if (this._ipcTarget) {
          this._ipcTarget.removeEventListener(FORM_IPC_EVENT, this._ipcListener);
        }
        if (this.type !== 'radio') return;

        this._ipcTarget = newTarget;
        this._ipcListener ??= this.formIPCEvent.bind(this);
        this._ipcTarget.addEventListener(FORM_IPC_EVENT, this._ipcListener);
      },

      /**
       * New lifecycle callback. This is called when association with
       * <form> is changed.
       * @param {HTMLFormElement?} form
       * @return {void}
       */
      formAssociatedCallback(form) {
        this.refreshFormAssociation();
      },

      /**
       * @param {CustomEvent<[string, string]>} event
       * @return {void}
       */

      formIPCEvent(event) {
        console.warn('Virtual formIPCEvent invoked.');
        // virtual
      },

      /** @param {boolean} disabled */
      formDisabledCallback(disabled) {
        this._formDisabled = disabled;
      },

      formResetCallback() {
        this._valueDirty = false;
        this.checkValidity();
      },

      /**
       * @param {string|FormData} state
       * @param {'autocomplete'|'restore'} mode
       */
      formStateRestoreCallback(state, mode) {
        if (typeof state === 'string') {
          this.value = state;
        } else {
          console.warn('Could not restore', state);
        }
      },
    })
    .events({
      blur() { this.checkValidity(); },
    })
    .on({
      constructed() {
        if (!this.hasAttribute('tabindex')) {
          this.tabIndex = 0;
        }
      },
      connected() {
        // Bind to global if no form is present (used by radio)
        this.refreshFormAssociation();
      },
    });
}
