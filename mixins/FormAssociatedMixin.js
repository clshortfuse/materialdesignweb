/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import { CHROME_VERSION } from '../core/dom.js';

/** @typedef {HTMLElement & {value:string}} HTMLControlElement */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

const FORM_IPC_EVENT = 'mdw-form-associated-changed';

const DOMString = { nullParser: String, value: '' };

/**
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
    })
    .observe({
      ariaControls: 'string',
      autocomplete: DOMString,
      name: DOMString,
      readOnly: { attr: 'readonly', type: 'boolean' },
      formNoValidate: { attr: 'formnovalidate', type: 'boolean' },
      defaultChecked: { attr: 'checked', type: 'boolean' },
      _checkedDirty: 'boolean',
      /* "Checkedness" */
      _checked: 'boolean',
      required: 'boolean',
      type: DOMString,
      //  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
      _defaultValue: { reflect: true, attr: 'value' },
      _value: { empty: '' },
      _valueDirty: 'boolean',
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
       * Default behavior can should likely be overridden
       * @param {string} value
       */
      _onSetValue(value) {
        this._value = value;
      },
      /**
       * Default behavior can should likely be overridden
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
        this.checkValidity();
      },

      /**
       * @param {CustomEvent<[string, string]>} event
       * @return {void}
       */
      formIPCEvent(event) {
        if (event.target instanceof HTMLFormElement && event.target !== this.form) {
          console.warn('Control.formIPCEvent: Abort from wrong form');
          return;
        }
        if (this.type !== 'radio') {
          console.warn('Control.formIPCEvent: Abort from not radio');
          return;
        }
        const [name, value] = event.detail;
        if (this.name !== name) return;
        if (value === this.value) {
          // console.log('Control.formIPCEvent: Continue match', this.name, this.value);
        } else {
          console.debug('FormAssociatedMixin: Unchecking', this);
          this.checked = false;
        }
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
          console.debug('FormAssociatedMixin: (Restore) Setting Checkbox checked state.', state, this);
          this.checked = (state === 'checked');
          return;
        }
        if (this.type === 'radio') {
          // Due to lifecycle quirks, other radio elements on the page may not have
          // been upgraded to Custom Element yet and would not receive
          // the 'uncheck' communication. Delay notice until then.
          this.checked = (state === 'checked');
          return;
        }

        console.debug('FormAssociatedMixin: (Restore) Setting value state.', state, this);
        this.value = state;
      },

      _updateFormAssociatedValue() {
        switch (this.type) {
          case 'radio':
            if (this.checked) {
              this._notifyRadioChange(this.name, this.value || 'on');
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
            if (!_files || _files.length) {
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
      },
    });
}
