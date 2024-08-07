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

/** Flag redispatched click events to know not to block them */
const redispatchedClickEvents = new WeakSet();
/** Flag root click events to know not to block them */
const rootClickEvents = new WeakSet();

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
      formTarget: { attr: 'formtarget', ...DOMString },
      _height: { attr: 'height', type: 'integer' },
      _indeterminate: 'boolean',
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
    .set({
      _useFormImplicitSubmission: true,
    })
    .define({
      // Alias for typescript
      _input() { return /** @type {HTMLInputElement} */ (this.refs.control); },
    })
    .observe({
      indeterminate: {
        type: 'boolean',
        get({ _indeterminate }) {
          return _indeterminate;
        },
        /** @param {boolean} value */
        set(value) {
          this._input.indeterminate = value;
          this._indeterminate = this._input.indeterminate;
        },
      },
    })
    .overrides({
      controlTagName: 'input',
    })
    .recompose(({ refs: { control } }) => {
      control.setAttribute('checked', '{defaultChecked}');
      control.setAttribute('height', '{_height}');
      control.setAttribute('width', '{_width}');
      control.setAttribute('value', '{_defaultValue}');
    })
    .on({
      // TODO: Bind multiple
      typeChanged() { this.onValueChangingContentAttribute(); },
      checkedChanged() {
        this._input.checked = this.checked;
        this._input.indeterminate = this._indeterminate;
      },
      _indeterminateChanged(previous, current) {
        this._input.indeterminate = current;
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
        this._onSetValue(this.defaultValue);
        const input = this._input;
        input.checked = this.defaultChecked;
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
        this.indeterminate = false;
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
        if (!this._useFormImplicitSubmission) return;
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
          defaultButton.dispatchEvent(new PointerEvent(
            'click',
            { bubbles: true, cancelable: true, composed: true },
          ));
          return;
        }
        if (submissionBlockers.size > 1) return;
        this.form.submit();
      },
      /** @param {Event} event */
      _redispatchControlClickEvent(event) {
        event.stopPropagation();
        // Use constructor to match mouse/pointer properties
        /**  @type {Event} */
        // @ts-ignore skip-cast
        const newEvent = (new event.constructor(event.type, event));
        redispatchedClickEvents.add(newEvent);
        return this.dispatchEvent(newEvent);
      },
      /** @param {MouseEvent} event */
      _handleInputClick(event) {
        if (this.disabledState) return;
        const input = this._input;
        switch (input.type) {
          case 'checkbox':
          case 'radio': {
            const { _checkedDirty, _checked, _indeterminate } = this;
            this.checked = input.checked;
            // Event needs to be rethrown and preventDefault inspected
            if (this._redispatchControlClickEvent(event)) return;
            event.preventDefault();
            this._checkedDirty = _checkedDirty;
            this._checked = _checked;
            this._indeterminate = _indeterminate;
            break;
          }
          case 'button':
          case 'submit':
          case 'reset': {
            if (!this._redispatchControlClickEvent(event)) {
              event.preventDefault();
              return;
            }
            const { type } = input;
            if (type !== 'submit' && type !== 'reset') return;
            // If in the composed path is another submit/reset button,
            // Let that button take preference and ignore click.

            for (const target of event.composedPath()) {
              if (target === input || target === this) break;
              if ((target instanceof HTMLInputElement || target instanceof HTMLButtonElement)
                  && (target.type === 'submit' || target.type === 'reset')) {
                // Inner Native Button
                return;
              }
              if ((target instanceof HTMLElement && target.form instanceof HTMLFormElement
                  && (target.type === 'submit' || target.type === 'reset'))) {
                // Inner FACE Button
                return;
              }
              if ((target instanceof HTMLAnchorElement && target.href)) {
                // Inner Anchor Button
                return;
              }
            }

            const form = this.elementInternals?.form;
            if (!form) return;

            if (type === 'submit') {
              const duplicatedButton = /** @type {HTMLInputElement} */ (input.cloneNode());
              duplicatedButton.hidden = true;
              form.append(duplicatedButton);
              if ('requestSubmit' in form) {
                form.requestSubmit(duplicatedButton);
              } else {
                duplicatedButton.click();
              }
              duplicatedButton.remove();
            } else if (type === 'reset') {
              form.reset();
            }
          }
            break;
          default:
        }
      },
    })
    .rootEvents({
      click(event) {
        rootClickEvents.add(event);
        const { control } = this.refs;
        if (event.target === control) return;
        // Label-like click
        if (!event.bubbles) return;
        const { disabledState, type } = this;
        if (disabledState) return;
        if (type === 'checkbox' || type === 'radio') {
          event.stopPropagation();
          control.click();
        } else {
          this._handleInputClick(event);
        }
      },
    })
    .events({
      click(event) {
        // If click event came from own shadowRoot, let it through
        if (rootClickEvents.has(event)) return;
        // If click event is a redispatch, let it through
        if (redispatchedClickEvents.has(event)) return;
        if (event.target === this) {
          // Support custom host.dispatchEvent(new Event('click'))
          event.stopImmediatePropagation();
          this.refs.control.click();
        }
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
        click: '_handleInputClick',
        input(event) {
          if (this.disabledState) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          const input = /** @type {HTMLInputElement} */ (event.currentTarget);
          this.checked = input.checked;
        },
        change(event) {
          if (this.disabledState) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
          const input = /** @type {HTMLInputElement} */ (event.currentTarget);
          this.checked = input.checked;
        },
      },
    })
    .methods({
      /** @type {HTMLInputElement['setRangeText']} */
      // @ts-ignore Can't cast?
      setRangeText(...args) { this._input.setRangeText(...args); },

      /** @type {HTMLInputElement['setSelectionRange']} */
      setSelectionRange(...args) { this._input.setSelectionRange(...args); },

      /** @type {HTMLInputElement['showPicker']} */
      showPicker(...args) { this._input.showPicker(...args); },

      /** @type {HTMLInputElement['stepDown']} */
      stepDown(...args) {
        this._input.stepDown(...args);
        this._value = this._input.value;
      },

      /** @type {HTMLInputElement['stepUp']} */
      stepUp(...args) {
        this._input.stepUp(...args);
        this._value = this._input.value;
      },

      /** @type {HTMLInputElement['select']} */
      select(...args) {
        this._input.select(...args);
      },
    })
    .define({
      files: {
        get() { return this._input.files; },
        set(value) {
          if (value == null && this.type === 'file') {
            // TODO: Clean up single-loop recursion
            this._input.value = ''; // Clears files
            this.value = '';
          } else {
            this._input.files = value;
          }
        },
      },

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
    })
    .css`
      #control::-webkit-file-upload-button {
        display: none;
      }
    `;
}
