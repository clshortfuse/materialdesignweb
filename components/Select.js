import CustomElement from '../core/CustomElement.js';
import ControlMixin from '../mixins/ControlMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Select provides a control for choosing an option from a list of options.
 * implements {HTMLSelectElement}
 * @see https://m3.material.io/components/text-fields/overview
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(ControlMixin)
  .mixin(TextFieldMixin)
  .observe({
    /** Name of the trailing icon to render (defaults to the dropdown arrow). */
    trailingIcon: { empty: 'arrow_drop_down' },
  })
  .overrides({
    controlTagName: 'select',
    controlVoidElement: false,
    type: 'select-one',
  })
  .define({
    /** Return the internal native <select> element used as the control. */
    _select() {
      return /** @type {HTMLSelectElement} */ (this.refs.control);
    },
    /** Readonly: whether the underlying control allows multiple selection. */
    multiple: { value: false },
    /** Readonly: the rendered size of the native select control. */
    size: { value: 1 },
  })
  .html`<slot id=slot></slot>`
  .childEvents({
    slot: {
    /** @param {Event & {currentTarget:HTMLSlotElement}} event */
      slotchange(event) {
        const select = this._select;
        select.replaceChildren(
          ...event.currentTarget.assignedNodes()
            .map((child) => child.cloneNode(true)),
        );
        this._value = select.value;
      },
    },
  })
  .recompose(({ template, refs: { slot, prefix, suffix, control } }) => {
    control.setAttribute('icon', '{icon}');
    template.append(slot);
    prefix.remove();
    suffix.remove();
  })
  .on({
    /** When the form resets, restore the select value from any option[selected]. */
    _formResetChanged(oldValue, newValue) {
      if (!newValue) return;
      /** @type {HTMLSelectElement} */
      const selectedOption = this.querySelector('option[selected]');
      this._select.value = selectedOption?.value ?? '';
    },
  })
  .css`
    #slot {
      display: none;
    }
    
    #shape {
      padding: 0;
    
      cursor: pointer;
    }
    
    #shape[disabled] {
      cursor: not-allowed;
    }
    
    #icon {
      position: absolute;
    
      /* padding-inline-start: 12px; */
    }
    
    #trailing-icon {
      position: absolute;
      inset-inline-end: 16px;
    }
    
    #control {
      padding-inline-start: 16px;
      padding-inline-end: calc(16px + 24px + 16px);
      accent-color: rgb(var(--mdw-ink));
    
      cursor: inherit;
    }
    
    #control[icon] {
      margin-inline-start: calc(16px + 24px);
      padding-inline-start: 0;
    }
    
    option {
      accent-color: rgb(var(--mdw-ink));
    
      min-block-size: var(--mdw-typescale__label-large__line-height);
    
      appearance: none;
    
      background-color: rgb(var(--mdw-color__surface)) !important;
      border-radius: 0;
      color: rgb(var(--mdw-color__on-surface)) !important;
    
      font: var(--mdw-typescale__label-large__font);
      letter-spacing: var(--mdw-typescale__label-large__letter-spacing);
    }
  `
  .autoRegister('mdw-select');
