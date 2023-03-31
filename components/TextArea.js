import CustomElement, { cloneAttributeCallback } from '../core/CustomElement.js';
import ControlMixin from '../mixins/ControlMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

const DOMString = { nullParser: String, value: '' };

/**
 * @see https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element
 * -implements {HTMLTextAreaElement}
 */
export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(ControlMixin)
  .mixin(TextFieldMixin)
  .mixin(ResizeObserverMixin)
  .extend()
  .set({
    supportsCSSLineHeightUnit: CSS.supports('height', '1lh'),
    type: 'textarea',
  })
  .overrides({
    controlTagName: 'textarea',
    controlVoidElement: false,
  })
  .observe({
    fixed: { type: 'boolean' },
    minRows: { attr: 'minrows', type: 'integer', nullable: false },
    maxRows: { attr: 'maxrows', type: 'integer', nullable: false },
    _lineHeight: 'string',
    cols: { type: 'integer', empty: 0 },
    dirName: { attr: 'dirname', ...DOMString },
    maxLength: { attr: 'maxlength', type: 'integer', empty: 0 },
    minLength: { attr: 'minlength', type: 'integer', empty: 0 },
    placeholder: DOMString,
    rows: { type: 'integer', empty: 1 },
    wrap: DOMString,
    // Not in spec, but plays nice with HTML linters
    defaultValueAttr: { attr: 'value', ...DOMString },
  })
  .define({
    _textarea() { return /** @type {HTMLTextAreaElement} */ (this.refs.control); },
  })
  .define({
    defaultValue: {
      get() { return this._textarea.defaultValue; },
      set(value) {
        const previousValue = this._textarea.defaultValue;
        this._textarea.defaultValue = value;
        const newValue = this._textarea.defaultValue;
        if (previousValue !== newValue) {
          this.propChangedCallback('defaultValue', previousValue, newValue);
        }
        this.textContent = this._textarea.defaultValue;
      },
    },
    textLength() { return this._textarea.textLength; },
    select() { return this._textarea.select; },

    selectionDirection: {
      get() { return this._textarea.selectionDirection; },
      set(value) { this._textarea.selectionDirection = value; },
    },

    selectionStart: {
      get() { return this._textarea.selectionStart; },
      set(value) { this._textarea.selectionStart = value; },
    },

    selectionEnd: {
      get() { return this._textarea.selectionEnd; },
      set(value) { this._textarea.selectionEnd = value; },
    },

    setRangeText() { return this._textarea.setRangeText; },

    setSelectionRange() { return this._textarea.setSelectionRange; },

  })
  .methods({

    /** @return {number} */
    resize() {
      const textarea = this._textarea;
      textarea.style.removeProperty('height');

      // if (this.placeholder) textarea.removeAttribute('placeholder');

      if (!this.supportsCSSLineHeightUnit) {
        const { lineHeight } = window.getComputedStyle(textarea);
        this._lineHeight = lineHeight;
      }

      if (this.minRows > 1 && textarea.rows < this.minRows) {
        textarea.rows = this.minRows;
      } else if (this.maxRows && textarea.rows > this.maxRows) {
        textarea.rows = this.maxRows;
      }
      if (!this.fixed) {
        while (textarea.scrollHeight > textarea.clientHeight) {
          if (this.maxRows && textarea.rows === this.maxRows) break;
          const lastClientHeight = textarea.clientHeight;
          textarea.rows++;
          if (lastClientHeight === textarea.clientHeight) {
            textarea.rows--;
            break;
          }
        }
        while (textarea.scrollHeight === textarea.clientHeight) {
          if (textarea.rows === 1) break;
          if (this.minRows > 1 && textarea.rows === this.minRows) break;
          const lastClientHeight = textarea.clientHeight;
          textarea.rows--;
          if ((lastClientHeight === textarea.clientHeight)
        || (textarea.scrollHeight > textarea.clientHeight)) {
            textarea.rows++;
            break;
          }
        }
      }

      if (textarea.selectionEnd === textarea.value.length) {
        textarea.scrollTop = textarea.scrollHeight;
      }

      this.rows = textarea.rows;
      // if (this.placeholder) textarea.setAttribute('placeholder', this.placeholder);
      return this.rows;
    },

    /** @param {ResizeObserverEntry} entry */
    onResizeObserved(entry) {
      if (this.matches(':active')) return;
      this.resize();
    },
  })
  .childEvents({
    slot: {
      /**
       * @param {Event & {currentTarget:HTMLSlotElement}} event
       * @return {void}
       */
      slotchange({ currentTarget }) {
        const textarea = /** @type {HTMLTextAreaElement} */ (this.refs.control);
        const previousValue = textarea.defaultValue;
        textarea.replaceChildren(
          ...currentTarget.assignedNodes().map((child) => child.cloneNode(true)),
        );

        const newValue = textarea.defaultValue;
        if (previousValue !== newValue) {
          this.propChangedCallback('defaultValue', previousValue, newValue);
        }
      },
    },
    control: {
      input() {
        this.resize();
      },
    },
  })
  .on({
    composed() {
      const { control } = this.refs;
      // Spec
      control.removeAttribute('placeholder');
      control.setAttribute('rows', '{rows}');

      // Custom
      control.setAttribute('input-prefix', '{inputPrefix}');
      control.setAttribute('input-suffix', '{inputSuffix}');
      control.setAttribute('fixed', '{fixed}');
      control.setAttribute('icon', '{icon}');
    },
    defaultValueAttrChanged(oldValue, newValue) {
      this.defaultValue = newValue;
    },
    defaultValueChanged() {
      this._value = this._textarea.value;
      this.resize();
    },
    _lineHeightChanged(oldValue, newValue) {
      this.refs.label.style.setProperty('--line-height', newValue);
    },
    minRowsChanged(oldValue, newValue) {
      this.refs.label.style.setProperty('--min-rows', `${newValue || 'none'}`);
      this.resize();
    },
    maxRowsChanged(oldValue, newValue) {
      this.refs.label.style.setProperty('--max-rows', `${newValue || 'none'}`);
      this.resize();
    },
    rowsChanged() {
      this.resize();
    },
    _formResetChanged(oldValue, newValue) {
      if (!newValue) return;
      this._textarea.value = this.defaultValue;
      this._value = this._textarea.value;
    },
    attrs: {
      cols: cloneAttributeCallback('cols', 'control'),
      dirname: cloneAttributeCallback('dirname', 'control'),
      minlength: cloneAttributeCallback('minlength', 'control'),
      maxlength: cloneAttributeCallback('maxlength', 'control'),
      placeholder: cloneAttributeCallback('placeholder', 'control'),
      minrows: cloneAttributeCallback('minrows', 'control'),
      maxrows: cloneAttributeCallback('maxrows', 'control'),
    },
  })
  .css`
      /* https://m3.material.io/components/text-fields/specs */

      :host {
        display: inline-grid;
        grid-auto-flow: row;
        grid-template-rows: minmax(0, 100%);
      }

      :host(:is([filled][label])) {
        --control__margin-top: calc((var(--mdw-text-field__ratio) * 8px) + var(--mdw-typescale__body-small__line-height));
        --control__padding-top: 0px;
        --control__padding-bottom: calc((var(--mdw-text-field__ratio) * 8px) - 1px);
        --control__margin-bottom: 1px;
      }

      #label {
        --max-rows: none;
        --line-height: var(--mdw-typescale__body-large__line-height);
        --expected-height: calc(var(--line-height)
          + var(--control__margin-top)
          + var(--control__padding-top)
          + var(--control__padding-bottom)
          + var(--control__margin-bottom));
        max-block-size: 100%;
        grid-row: 1 / 1;
        padding: 0;
      }

      @supports(height: 1lh) {
        #label {
          --line-height: 1lh;
        }
      }

      #slot {
        display: none;
      }

      #control {
        -ms-overflow-style: -ms-autohiding-scrollbar;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;

        box-sizing: border-box;
        block-size: 100%;

        min-block-size: var(--expected-height);
        /* Avoid clipping on resize */
        max-block-size: inherit;
        inline-size: 100% !important; /* !important to override user-agent resize */
        padding-inline: 16px;
      }

      #control[icon] {
        padding-inline-start: 0;
      }

      #control[minrows] {
        min-block-size: calc((var(--min-rows) * var(--line-height))
          + var(--control__margin-top)
          + var(--control__padding-top)
          + var(--control__padding-bottom)
          + var(--control__margin-bottom)
        );
      }

      #control[maxrows] {
        max-block-size: calc((var(--max-rows) * var(--line-height))
          + var(--control__margin-top)
          + var(--control__padding-top)
          + var(--control__padding-bottom)
          + var(--control__margin-bottom)
        );
      }

      #control:is([icon], [input-prefix]) {
        padding-inline-start: 0;
      }

      #control:is([trailing-icon], [input-suffix]) {
        padding-inline-end: 0;
      }

      #suffix {
        padding-inline-end: 16px;
      }

      mdw-icon {
        align-self: flex-start;

        margin-block-start: calc((var(--expected-height) - var(--mdw-icon__size)) / 2);
      }

      #control[fixed] {
        /* stylelint-disable-next-line plugin/no-unsupported-browser-features */
        resize: none;
      }
  `
  .autoRegister('mdw-textarea');
