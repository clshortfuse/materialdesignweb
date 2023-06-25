import { cloneAttributeCallback } from '../core/CustomElement.js';

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

const DOMString = { nullParser: String, empty: '' };

/**
 * @see https://html.spec.whatwg.org/multipage/input.html#htmlinputelement
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function InputMixin(Base) {
  return Base
    .mixin(ControlMixin)
    .observe({
      accept: DOMString,
      alt: DOMString,
      dirName: { attr: 'dirname', ...DOMString },
      _formAction: { attr: 'formaction' },
      formEnctype: { attr: 'formenctype', ...DOMString },
      formMethod: { attr: 'formmethod', ...DOMString },
      formNoValidate: { attr: 'formNoValidate', type: 'boolean' },
      formTarget: { attr: 'formtarget', ...DOMString },
      _height: { attr: 'height', type: 'integer' },
      indeterminate: { type: 'boolean', reflect: false },
      max: DOMString,
      maxLength: { attr: 'maxlength', type: 'integer', empty: -1 },
      min: DOMString,
      minLength: { attr: 'minlength', type: 'integer', empty: -1 },
      multiple: 'boolean',
      pattern: DOMString,
      placeholder: DOMString,
      size: { type: 'integer', empty: 20 },
      src: DOMString,
      step: DOMString,
      //  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
      _width: { attr: 'width', type: 'integer' },
    })
    .define({
      // Alias for typescript
      _input() { return /** @type {HTMLInputElement} */ (this.refs.control); },
    })
    .overrides({
      controlTagName: 'input',
    })
    .on({
      composed() {
        const { control } = this.refs;
        control.setAttribute('checked', '{defaultChecked}');
        control.setAttribute('height', '{_height}');
        control.setAttribute('width', '{_width}');
        control.setAttribute('value', '{_defaultValue}');
      },

      // TODO: Bind multiple
      typeChanged() { this.onValueChangingContentAttribute(); },
      defaultCheckedChanged() {
        this._checked = this._input.checked;
      },
      minChanged() { this.onValueChangingContentAttribute(); },
      minLengthChanged() { this.onValueChangingContentAttribute(); },
      maxChanged() { this.onValueChangingContentAttribute(); },
      maxLengthChanged() { this.onValueChangingContentAttribute(); },
      multipleChanged() { this.onValueChangingContentAttribute(); },
      patternChanged() { this.onValueChangingContentAttribute(); },
      stepChanged() { this.onValueChangingContentAttribute(); },
      defaultValueChanged() { this.onValueChangingContentAttribute(); },
      _formResetChanged(oldValue, newValue) {
        if (!newValue) return;
        console.log('form reset');
        const input = this._input;
        input.value = this.defaultValue;
        input.checked = this.defaultChecked;
        this._value = input.value;
        this._checked = input.checked;
        this._checkedDirty = false;
      },
      attrs: {
        accept: cloneAttributeCallback('accept', 'control'),
        alt: cloneAttributeCallback('alt', 'control'),
        dirname: cloneAttributeCallback('dirname', 'control'),
        formenctype: cloneAttributeCallback('formenctype', 'control'),
        formmethod: cloneAttributeCallback('formmethod', 'control'),
        formnovalidate: cloneAttributeCallback('formnovalidate', 'control'),
        formTarget: cloneAttributeCallback('formTarget', 'control'),
        max: cloneAttributeCallback('max', 'control'),
        maxlength: cloneAttributeCallback('maxlength', 'control'),
        min: cloneAttributeCallback('min', 'control'),
        minlength: cloneAttributeCallback('minlength', 'control'),
        multiple: cloneAttributeCallback('multiple', 'control'),
        pattern: cloneAttributeCallback('pattern', 'control'),
        placeholder: cloneAttributeCallback('placeholder', 'control'),
        size: cloneAttributeCallback('size', 'control'),
        src: cloneAttributeCallback('src', 'control'),
        step: cloneAttributeCallback('step', 'control'),
      },
    })
    .overrides({
      _onSetChecked(checked) {
        // Apply user value to input and read back result to apply control to parse
        this._input.checked = checked;
        this._checked = this._input.checked;
      },
      _onSetValue(value) {
        // Apply user value to input and read back result to apply control to parse
        this._input.value = value;
        this._value = this._input.value;
      },
    })
    .methods({
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
          if (element.type === 'submit' && !element.disabled && !element.matches(':disabled')) {
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
      },

    })
    .childEvents({
      control: {
        keydown(event) {
          if (event.defaultPrevented) return;
          if (event.key !== 'Enter') return;
          if (/** @type {HTMLInputElement} */ (event.currentTarget).type === 'submit') return;
          this.performImplicitSubmission(event);
        },
        input(event) {
          if (this.disabledState) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          const input = /** @type {HTMLInputElement} */ (event.currentTarget);
          this._checkedDirty = true;
          this._checked = input.checked;
        },
        change(event) {
          if (this.disabledState) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          const input = /** @type {HTMLInputElement} */ (event.currentTarget);
          this._checkedDirty = true;
          this._checked = input.checked;
        },
      },
    })
    .define({
      files() { return this._input.files; },

      select() { return this._input.select; },

      selectionDirection: {
        get() { return this._input.selectionDirection; },
        set(value) { this._input.selectionDirection = value; },
      },

      selectionEnd: {
        get() { return this._input.selectionEnd; },
        set(value) { this._input.selectionEnd = value; },
      },

      selectionStart: {
        get() { return this._input.selectionStart; },
        set(value) { this._input.selectionStart = value; },
      },

      setRangeText() { return this._input.setRangeText; },

      setSelectionRange() { return this._input.setSelectionRange; },

      showPicker() { return this._input.showPicker; },

      stepDown() { return this._input.stepDown; },

      stepUp() { return this._input.stepUp; },

      valueAsDate: {
        get() { return this._input.valueAsDate; },
        set(value) {
          this._input.valueAsDate = value;
          this.value = this._input.value;
        },
      },

      valueAsNumber: {
        get() { return this._input.valueAsNumber; },
        set(value) {
          this._input.valueAsNumber = value;
          this.value = this._input.value;
        },
      },

      height: {
        get() { return this._input.height; },
        set(value) {
          this._input.height = value;
          this._height = value;
        },
      },

      formAction: {
        get() { return this._input.formAction; },
        set(value) {
          this._input.formAction = value;
          this._formAction = value;
        },
      },

      width: {
        get() { return this._input.width; },
        set(value) {
          this._input.width = value;
          this._width = value;
        },
      },
    });
}
