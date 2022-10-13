import styles from './Input.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @implements {Omit<HTMLInputElement,DeprecatedHTMLInputElementProperties>} */
export default class Input extends Ripple {
  static elementName = 'mdw-input';

  static styles = [...super.styles, styles];

  static delegatesFocus = true;

  static formAssociated = true;

  static fragments = [
    ...super.fragments,
    /* html */`
      <label id=label>
        <input id=input aria-labelledby="slot"
          onclick="{constructor.onInputClick}"
          onchange="{constructor.onInputChange}"
          onkeydown="{constructor.onInputKeydown}">
      </label>
    `,
  ];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      ...this.idlInputElementAttributes,
      'aria-label',
    ];
  }

  static FORM_IPC_EVENT = 'mdw-input-changed';

  static GlobalListener = new EventTarget();

  static idlInputElementAttributes = [
    'aria-labelledby',
    'accept', 'alt', 'autocomplete',
    'checked', 'dirname', 'disabled',
    'max', 'maxlength', 'min', 'maxlength',
    'multiple', 'name', 'pattern', 'placeholder',
    'readonly', 'required', 'size', 'src', 'step',
    'type', 'value',
  ];

  static valueChangingInputAttributes = [
    'checked', 'max', 'maxlength', 'min', 'maxlength',
    'multiple', 'pattern', 'step', 'type', 'value',
  ];

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputClick(event) {
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('selected')) return;

    this.checked = false;
    host.toggleAttribute('selected', false);
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputKeydown(event) {
    if (event.key !== 'Spacebar' && event.key !== ' ') return;
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('selected')) return;
    event.preventDefault();

    this.checked = false;
    host.toggleAttribute('selected', false);
    event.preventDefault();
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    /** @type {{host:Input}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.value = this.value;
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    host._checked = this.checked;
  }

  #ipcListener = this.formIPCEvent.bind(this);

  /** @type {EventTarget} */
  #ipcTarget = null;

  _hasValue = false;

  constructor() {
    super();
    this._value = this.refs.input.value;
    if (!this.hasAttribute('tabindex')) {
      // Expose this element as focusable
      this.setAttribute('tabindex', '0');
    }
  }

  compose() {
    const fragment = super.compose();
    fragment.getElementById('label').append(
      fragment.getElementById('overlay'),
      fragment.getElementById('ripple'),
      fragment.getElementById('slot'),
    );
    return fragment;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    const { input } = this.refs;
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
    if (name === 'aria-controls' || Input.idlInputElementAttributes.includes(name)) {
      if (newValue == null) {
        input.removeAttribute(name);
      } else {
        input.setAttribute(name, newValue);
      }
    }

    if (Input.valueChangingInputAttributes.includes(name)) {
      if (!this.hasAttribute('value')) {
        // Force HTMLInputElement to recalculate default
        // Unintended effect of incrementally changing attributes (eg: range)
        input.setAttribute('value', '');
      }
      // Changing input attribute may change the value (eg: min/max)
      this._value = input.value;
    }

    if (name === 'checked') {
      this._checked = input.checked;
    }
  }

  get hasValue() { return this._hasValue; }

  /** @type {Ripple['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case '_value':
        // Reinvoke change event for components tracking 'value';
        this.idlChangedCallback('value', oldValue, newValue);
        break;
      case '_checked':
        this.toggleAttribute('selected', newValue);
        switch (this.type) {
          case 'checkbox':
          case 'radio':
            if (!newValue) {
              // console.log('Input.attributeChangedCallback: unset', this.name, 'null');
              this.elementInternals.setFormValue(null);
            } else {
              // console.log('Input.attributeChangedCallback: set', this.name, this.value ?? 'on');
              this.elementInternals.setFormValue(this.value ?? 'on');
              this.#ipcTarget?.dispatchEvent(
                new CustomEvent(Input.FORM_IPC_EVENT, { detail: [this.name, this.value] }),
              );
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

  refreshFormAssociation() {
    const newTarget = this.elementInternals.form ?? Input.GlobalListener;
    if (newTarget === this.#ipcTarget) {
      console.warn('Already associated?', newTarget);
      return;
    }
    if (this.#ipcTarget) {
      this.#ipcTarget.removeEventListener(Input.FORM_IPC_EVENT, this.#ipcListener);
    }
    if (this.type !== 'radio') return;

    this.#ipcTarget = newTarget;
    this.#ipcTarget.addEventListener(Input.FORM_IPC_EVENT, this.#ipcListener);
  }

  /**
   * New lifecycle callback. This is called when association with
   * <form> is changed.
   * @param {HTMLFormElement?} form
   * @return {void}
   */
  formAssociatedCallback(form) {
    this.refreshFormAssociation();
  }

  /**
   * @param {CustomEvent<[string, string]>} event
   * @return {void}
   */
  formIPCEvent(event) {
    if (event.target !== this.#ipcTarget) {
      console.warn('Input.formIPCEvent: Abort from wrong form');
      return;
    }
    if (this.type !== 'radio') {
      console.warn('Input.formIPCEvent: Abort from not radio');
      return;
    }
    const [name, value] = event.detail;
    if (this.name !== name) return;
    if (value !== this.value) {
      // console.log('Input.formIPCEvent: Unset self', this.name, this.value);
      this.checked = false;
      this.removeAttribute('selected');
    } else {
      // console.log('Input.formIPCEvent: Continue match', this.name, this.value);
    }
  }

  // New lifecycle callback. This is called when ‘disabled’ attribute of
  // this element or an ancestor <fieldset> is updated.
  formDisabledCallback(disabled) {
    // console.log('formDisabledCallback', disabled, this);
    // TODO: Always disabled regardless of form disabled state
    // this.disabled = disabled;
  }

  formResetCallback() {
    this.value = this.getAttribute('value') || '';
  }

  /**
   *
   * @param {string|FormData} state
   * @param {'autocomplete'|'restore'} mode
   */
  formStateRestoreCallback(state, mode) {
    console.log('formStateRestoreCallback', state);
    if (typeof state === 'string') {
      this.value = state;
    } else {
      console.warn('Could not restore', state);
    }
  }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    this.refs.input?.focus(options);
  }

  get form() { return this.elementInternals.form; }

  // get name() { return this.getAttribute('name'); }

  get checked() { return this._checked; }

  set checked(value) {
    this.refs.input.checked = value;
    /** @type {boolean} */
    this._checked = this.refs.input.checked;
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._hasValue = true;
    this.refs.input.value = v;
    this._value = this.refs.input.value;
  }

  get validity() { return this.elementInternals.validity; }

  get validationMessage() { return this.elementInternals.validationMessage; }

  get willValidate() { return this.elementInternals.willValidate; }

  checkValidity() { return this.elementInternals.checkValidity(); }

  reportValidity() { return this.elementInternals.reportValidity(); }

  connectedCallback() {
    super.connectedCallback();
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
    const { input } = this.refs;
    input.addEventListener('keydown', Ripple.onRippleKeyDown, { passive: true });
    if (!this.elementInternals.form) {
      this.formAssociatedCallback(null);
    }
  }
}

