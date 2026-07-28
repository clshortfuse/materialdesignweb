/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import { CHROME_VERSION } from '../core/dom.js';

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

const FORM_IPC_EVENT = 'mdw-form-associated-changed';

const DOMString = { nullParser: String, value: '' };

/**
 * Implements form-associated element behavior (internals, validity, files, value handling).
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function FormAssociatedMixin(Base) {
  return Base
    .setStatic({
      formAssociated: true,
    })
    .set({
      /** @type {EventListener} */
      _ipcListener: null,
      /** @type {EventTarget} */
      _ipcTarget: null,
      /** @type {FileList} */
      _files: null,
      /** Last message supplied through setCustomValidity(). */
      _customValidityMessage: '',
    })
    .observe({
      /** ARIA 'controls' attribute (string). */
      ariaControls: 'string',
      /** Autocomplete token for the associated control (string). */
      autocomplete: DOMString,
      /** Name attribute for the control used in forms. */
      name: DOMString,
      /** Read-only state reflected to control via 'readonly' attribute. */
      readOnly: { attr: 'readonly', type: 'boolean' },
      /** When true, form validation is skipped for this control (formnovalidate). */
      formNoValidate: { attr: 'formnovalidate', type: 'boolean' },
      /** Default checked state for checkable controls (checkbox/radio). */
      defaultChecked: { attr: 'checked', type: 'boolean' },
      _checkedDirty: 'boolean',
      /* "Checkedness" */
      _checked: 'boolean',
      /** Whether the control is required for form submission. */
      required: 'boolean',
      /** Control type token (e.g. 'text','checkbox','radio','file'). */
      type: DOMString,
      //  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
      /** Reflected default value backing field (attr: value). */
      _defaultValue: { reflect: true, attr: 'value' },
      /** Internal value storage. */
      _value: { empty: '' },
      _valueDirty: 'boolean',
      /** Whether the user has interacted with the control (used for validation UX). */
      _userInteracted: 'boolean',
      _invalid: 'boolean',
      _badInput: 'boolean',
      _validationMessage: 'string',
      _formDisabled: 'boolean',
      _formReset: 'boolean',
    })
    .observe({
      erroredState({ _invalid, _userInteracted }) { return _userInteracted && _invalid; },
      defaultValue: {
        reflect: false,
        get({ _defaultValue }) {
          return _defaultValue ?? '';
        },
        set(value) {
          this._defaultValue = String(value);
        },
      },
      _valueBehavior({ type }) {
        switch (type) {
          case 'radio':
          case 'checkbox':
            return 'default/on';
          case 'hidden':
          case 'button':
          case 'submit':
          case 'image':
          case 'reset':
            return 'default';
          case 'file': return 'filename';
          default: return 'value';
        }
      },
    })
    .methods({
      /**
       * Default behavior should likely be overridden
       * @param {string} value
       */
      _onSetValue(value) {
        this._value = value;
      },
      /**
       * Default behavior should likely be overridden
       * @param {boolean} checked
       */
      _onSetChecked(checked) {
        this._checked = checked;
      },
    })
    .observe({
      value: {
        reflect: false,
        get({ _valueBehavior, _defaultValue, _value }) {
          switch (_valueBehavior) {
            case 'filename':
            default:
              return _value;
            case 'default':
              return _defaultValue ?? '';
            case 'default/on':
              return _defaultValue ?? 'on';
          }
        },
        /** @param {string} v */
        set(v) {
          switch (this._valueBehavior) {
            case 'value':
              this._valueDirty = true;
              this._onSetValue(v);
              break;
            case 'filename':
              if (v == null || v === '') {
                this._files = null;
                // Presume overriding class will interpet null as empty
              } else {
                throw new DOMException('InvalidStateError');
              }
              break;
            default:
              this.defaultValue = v;
          }
        },
      },
      /**
       * Part of FormAssociatedMixin for simplicity.
       * Enumerability doesn't guarantee checked state will be passed or used.
       */
      checked: {
        reflect: false,
        type: 'boolean',
        get({ _checkedDirty, defaultChecked, _checked }) {
          if (_checkedDirty) return _checked;
          return defaultChecked;
        },
        /** @param {boolean} checked */
        set(checked) {
          this._checkedDirty = true;
          this._onSetChecked(checked);
        },
      },
    })
    .define({
      form() { return this.elementInternals.form; },
      validity() { return this.elementInternals.validity; },
      validationMessage() { return this.elementInternals.validationMessage; },
      willValidate() {
        if (this.type === 'submit') return !this.formNoValidate;
        if (this.type === 'button' || this.type === 'reset') return false;
        return this.elementInternals.willValidate;
      },
      labels() { return this.elementInternals.labels; },
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

      /** Refreshes validity flags owned by this generic form control. */
      _updateFormValidity() {
        const message = this._customValidityMessage;
        this.elementInternals.setValidity(
          { customError: !!message },
          message,
        );
        this._invalid = !!message;
        this._validationMessage = message;
      },

      /**
       * @param {string} error
       * @return {void}
       */
      setCustomValidity(error) {
        this._customValidityMessage = String(error);
        this._updateFormValidity();
      },

      /**
       * @param {string} key
       * @return {void}
       */
      _notifyRadioChange(key) {
        this._ipcTarget?.dispatchEvent(
          new CustomEvent(FORM_IPC_EVENT, { detail: [key, this] }),
        );
      },

      /** @return {boolean} */
      _isRadioSelected() {
        return this.checked;
      },

      refreshFormAssociation() {
        const newTarget = this.type === 'radio' && this.isConnected
          ? this.elementInternals.form ?? this.getRootNode()
          : null;
        if (newTarget === this._ipcTarget) {
          return;
        }
        this._ipcTarget?.removeEventListener(FORM_IPC_EVENT, this._ipcListener);
        this._ipcTarget = newTarget;
        if (!newTarget) return;

        this._ipcListener ??= this.formIPCEvent.bind(this);
        newTarget.addEventListener(FORM_IPC_EVENT, this._ipcListener);
        if (this._isRadioSelected()) {
          this._notifyRadioChange(this.name);
        }
      },

      /**
       * New lifecycle callback. This is called when association with
       * <form> is changed.
       * @param {HTMLFormElement?} form
       * @return {void}
       */
      formAssociatedCallback(form) {
        void form;
        this.refreshFormAssociation();
        this.checkValidity();
      },

      /**
       * @param {CustomEvent<[string, EventTarget]>} event
       * @return {void}
       */
      formIPCEvent(event) {
        if ((event.target instanceof HTMLFormElement && event.target !== this.form)
          || this.type !== 'radio') return;
        const [name, source] = event.detail;
        if (!name || this.name !== name || source === this) return;
        this.checked = false;
      },

      /** @param {boolean} disabled */
      formDisabledCallback(disabled) {
        this._formDisabled = disabled;
      },

      formResetCallback() {
        this._formReset = true; // Fires Change Event
        this._valueDirty = false;
        this.checkValidity();
        this._userInteracted = false; // Reset error states
        this._formReset = false;
      },

      /**
       * @param {string|FormData} state
       * @param {'autocomplete'|'restore'} mode
       */
      formStateRestoreCallback(state, mode) {
        void mode;
        if (CHROME_VERSION < 115) {
          // formStateRestoreCallback is broken on Chromium
          // https://bugs.chromium.org/p/chromium/issues/detail?id=1429585
          return;
        }
        if (typeof state !== 'string') {
          console.warn('FormAssociatedMixin: (Restore) Could not restore', state);
          return;
        }
        if (this.type === 'checkbox' || this.type === 'radio') {
          this.checked = (state === 'checked');
          return;
        }
        this.value = state;
      },

      _updateFormAssociatedValue() {
        switch (this.type) {
          case 'radio':
            if (this.checked) {
              this._notifyRadioChange(this.name);
            }
            // Fallthrough
          case 'checkbox':
            if (this.checked) {
              // console.debug('FormAssociatedMixin: setFormValue', this.name, `(${this.value}, 'checked')`, this);
              this.elementInternals.setFormValue(this.value, 'checked');
            } else {
              // console.debug('FormAssociatedMixin: setFormValue', this.name, "(null, 'unchecked')", this);
              this.elementInternals.setFormValue(null, 'unchecked');
            }
            break;
          case 'button':
          case 'reset':
            this.elementInternals.setFormValue(null);
            break;
          case 'file': {
            const { elementInternals, _files, name } = this;
            if (!_files || !_files.length) {
              elementInternals.setFormValue(null);
            } else {
              const fd = new FormData();
              for (const entry of _files) {
                fd.append(name, entry);
              }
              elementInternals.setFormValue(fd);
            }
            break;
          }
          case 'select-multiple': {
            const formData = new FormData();
            // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
            const selectElement = /** @type {HTMLSelectElement} */ (/** @type {unknown} */ (this));
            if (selectElement.name) {
              for (const option of selectElement.selectedOptions) {
                formData.append(selectElement.name, option.value);
              }
            }
            this.elementInternals.setFormValue(formData);
            break;
          }
          // case 'select-one':
          default:
            // console.debug('FormAssociatedMixin: setFormValue', this.name, this.value, this);
            this.elementInternals.setFormValue(this.value);
        }
      },
    })
    .events({
      blur() {
        this._userInteracted = true;
        this.checkValidity();
      },
    })
    .on({
      connected() {
        // Bind to global if no form is present (used by radio)
        this.refreshFormAssociation();
      },
      disconnected() {
        this._ipcTarget?.removeEventListener(FORM_IPC_EVENT, this._ipcListener);
        this._ipcTarget = null;
      },
      checkedChanged() {
        this._updateFormAssociatedValue();
      },
      valueChanged() {
        this._updateFormAssociatedValue();
      },
      _valueBehaviorChanged(previous, current) {
        if (previous !== 'filename' && current === 'filename') {
          this.value = '';
        }
      },
      typeChanged() {
        this._updateFormAssociatedValue();
        this.refreshFormAssociation();
      },
    });
}
