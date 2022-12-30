/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

const DOMString = { nullParser: String };

const FORM_IPC_EVENT = 'mdw-form-associated-changed';
const GlobalListener = new EventTarget();

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function FormAssociatedMixin(Base) {
  return Base
    .extend()
    .setStatic({
      formAssociated: true,
    })
    .set({
      _dirtyValue: false,
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
      _value: { empty: '' },
      _invalid: { attr: 'invalid', type: 'boolean' },
      _badInput: 'boolean',
      _validationMessage: 'string',
    })
    .define({
      dirtyValue() { return this._dirtyValue; },
      form() { return this.elementInternals.form; },
      value: {
        get() {
          return this._value;
        },
        /** @param {string} v */
        set(v) {
          this._dirtyValue = true;
          this._value = v;
        },
      },
      validity() { return this.elementInternals.validity; },
      validationMessage() { return this.elementInternals.validationMessage; },
      willValidate() { return this.elementInternals.willValidate; },
      labels() { return this.elementInternals.labels; },
    })
    .on('constructed', ({ element }) => {
      if (!element.hasAttribute('tabindex')) {
        element.tabIndex = 0;
      }
    })
    .on('_valueChanged', (oldValue, newValue, element) => {
      element.propChangedCallback('value', oldValue, newValue);
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
      // console.log('formDisabledCallback', disabled, this);
      // TODO: Always disabled regardless of form disabled state
      // this.disabled = disabled;
      },

      formResetCallback() {
        this._dirtyValue = false;
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
