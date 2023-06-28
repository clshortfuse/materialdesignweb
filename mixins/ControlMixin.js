/* https://html.spec.whatwg.org/multipage/form-control-infrastructure.html */

import { cloneAttributeCallback } from '../core/CustomElement.js';
import { IS_FIREFOX } from '../core/dom.js';

import FormAssociatedMixin from './FormAssociatedMixin.js';

/** @typedef {import('../core/CustomElement.js').default} CustomElement */

/** @typedef {'align'|'useMap'} DeprecatedHTMLInputElementProperties */

/** @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} HTMLControlElement */

/**
 * @param {ReturnType<import('./StateMixin.js').default>} Base
 */
export default function ControlMixin(Base) {
  return Base
    .mixin(FormAssociatedMixin)
    .observe({
      ariaLabel: 'string',
      _slotInnerText: 'string',
    })
    .set({
      delegatesFocus: true,
      focusableOnDisabled: false,
      controlTagName: 'input',
      controlVoidElement: true,
      _slotMutationObserver: null,
    })
    .methods({
      onValueChangingContentAttribute() {
        const control = /** @type {HTMLControlElement} */ (this.refs.control);

        if (!this.hasAttribute('value')) {
          // Force HTMLInputElement to recalculate default
          // Unintended effect of incrementally changing attributes (eg: range)
          control.removeAttribute('value'); // Firefox will not run steps unless value is changed (remove first)
          control.setAttribute('value', ''); // Chrome needs to know to reset
        }
        // Changing control attribute may change the value (eg: min/max)
        this._value = control.value;
      },
      /** @type {HTMLElement['focus']} */
      focus(...options) {
        this.refs.control.focus(...options);
      },
      /** Redirect click requests to control itself */
      click() {
        console.log('ControlMixin: Click');
        this.refs.control.click();
      },
    })
    .define({
      stateTargetElement() { return this.refs.control; },
      form() { return this.elementInternals.form; },
      validity() { return this.elementInternals.validity; },
      validationMessage() { return this.elementInternals.validationMessage; },
      willValidate() { return this.elementInternals.willValidate; },
      labels() { return this.elementInternals.labels; },
    })
    .methods({
      checkValidity() {
        const control = /** @type {HTMLControlElement} */ (this.refs.control);
        const validityState = control.checkValidity();
        /** @type {Partial<ValidityState>} */
        const newValidity = {};

        // eslint-disable-next-line guard-for-in
        for (const key in control.validity) {
          // @ts-ignore Skip cast
          newValidity[key] = control.validity[key];
        }
        this.elementInternals.setValidity(newValidity, control.validationMessage, control);
        this._invalid = !validityState;
        this._validationMessage = control.validationMessage;
        this._badInput = control.validity.badInput;
        return validityState;
      },
      reportValidity() {
        this.checkValidity();
        /** @type {HTMLControlElement} */ (this.refs.control).reportValidity();
        return this.elementInternals.reportValidity();
      },
      /**
       * @param {string} error
       * @return {void}
       */
      setCustomValidity(error) {
        /** @type {HTMLControlElement} */ (this.refs.control).setCustomValidity(error);
        this.checkValidity();
        this.elementInternals.setValidity(
          {
            ...this.elementInternals.validity,
            customError: !!error,
          },
          this.elementInternals.validationMessage || error,
          this.refs.control,
        );
      },

    })
    .expressions({
      _computedAriaLabel({ ariaLabel, _slotInnerText }) {
        if (IS_FIREFOX) {
          return ariaLabel?.trim() || _slotInnerText?.trim() || null;
        }
        return ariaLabel?.trim() || null;
      },
    })

    .recompose(({ template, html, element }) => {
      // Firefox will not apply label from slots.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1826194
      // Wait until controlTagName is settled before templating
      template.append(html`
        <${element.controlTagName} id=control
          aria-labelledby=${({ ariaLabel }) => (ariaLabel ? null : 'slot')}
          part=control
          aria-label={_computedAriaLabel}
          form-disabled={disabledState}
          type={type}
          >${element.controlVoidElement ? '' : `</${element.controlTagName}>`}
      `);
    })
    .on({
      disabledStateChanged(oldValue, newValue) {
        const control = /** @type {HTMLControlElement} */ (this.refs.control);
        control.setAttribute('aria-disabled', `${newValue}`);
        if (!this.focusableOnDisabled) {
          control.disabled = newValue;
          if (newValue) {
            this.tabIndex = 0;
          } else {
            this.removeAttribute('tabindex');
          }
        }
      },
      constructed() {
        const control = /** @type {HTMLControlElement} */ (this.refs.control);
        this._value = control.value;
      },
      connected() {
        // Expose this element as focusable
        if (!this.hasAttribute('tabindex')) {
          this.tabIndex = 0;
        }
      },
      attrs: {
        autocomplete: cloneAttributeCallback('autocomplete', 'control'),
        name: cloneAttributeCallback('name', 'control'),
        readonly: cloneAttributeCallback('readonly', 'control'),
        required: cloneAttributeCallback('required', 'control'),
      },
    })
    .childEvents({
      control: {
        invalid() {
          console.debug('ControlMixin: invalid', this);
        },
        input({ currentTarget }) {
          console.debug('ControlMixin: input');
          const control = /** @type {HTMLControlElement} */ (currentTarget);
          if (this.validity.valid) {
            // Track internally
            control.checkValidity();
            this._badInput = control.validity.badInput;
          } else {
            // Perform check in case user has validated
            this.checkValidity();
          }
          this._value = control.value;
        },
        change({ currentTarget }) {
          console.debug('ControlMixin: change');
          const control = /** @type {HTMLControlElement} */ (currentTarget);
          this._valueDirty = true;
          this._value = control.value;
          this.checkValidity();
        },
      },
      slot: IS_FIREFOX ? {
        slotchange({ currentTarget }) {
          // Firefox will not apply label from slots.
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1826194
          this._slotInnerText = this.textContent;
          if (!this._slotMutationObserver) {
            this._slotMutationObserver = new MutationObserver(() => {
              this._slotInnerText = this.textContent;
            });
            this._slotMutationObserver.observe(currentTarget, { characterData: true });
          }
        },
      } : {},
    })
    .rootEvents({
      change() {
        // Change event is NOT composed. Needs to escape shadow DOM
        this.dispatchEvent(new Event('change', { bubbles: true }));
      },
    })
    .css`
      :host {
        display: inline-flex;
      }
      
      /* Remove Firefox inner */
      :host(::-moz-focus-inner) {
        border: 0;
      }

      #control {
        /* Control is the touch target */
        /* Firefox requires at least 1px "visible" for screen reading */
        /* Safari will not allow interaction with 0 opacity */
        /* Chrome will not focus with visibility:hidden */
      
        position: absolute;
        /* stylelint-disable-next-line liberty/use-logical-spec */
        top: 50%;
        /* stylelint-disable-next-line liberty/use-logical-spec */
        left: 50%;
        
        /* --mdw-device-pixel-ratio: 1; */
      
        block-size: 100%;
        min-block-size: 48px;
        inline-size:100%;
        min-inline-size: 48px;
        margin: 0;
        border: 0;
        padding: 0;
      
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      
        cursor: auto;
        outline: none;
      
        pointer-events: auto;
      
        transform: translateX(-50%) translateY(-50%);
      
        /* Safari and Chrome will emit two click events if not at top of stack */
        /* Allows up to 3 other layers (eg: ripple, outline) */
        z-index: 4;
      
        background-color: transparent;
      
        border-radius: 0;
        color: transparent;
      }
      
      #control::-moz-focus-inner {
        border: 0;
      }
    
    `;
}
