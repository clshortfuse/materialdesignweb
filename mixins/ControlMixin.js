/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import styles from './ControlMixin.css' assert { type: 'css' };
import FormAssociatedMixin from './FormAssociatedMixin.js';
import RippleMixin from './RippleMixin.js';

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} HTMLControlElement */

/**
 * @param {typeof import('../core/CustomElement.js').default} Base
 */
export default function ControlMixin(Base) {
  class Control extends FormAssociatedMixin(RippleMixin(Base)) {
    /** @return {Iterable<string>} */
    static get observedAttributes() {
      return [
        ...super.observedAttributes,
        'aria-label',
        ...this.valueChangingContentAttributes,
        ...this.clonedContentAttributes,
      ];
    }

    static focusableOnDisabled = false;

    static controlTagName = 'input';

    static controlVoidElement = true;

    /** @type {string[]} */
    static clonedContentAttributes = [
      'autocomplete', 'name', 'readonly', 'required',
    ];

    /** @type {string[]} */
    static valueChangingContentAttributes = [];

    /** @param {any[]} args  */
    constructor(...args) {
      super(...args);
      /** @type {string} */
      this._value = this._control.value;
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
      // Expose this element as focusable
        // this.setAttribute('tabindex', '0');
      }
    }

    /** @type {CustomElement['attributeChangedCallback']} */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      switch (name) {
        case 'aria-label':
          if (newValue == null) {
            this._control.removeAttribute(name);
            if (!this.hasAttribute('aria-labelledby')) {
              this._control.setAttribute('aria-labelledby', 'slot');
            }
          } else {
            this._control.setAttribute(name, newValue);
            if (!this.hasAttribute('aria-labelledby')) {
              this._control.removeAttribute('aria-labelledby');
            }
          }
          break;
        case 'disabled':
          this._control.setAttribute('aria-disabled', newValue ? 'true' : 'false');
          if (!this.static.focusableOnDisabled) {
            this._control.disabled = newValue != null;
            if (newValue === null) {
              this.tabIndex = 0;
              // this.setAttribute('tabindex', '0');
            } else {
              this.removeAttribute('tabindex');
            }
          }
          break;
        default:
      }
      if (name === 'aria-controls') {
        if (newValue == null) {
          this._control.removeAttribute(name);
        } else {
          this._control.setAttribute(name, newValue);
        }
      }

      if (this.static.clonedContentAttributes.includes(name)) {
        if (newValue == null) {
          this._control.removeAttribute(name);
        } else {
          this._control.setAttribute(name, newValue);
        }
      }

      if (this.static.valueChangingContentAttributes.includes(name)) {
        if (!this.hasAttribute('value')) {
        // Force HTMLInputElement to recalculate default
        // Unintended effect of incrementally changing attributes (eg: range)
          this._control.setAttribute('value', '');
        }
        // Changing control attribute may change the value (eg: min/max)
        this._value = this._control.value;
      }
    }

    /** @type {HTMLControlElement} */
    get _control() { return this.refs.control; }

    get rippleActiveTarget() { return this._control; }

    click() {
      /** Redirect click requests to control itself */
      this._control.click();
    }

    static {
      this.css(styles);
      this.on('composed', ({ template, $, html }) => {
        template.append(
          html`
            <label id=label>
              <${this.controlTagName} id=control aria-labelledby="slot"
                >${this.controlVoidElement ? '' : `</${this.controlTagName}>`}
              ${$('#state')}
              ${$('#ripple')}
              ${$('#slot')}
            </label>
          `,
        );
      });
      this.events('#control', {
        input({ currentTarget }) {
          const control = /** @type {HTMLControlElement} */ (currentTarget);
          if (!this.validity.valid) {
            // Perform check in case user has validated
            this.checkValidity();
          } else {
            // Track internally
            control.checkValidity();
            this._badInput = control.validity.badInput;
          }
          this._value = control.value;
        },
        change({ currentTarget }) {
          const control = /** @type {HTMLControlElement} */ (currentTarget);
          this._value = control.value;
          this.checkValidity();
          // Change event is NOT composed. Needs to escape shadow DOM
          this.dispatchEvent(new Event('change', { bubbles: true }));
        },
      });
    }

    /** @type {HTMLElement['focus']} */
    focus(...options) {
      super.focus(...options);
      this.refs.control.focus(...options);
    }

    /**
     * @template {typeof Control & ReturnType<import('./RippleMixin.js').default> & ReturnType<import('./FormAssociatedMixin.js').default>} T
     * @return {T}
     */
    get static() {
      return /** @type {T} */ (/** @type {unknown} */ (super.static));
    }

    get form() { return this.elementInternals.form; }

    // get name() { return this.getAttribute('name'); }
    get value() {
      return this._value;
    }

    set value(v) {
      this._valueDirty = true;
      this._control.value = v;
      this._value = this._control.value;
    }

    get validity() { return this.elementInternals.validity; }

    get validationMessage() { return this.elementInternals.validationMessage; }

    get willValidate() { return this.elementInternals.willValidate; }

    checkValidity() {
      const validityState = this._control.checkValidity();
      /** @type {Partial<ValidityState>} */
      const newValidity = {};

      // eslint-disable-next-line guard-for-in
      for (const key in this._control.validity) {
      // @ts-ignore Skip cast
        newValidity[key] = this._control.validity[key];
      }
      this.elementInternals.setValidity(newValidity, this._control.validationMessage);
      this._invalid = !validityState;
      this._validationMessage = this._control.validationMessage;
      this._badInput = this._control.validity.badInput;
      return validityState;
    }

    reportValidity() {
      this.checkValidity();
      this._control.reportValidity();
      return this.elementInternals.reportValidity();
    }

    /**
     * @param {string} error
     * @return {void}
     */
    setCustomValidity(error) {
      this._control.setCustomValidity(error);
      this.checkValidity();
    }

    get labels() { return this.elementInternals.labels; }
  }
  Control.prototype.delegatesFocus = true;
  return Control;
}
