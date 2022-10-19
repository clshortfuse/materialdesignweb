import Control from './Control.js';
import Ripple from './Ripple.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @implements {Omit<HTMLInputElement,DeprecatedHTMLInputElementProperties>} */
export default class Input extends Control {
  static elementName = 'mdw-input';

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  static inputTagName = 'input';

  static FORM_IPC_EVENT = 'mdw-input-changed';

  static GlobalListener = new EventTarget();

  static clonedContentAttributes = [
    ...super.clonedContentAttributes,
    'aria-controls',
    'accept', 'alt', 'autocomplete',
    'checked', 'dirname', 'disabled',
    // 'form',
    'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formTarget',
    'height',
    // 'list',
    'max', 'maxlength', 'min', 'minlength',
    'multiple', 'name', 'pattern', 'placeholder',
    'readonly', 'required', 'size', 'src', 'step',
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

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onControlClick(event) {
    super.onControlClick(event);
    if (event.defaultPrevented) return;

    if (this.type !== 'radio') return;
    if (this.required) return;
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();

    if (host.checked) {
      host.checked = false;
      // event.preventDefault();
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onControlKeydown(event) {
    super.onControlKeydown(event);
    if (event.defaultPrevented) return;
    if (this.type !== 'radio') return;
    if (event.key === 'Spacebar' || event.key === ' ') {
      if (this.required) return;
      /** @type {{host:Input}} */ // @ts-ignore Coerce
      const { host } = this.getRootNode();

      if (host.checked) {
        host.checked = false;
        event.preventDefault();
      }
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onControlChange(event) {
    super.onControlChange(event);
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    host._checked = this.checked;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
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
      case 'disabled':
        switch (this.#input.getAttribute('role')) {
          case null:
          case 'button':
          case 'radio':
          case 'switch':
            this.#input.disabled = newValue != null;
            if (newValue === null) {
              this.setAttribute('tabindex', '0');
            } else {
              this.setAttribute('tabindex', '-1');
            }
            break;
          default:
        }
        break;
      default:
    }

    if (name === 'checked') {
      this._checked = this.#input.checked;
    }
  }

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
    if (value !== this.value) {
      this.checked = false;
    } else {
      // console.log('Control.formIPCEvent: Continue match', this.name, this.value);
    }
  }

  /** @type {Ripple['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
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
      case '_checked':
        if (!this.type) {
          console.warn('unknown type?', this);
        }
        switch (this.type) {
          case 'checkbox':
          case 'radio':
            if (!newValue) {
              this.elementInternals.setFormValue(null);
            } else {
              this.elementInternals.setFormValue(this.value ?? 'on');
              this._notifyRadioChange(this.name, this.value ?? 'on');
            }
            break;
          default:
        }
        // Reinvoke change event for components tracking 'value';
        this.idlChangedCallback('checked', oldValue, newValue);
        break;
      default:
    }
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

  get checked() { return this._checked; }

  set checked(value) {
    this.#input.checked = value;
    /** @type {boolean} */
    this._checked = this.#input.checked;
  }
}

Input.prototype.ariaControls = Input.idl('ariaControls');
Input.prototype._isFocused = Input.idl('_isFocused', 'boolean');

// https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

const DOMString = { onNullish: String };

Input.prototype.accept = Input.idl('accept', DOMString);
Input.prototype.alt = Input.idl('alt', DOMString);
Input.prototype.defaultChecked = Input.idl('defaultChecked', { attr: 'checked', type: 'boolean' });
//  attribute boolean checked;
Input.prototype._checked = Input.idl('_checked', { attr: 'selected', type: 'boolean' });
Input.prototype.dirName = Input.idl('dirName', { attr: 'dirname', ...DOMString });
Input.prototype._formAction = Input.idl('_formAction', { attr: 'formaction' });
Input.prototype.formEnctype = Input.idl('formEnctype', { attr: 'formenctype', ...DOMString });
Input.prototype.formMethod = Input.idl('formMethod', { attr: 'formmethod', ...DOMString });
Input.prototype.formNoValidate = Input.idl('formnovalidate', { attr: 'formNoValidate', type: 'boolean' });
Input.prototype.formTarget = Input.idl('formTarget', { attr: 'formtarget', ...DOMString });
Input.prototype._height = Input.idl('_height', { attr: 'height', type: 'integer' });
Input.prototype.indeterminate = Input.idl('indeterminate', { type: 'boolean', reflect: false });
Input.prototype.max = Input.idl('max', DOMString);
Input.prototype.maxLength = Input.idl('maxLength', { attr: 'maxlength', type: 'integer', nullable: false });
Input.prototype.min = Input.idl('min', DOMString);
Input.prototype.minLength = Input.idl('minLength', { attr: 'minlength', type: 'integer', nullable: false });
Input.prototype.multiple = Input.idl('multiple', 'boolean');
Input.prototype.pattern = Input.idl('pattern', DOMString);
Input.prototype.placeholder = Input.idl('placeholder', DOMString);
Input.prototype.size = Input.idl('size', { type: 'integer', nullable: false });
Input.prototype.src = Input.idl('src', DOMString);
Input.prototype.step = Input.idl('step', DOMString);
Input.prototype.type = Input.idl('type', DOMString);
Input.prototype.defaultValue = Input.idl('defaultValue', { attr: 'value', ...DOMString });
//  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
Input.prototype._width = Input.idl('_width', { attr: 'width', type: 'integer' });
