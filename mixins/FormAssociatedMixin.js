/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

const DOMString = { nullParser: String };

const FORM_IPC_EVENT = 'mdw-form-associated-changed';
const GlobalListener = new EventTarget();

/**
 * @template {typeof import('../core/CustomElement.js').default} T
 * @param {T} Base
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
      _disabled: {
        type: 'boolean',
        reflect: true,
        attr: 'disabled',
      },
      _formDisabled: 'boolean',
    })
    .observe({
      disabled: {
        reflect: false,
        type: 'boolean',
        get({ _formDisabled, _disabled }) {
          if (_formDisabled) return true;
          return _disabled;
        },
        /**
         * @param {boolean} value
         */
        set(value) {
          this._disabled = value;
        },
      },
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
    .on({
      constructed() {
        if (!this.hasAttribute('tabindex')) {
          this.tabIndex = 0;
        }
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
        const newTarget = this.elementInternals.form ?? GlobalListener;
        if (newTarget === this._ipcTarget) {
          console.warn('Already associated?', newTarget);
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
        console.log('formAssociatedCallback', this, form);
        this.refreshFormAssociation();
      },

      /**
       * @param {CustomEvent<[string, string]>} event
       * @return {void}
       */

      formIPCEvent(event) {
        // virtual
      },

      // New lifecycle callback. This is called when ‘disabled’ attribute of
      // this element or an ancestor <fieldset> is updated.
      formDisabledCallback(disabled) {
        this._formDisabled = disabled;
      },

      formResetCallback() {
        this._valueDirty = false;
        this.checkValidity();
      },

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
      },
    })
    .events({
      blur() { this.checkValidity(); },
    });
}
