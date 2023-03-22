import CustomElement from '../core/CustomElement.js';
import ControlMixin from '../mixins/ControlMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './TextArea.css' assert { type: 'css' };

/** @implements {HTMLTextAreaElement} */
export default class TextArea extends CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(ControlMixin)
  .mixin(TextFieldMixin)
  .mixin(ResizeObserverMixin) {
  static { this.autoRegister('mdw-textarea'); }

  static {
    this.css(styles);
    this.childEvents({ slot: { slotchange: 'onSlotChange' } });
    this.on({
      composed() {
        const { control } = this.refs;
        control.setAttribute('input-prefix', '{input-prefix}');
        control.setAttribute('input-suffix', '{input-suffix}');
        control.setAttribute('minrows', '{minrows}');
        control.setAttribute('fixed', '{fixed}');
        control.setAttribute('icon', '{icon}');
        control.setAttribute('maxrows', '{maxrows}');
      },
      defaultValueAttrChanged(oldValue, newValue) {
        this.defaultValue = newValue;
      },
      defaultValueChanged() {
        this._value = this.#textarea.value;
        this.resize();
      },
      _maxHeightChanged(oldValue, newValue) {
        this.#textarea.style.setProperty('max-height', newValue);
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
    });
  }

  static supportsCSSLineHeightUnit = CSS.supports('height', '1lh');

  static controlTagName = 'textarea';

  static controlVoidElement = false;

  static clonedContentAttributes = [
    ...super.clonedContentAttributes,
    'cols',
    'dirname',
    'maxlength',
    'minlength',
    'placeholder',
    'rows',
  ];

  #updatingSlot = false;

  #textarea = /** @type {HTMLTextAreaElement} */ (this.refs.control);

  static {
    if (TextArea.supportsCSSLineHeightUnit) {
      this.childEvents({
        control: {
          input() {
            this.resize();
          },
        },
      });
    }
  }

  /**
   * @param {Event & {currentTarget:HTMLSlotElement}} event
   * @return {void}
   */
  onSlotChange({ currentTarget }) {
    const textarea = /** @type {HTMLTextAreaElement} */ (this.refs.control);
    const previousValue = textarea.defaultValue;
    textarea.replaceChildren(
      ...currentTarget.assignedNodes().map((child) => child.cloneNode(true)),
    );

    const newValue = textarea.defaultValue;
    if (previousValue !== newValue) {
      this.propChangedCallback('defaultValue', previousValue, newValue);
    }
  }

  /** @return {number} */
  resize() {
    const textarea = this.#textarea;
    textarea.style.removeProperty('height');

    // if (this.placeholder) textarea.removeAttribute('placeholder');

    if (!TextArea.supportsCSSLineHeightUnit) {
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
  }

  formResetCallback() {
    this.#textarea.value = this.defaultValue;
    this._value = this.#textarea.value;
    super.formResetCallback();
  }

  get updatingSlot() { return this.#updatingSlot; }

  get defaultValue() {
    return this.#textarea.defaultValue;
  }

  set defaultValue(value) {
    const previousValue = this.#textarea.defaultValue;
    this.#textarea.defaultValue = value;
    if (previousValue !== this.#textarea.defaultValue) {
      this.propChangedCallback('defaultValue', previousValue, this.defaultValue);
    }
    this.textContent = this.#textarea.defaultValue;
  }

  // @ts-ignore @override

  get type() { return 'textarea'; }

  get textLength() { return this.#textarea.textLength; }

  get select() { return this.#textarea.select; }

  get selectionDirection() { return this.#textarea.selectionDirection; }

  set selectionDirection(value) { this.#textarea.selectionDirection = value; }

  get selectionStart() { return this.#textarea.selectionStart; }

  set selectionStart(value) { this.#textarea.selectionStart = value; }

  get selectionEnd() { return this.#textarea.selectionEnd; }

  set selectionEnd(value) { this.#textarea.selectionEnd = value; }

  get setRangeText() { return this.#textarea.setRangeText; }

  get setSelectionRange() { return this.#textarea.setSelectionRange; }

  /** @param {ResizeObserverEntry} entry */
  onResizeObserved(entry) {
    super.onResizeObserved(entry);
    this.resize();
  }
}

TextArea.propList.delete('type');

TextArea.prototype._maxHeight = TextArea.prop('_maxHeight');
TextArea.prototype.fixed = TextArea.prop('fixed', { type: 'boolean' });
TextArea.prototype.minRows = TextArea.prop('minRows', { attr: 'minrows', type: 'integer', empty: 0 });
TextArea.prototype.maxRows = TextArea.prop('maxRows', { attr: 'maxrows', type: 'integer', empty: 0 });
TextArea.prototype._lineHeight = TextArea.prop('_lineHeight');

// https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element

const DOMString = { nullParser: String };
TextArea.prototype.cols = TextArea.prop('cols', { type: 'integer', empty: 0 });
TextArea.prototype.dirName = TextArea.prop('dirName', { attr: 'dirname', ...DOMString });
TextArea.prototype.maxLength = TextArea.prop('maxLength', { attr: 'maxlength', type: 'integer', empty: 0 });
TextArea.prototype.minLength = TextArea.prop('minLength', { attr: 'minlength', type: 'integer', empty: 0 });
TextArea.prototype.placeholder = TextArea.prop('placeholder', DOMString);
TextArea.prototype.rows = TextArea.prop('rows', { type: 'integer', empty: 1 });
TextArea.prototype.wrap = TextArea.prop('wrap', DOMString);

// Not in spec, but plays nice with HTML linters
TextArea.prototype.defaultValueAttr = TextArea.prop('defaultValueAttr', { attr: 'value', ...DOMString });
