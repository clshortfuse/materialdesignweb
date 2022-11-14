import { TextFieldMixin } from '../mixins/TextFieldMixin.js';

import Container from './Container.js';
import styles from './TextArea.css' assert { type: 'css' };

/** @implements {HTMLTextAreaElement} */
export default class TextArea extends TextFieldMixin(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-textarea';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const slot = template.getElementById('slot');
    slot.setAttribute('onslotchange', '{~static.onSlotChange}');
    template.append(slot);
    return template;
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

  /**
   * @param {InputEvent} event
   * @this {HTMLTextAreaElement}
   * @return {void}
   */
  static onControlInput(event) {
    super.onControlInput(event);
    if (TextArea.supportsCSSLineHeightUnit) return;
    /** @type {{host:TextArea}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    // if (!host.autosize) return;
    host.resize();
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChange(event) {
    /** @type {{host:TextArea}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    const textarea = /** @type {HTMLTextAreaElement} */ (host.refs.control);
    const previousValue = textarea.defaultValue;
    // Skip redundancy check, just replace.
    let lastChild;
    while ((lastChild = textarea.lastChild) != null) {
      lastChild.remove();
    }
    for (const child of this.assignedNodes()) {
      textarea.append(child.cloneNode(true));
    }

    const newValue = textarea.defaultValue;
    if (previousValue !== newValue) {
      host.idlChangedCallback('defaultValue', previousValue, newValue);
    }
  }

  #updatingSlot = false;

  #textarea = /** @type {HTMLTextAreaElement} */ (this.refs.control);

  /** @type {Control['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'defaultValueAttr':
        this.defaultValue = newValue;
        break;
      case 'defaultValue':
        this._value = this.#textarea.value;
        this.resize();
        break;
      case '_lineHeight':
        this.refs.label.style.setProperty('--line-height', newValue);
        break;
      case '_maxHeight':
        this.#textarea.style.setProperty('max-height', newValue);
        break;
      case 'minRows':
        this.refs.label.style.setProperty('--min-rows', newValue || 'none');
        this.resize();
        break;
      case 'maxRows':
        this.refs.label.style.setProperty('--max-rows', newValue || 'none');
        this.resize();
        break;
      case 'rows':
        this.resize();
        break;
      default:
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
      this.idlChangedCallback('defaultValue', previousValue, this.defaultValue);
    }
    this.textContent = this.#textarea.defaultValue;
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
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

  connectedCallback() {
    this.resize();
  }
}

TextArea.prototype._maxHeight = TextArea.idl('_maxHeight', { type: 'string' });
TextArea.prototype.fixed = TextArea.idl('fixed', { type: 'boolean' });
TextArea.prototype.minRows = TextArea.idl('minRows', { attr: 'minrows', type: 'integer', empty: 0 });
TextArea.prototype.maxRows = TextArea.idl('maxRows', { attr: 'maxrows', type: 'integer', empty: 0 });
TextArea.prototype._lineHeight = TextArea.idl('_lineHeight');

// https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element

const DOMString = { onNullish: String };
TextArea.prototype.cols = TextArea.idl('cols', { type: 'integer', empty: 0 });
TextArea.prototype.dirName = TextArea.idl('dirName', { attr: 'dirname', ...DOMString });
TextArea.prototype.maxLength = TextArea.idl('maxLength', { attr: 'maxlength', type: 'integer', empty: 0 });
TextArea.prototype.minLength = TextArea.idl('minLength', { attr: 'minlength', type: 'integer', empty: 0 });
TextArea.prototype.placeholder = TextArea.idl('placeholder', DOMString);
TextArea.prototype.rows = TextArea.idl('rows', { type: 'integer', empty: 0 });
TextArea.prototype.wrap = TextArea.idl('wrap', DOMString);

// Not in spec, but plays nice with HTML linters
TextArea.prototype.defaultValueAttr = TextArea.idl('defaultValueAttr', { attr: 'value', ...DOMString });