Input.prototype.ariaControls = Input.idl('ariaControls');

// https://html.spec.whatwg.org/multipage/input.html#htmlinputelement

const DOMString = { onNullish: String };
const NOT_NULLABLE = { nullable: false };

Input.prototype.accept = Input.idl('accept', DOMString);
Input.prototype.alt = Input.idl('alt', DOMString);
Input.prototype.autocomplete = Input.idl('autocomplete', DOMString);
Input.prototype.defaultChecked = Input.idlBoolean('defaultChecked', { attr: 'checked' });
//  attribute boolean checked;
Input.prototype._checked = Input.idlBoolean('_checked', { reflect: false });
Input.prototype.dirName = Input.idl('dirName', { attr: 'dirname', ...DOMString });
Input.prototype.disabled = Input.idlBoolean('disabled');
// readonly attribute HTMLFormElement? form;
// attribute FileList? files;
// [CEReactions] attribute USVString formAction;
// [CEReactions] attribute DOMString formEnctype;
// [CEReactions] attribute DOMString formMethod;
// [CEReactions] attribute boolean formNoValidate;
// [CEReactions] attribute DOMString formTarget;
// [CEReactions] attribute unsigned long height;
// attribute boolean indeterminate;
// readonly attribute HTMLElement? list;
Input.prototype.max = Input.idl('max', DOMString);
Input.prototype.maxLength = Input.idlInteger('maxLength', { attr: 'maxlength', ...NOT_NULLABLE });
Input.prototype.min = Input.idl('min', DOMString);
Input.prototype.minLength = Input.idlInteger('minLength', { attr: 'minlength', ...NOT_NULLABLE });
Input.prototype.multiple = Input.idlBoolean('multiple');
Input.prototype.name = Input.idl('name', DOMString);
Input.prototype.pattern = Input.idl('pattern', DOMString);
Input.prototype.placeholder = Input.idl('placeholder', DOMString);
Input.prototype.readOnly = Input.idlBoolean('readOnly', { attr: 'readOnly' });
Input.prototype.required = Input.idlBoolean('required');
Input.prototype.size = Input.idlInteger('size', NOT_NULLABLE);
Input.prototype.src = Input.idl('src', DOMString);
Input.prototype.step = Input.idl('step', DOMString);
Input.prototype.type = Input.idl('type', DOMString);
Input.prototype.defaultValue = Input.idl('defaultValue', { attr: 'value', ...DOMString });
//  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
Input.prototype._value = Input.idl('_value', { default: '', reflect: false });
// attribute object? valueAsDate;
// attribute unrestricted double valueAsNumber;
// [CEReactions] attribute unsigned long width;
// undefined stepUp(optional long n = 1);
// undefined stepDown(optional long n = 1);
// readonly attribute boolean willValidate;
// readonly attribute ValidityState validity;
// readonly attribute DOMString validationMessage;
// boolean checkValidity();
// boolean reportValidity();
// undefined setCustomValidity(DOMString error);
// readonly attribute NodeList? labels;
// undefined select();
// attribute unsigned long? selectionStart;
// attribute unsigned long? selectionEnd;
// attribute DOMString? selectionDirection;
// undefined setRangeText(DOMString replacement);
// undefined setRangeText(DOMString replacement, unsigned long start, unsigned long end, optional SelectionMode selectionMode = "preserve");
// undefined setSelectionRange(unsigned long start, unsigned long end, optional DOMString direction);
// undefined showPicker();

Input.prototype.refs = {
  ...Ripple.prototype.refs,
  ...Input.addRefNames('input'),
};
