import ControlMixin from './ControlMixin.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

const IMPLICIT_SUBMISSION_BLOCKING_TYPES = new Set([
  'text',
  'search',
  'url',
  'tel',
  'email',
  'password',
  'date',
  'month',
  'week',
  'time',
  'datetime-local',
  'number',
]);

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function InputMixin(Base) {
  class Input extends ControlMixin(Base) {
    static inputTagName = 'input';

    static FORM_IPC_EVENT = 'mdw-input-changed';

    static GlobalListener = new EventTarget();

    static clonedContentAttributes = [
      ...super.clonedContentAttributes,
      'aria-controls',
      'accept', 'alt',
      // 'autocomplete',
      'checked', 'dirname',
      // 'disabled',
      // 'form',
      'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formTarget',
      'height',
      // 'list',
      'max', 'maxlength', 'min', 'minlength',
      'multiple',
      // 'name',
      'pattern', 'placeholder',
      // 'readonly',
      // 'required',
      'size', 'src', 'step',
      // 'type',
      'value',
      'width',
    // 'align', 'usemap',
    ];

    static valueChangingContentAttributes = [
      ...super.valueChangingContentAttributes,
      'checked', 'max', 'maxlength', 'min', 'maxlength',
      'multiple', 'pattern', 'step', 'type', 'value',
    ];

    /** @type {InstanceType<typeof CustomElement>['propChangedCallback']} */
    propChangedCallback(name, oldValue, newValue) {
      super.propChangedCallback(name, oldValue, newValue);
      switch (name) {
        case 'indeterminate':
          this.#input.indeterminate = newValue;
          break;
        case 'type':
          this.#input.type = newValue;
          break;
        case '_formAction':
          this.formAction = newValue;
          break;
        case '_height':
          this.height = newValue;
          break;
        case '_width':
          this.width = newValue;
          break;
        case 'checked':
          if (!this.type) {
            console.warn('unknown type?', this);
          }
          switch (this.type) {
            case 'checkbox':
            case 'radio':
              if (newValue) {
                this.elementInternals.setFormValue(this.value ?? 'on');
                this._notifyRadioChange(this.name, this.value ?? 'on');
              } else {
                this.elementInternals.setFormValue(null);
              }
              break;
            default:
          }
          // Reinvoke change event for components tracking 'checked';
          // this.propChangedCallback('checked', oldValue, newValue);
          break;
        default:
      }
    }

    /** @type {CustomElement['attributeChangedCallback']} */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      switch (name) {
        case 'aria-label':
          if (newValue == null) {
            this.#input.removeAttribute(name);
            if (!this.hasAttribute('aria-labelledby')) {
              this.#input.setAttribute('aria-labelledby', 'slot');
            }
          } else {
            this.#input.setAttribute(name, newValue);
            if (!this.hasAttribute('aria-labelledby')) {
              this.#input.removeAttribute('aria-labelledby');
            }
          }
          break;
        default:
      }
    }

    get #input() { return /** @type {HTMLInputElement} */ (this.refs.control); }

    static {
      this.on({
        composed({ $ }) {
          const label = $('#label');
          // Expose [selected] to .checked
          label.setAttribute('selected', '{checked}');
          label.setAttribute('invalid', '{_invalid}');
          label.setAttribute('indeterminate', '{indeterminate}');
        },
      });
      this.events('#control', {
        /**
         * @param {Event & {currentTarget: HTMLInputElement}} event
         * @type {any}
         */
        '~click'(event) {
          const input = event.currentTarget;
          if (event.defaultPrevented) return;
          if (input.type !== 'radio') return;
          if (input.required) return;

          if (this.checked) {
            this.checked = false;
            // event.preventDefault();
          }
        },
        keydown(event) {
          if (event.defaultPrevented) return;
          const input = /** @type {HTMLInputElement} */ (event.currentTarget);
          if (event.key === 'Enter') {
            if (input.type === 'submit') return;
            this.performImplicitSubmission(event);
            return;
          }
          if (input.type !== 'radio') return;
          if (event.key === 'Spacebar' || event.key === ' ') {
            if (input.required) return;

            if (this.checked) {
              this.checked = false;
              event.preventDefault();
            }
          }
        },
        change(event) {
          if (this.hasAttribute('disabled')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          const input = /** @type {HTMLInputElement} */ (event.currentTarget);
          this.checked = input.checked;
        },
      });
    }

    /**
     * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission
     * @param {Event} event
     * @return {void}
     */
    performImplicitSubmission(event) {
      const form = this.form;
      if (!form) return;
      /** @type {HTMLInputElement} */
      let defaultButton;
      const submissionBlockers = new Set();
      for (const element of /** @type {HTMLCollectionOf<HTMLInputElement>} */ (form.elements)) {
        // Spec doesn't specify disabled, but browsers do skip them.
        if (element.type === 'submit' && !element.disabled) {
          defaultButton ??= element;
          break;
        }

        if (IMPLICIT_SUBMISSION_BLOCKING_TYPES.has(element.type)) {
          submissionBlockers.add(element);
        }
      }
      if (defaultButton) {
        defaultButton.click();
        return;
      }
      if (submissionBlockers.size > 1) return;
      this.form.submit();
    }

    /** @param {CustomEvent<[string, string]>} event */
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
        this.checked = false;
      }
    }

    formResetCallback() {
      this.#input.value = this.defaultValue;
      this.#input.checked = this.checked;
      this._value = this.#input.value;
      this._checked = this.#input.checked;
      this._checkedDirty = false;

      super.formResetCallback();
    }

    get files() { return this.#input.files; }

    get select() { return this.#input.select; }

    get selectionDirection() { return this.#input.selectionDirection; }

    set selectionDirection(value) { this.#input.selectionDirection = value; }

    get selectionEnd() { return this.#input.selectionEnd; }

    set selectionEnd(value) { this.#input.selectionEnd = value; }

    get selectionStart() { return this.#input.selectionStart; }

    set selectionStart(value) { this.#input.selectionStart = value; }

    get setRangeText() { return this.#input.setRangeText; }

    get setSelectionRange() { return this.#input.setSelectionRange; }

    get showPicker() { return this.#input.showPicker; }

    get stepDown() { return this.#input.stepDown; }

    get stepUp() { return this.#input.stepUp; }

    get valueAsDate() { return this.#input.valueAsDate; }

    set valueAsDate(value) {
      this.#input.valueAsDate = value;
      this.value = this.#input.value;
    }

    get valueAsNumber() { return this.#input.valueAsNumber; }

    set valueAsNumber(value) {
      this.#input.valueAsNumber = value;
      this.value = this.#input.value;
    }

    get height() { return this.#input.height; }

    set height(value) {
      this.#input.height = value;
      this._height = value;
    }

    get formAction() { return this.#input.formAction; }

    set formAction(value) {
      this.#input.formAction = value;
      this._formAction = value;
    }

    get width() { return this.#input.width; }

    set width(value) {
      this.#input.width = value;
      this._width = value;
    }
  }

  Input.prototype.ariaControls = Input.prop('ariaControls');

  // https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

  const DOMString = { nullParser: String, value: '' };

  Input.prototype.accept = Input.prop('accept', DOMString);
  Input.prototype.alt = Input.prop('alt', DOMString);
  Input.prototype.defaultChecked = Input.prop('defaultChecked', { attr: 'checked', type: 'boolean' });
  Input.prototype._checkedDirty = Input.prop('_checkedDirty', 'boolean');
  //  attribute boolean checked;
  Input.prototype._checked = Input.prop('_checked', 'boolean');

  // Exposed property based other watched properties
  Input.prototype.checked = Input.prop('checked', {
    reflect: false,
    type: 'boolean',
    get({ _checkedDirty, defaultChecked, _checked }) {
      if (!_checkedDirty) return defaultChecked;
      return _checked;
    },
    set(value) {
      this._checked = value;
      this._checkedDirty = true;
    },
    changedCallback(oldValue, newValue) {
      this.shadowRoot.getElementById('control').checked = newValue;
    },
  });

  Input.prototype.dirName = Input.prop('dirName', { attr: 'dirname', ...DOMString });
  Input.prototype._formAction = Input.prop('_formAction', { attr: 'formaction' });
  Input.prototype.formEnctype = Input.prop('formEnctype', { attr: 'formenctype', ...DOMString });
  Input.prototype.formMethod = Input.prop('formMethod', { attr: 'formmethod', ...DOMString });
  Input.prototype.formNoValidate = Input.prop('formnovalidate', { attr: 'formNoValidate', type: 'boolean' });
  Input.prototype.formTarget = Input.prop('formTarget', { attr: 'formtarget', ...DOMString });
  Input.prototype._height = Input.prop('_height', { attr: 'height', type: 'integer' });
  Input.prototype.indeterminate = Input.prop('indeterminate', { type: 'boolean', reflect: false });
  Input.prototype.max = Input.prop('max', DOMString);
  Input.prototype.maxLength = Input.prop('maxLength', { attr: 'maxlength', type: 'integer', empty: -1 });
  Input.prototype.min = Input.prop('min', DOMString);
  Input.prototype.minLength = Input.prop('minLength', { attr: 'minlength', type: 'integer', empty: -1 });
  Input.prototype.multiple = Input.prop('multiple', 'boolean');
  Input.prototype.pattern = Input.prop('pattern', DOMString);
  Input.prototype.placeholder = Input.prop('placeholder', DOMString);
  Input.prototype.size = Input.prop('size', { type: 'integer', empty: 20 });
  Input.prototype.src = Input.prop('src', DOMString);
  Input.prototype.step = Input.prop('step', DOMString);
  Input.prototype.type = Input.prop('type', DOMString);
  Input.prototype.defaultValue = Input.prop('defaultValue', { attr: 'value', ...DOMString });
  //  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
  Input.prototype._width = Input.prop('_width', { attr: 'width', type: 'integer' });

  return Input;
}
