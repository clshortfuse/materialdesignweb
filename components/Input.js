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
    const input = this.refs.control;
    if (!input) return;
    switch (name) {
      case 'aria-label':
        if (newValue == null) {
          input.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            input.setAttribute('aria-labelledby', 'slot');
          }
        } else {
          input.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            input.removeAttribute('aria-labelledby');
          }
        }
        break;
      case 'disabled':
        switch (input.getAttribute('role')) {
          case null:
          case 'button':
          case 'radio':
          case 'switch':
            input.disabled = newValue != null;
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
      this._checked = input.checked;
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
      case 'type':
        this.refs.control.type = newValue;
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

  get files() { return this.refs.control.files; }

  get indeterminate() { return this.refs.control.indeterminate; }

  get select() { return this.refs.control.select; }

  get selectionDirection() { return this.refs.control.selectionDirection; }

  set selectionDirection(value) { this.refs.control.selectionDirection = value; }

  get selectionEnd() { return this.refs.control.selectionEnd; }

  set selectionEnd(value) { this.refs.control.selectionEnd = value; }

  get selectionStart() { return this.refs.control.selectionStart; }

  set selectionStart(value) { this.refs.control.selectionStart = value; }

  get setRangeText() { return this.refs.control.setRangeText; }

  get setSelectionRange() { return this.refs.control.setSelectionRange; }

  get showPicker() { return this.refs.control.showPicker; }

  get stepDown() { return this.refs.control.stepDown; }

  get stepUp() { return this.refs.control.stepUp; }

  get valueAsDate() { return this.refs.control.valueAsDate; }

  set valueAsDate(value) {
    this.refs.control.valueAsDate = value;
    this.value = this.refs.control.value;
  }

  get valueAsNumber() { return this.refs.control.valueAsNumber; }

  set valueAsNumber(value) {
    this.refs.control.valueAsNumber = value;
    this.value = this.refs.control.value;
  }

  get height() { return this.refs.control.height; }

  set height(value) {
    this.refs.control.height = value;
    this._height = value;
  }

  get formAction() { return this.refs.control.formAction; }

  set formAction(value) {
    this.refs.control.formAction = value;
    this._formAction = value;
  }

  get width() { return this.refs.control.width; }

  set width(value) {
    this.refs.control.width = value;
    this._width = value;
  }
}

Input.prototype.ariaControls = Input.idl('ariaControls');
Input.prototype._isFocused = Input.idlBoolean('_isFocused');

// https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

const DOMString = { onNullish: String };
const NOT_NULLABLE = { nullable: false };

Input.prototype.accept = Input.idl('accept', DOMString);
Input.prototype.alt = Input.idl('alt', DOMString);
Input.prototype.defaultChecked = Input.idlBoolean('defaultChecked', { attr: 'checked' });
//  attribute boolean checked;
Input.prototype._checked = Input.idlBoolean('_checked', { attr: 'selected' });
Input.prototype.dirName = Input.idl('dirName', { attr: 'dirname', ...DOMString });
Input.prototype._formAction = Input.idl('_formAction', { attr: 'formaction' });
Input.prototype.formEnctype = Input.idl('formEnctype', { attr: 'formenctype', ...DOMString });
Input.prototype.formMethod = Input.idl('formMethod', { attr: 'formmethod', ...DOMString });
Input.prototype.formNoValidate = Input.idlBoolean('formnovalidate', { attr: 'formNoValidate' });
Input.prototype.formTarget = Input.idl('formTarget', { attr: 'formtarget', ...DOMString });
Input.prototype._height = Input.idlInteger('_height', { attr: 'height' });
Input.prototype.max = Input.idl('max', DOMString);
Input.prototype.maxLength = Input.idlInteger('maxLength', { attr: 'maxlength', ...NOT_NULLABLE });
Input.prototype.min = Input.idl('min', DOMString);
Input.prototype.minLength = Input.idlInteger('minLength', { attr: 'minlength', ...NOT_NULLABLE });
Input.prototype.multiple = Input.idlBoolean('multiple');
Input.prototype.pattern = Input.idl('pattern', DOMString);
Input.prototype.placeholder = Input.idl('placeholder', DOMString);
Input.prototype.size = Input.idlInteger('size', NOT_NULLABLE);
Input.prototype.src = Input.idl('src', DOMString);
Input.prototype.step = Input.idl('step', DOMString);
Input.prototype.type = Input.idl('type', DOMString);
Input.prototype.defaultValue = Input.idl('defaultValue', { attr: 'value', ...DOMString });
//  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
Input.prototype._width = Input.idlInteger('_width', { attr: 'width' });

Input.prototype.refs = {
  ...Ripple.prototype.refs,
  ...Input.addRefs({
    control: { id: 'control', type: 'input' },
  }),
};
