import CustomElement from '../core/CustomElement.js';
import ControlMixin from '../mixins/ControlMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/* @implements {HTMLSelectElement} */
export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(ControlMixin)
  .mixin(TextFieldMixin)
  .extend()
  .observe({
    trailingIcon: { empty: 'arrow_drop_down' },
  })
  .overrides({
    controlTagName: 'select',
    controlVoidElement: false,
    type: 'select-one',
  })
  .define({
    _select() {
      return /** @type {HTMLSelectElement} */ (this.refs.control);
    },
    /** Readonly values */
    multiple: { value: false },
    size: { value: 1 },
  })
  .html/* html */`<slot id=slot></slot>`
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
  .on({
    composed({ template }) {
      const { slot, prefix, suffix, control } = this.refs;
      control.setAttribute('icon', '{icon}');
      template.append(slot);
      prefix.remove();
      suffix.remove();
    },
    _formResetChanged(oldValue, newValue) {
      if (!newValue) return;
      this._select.value = this.querySelector('option[selected]')?.value ?? '';
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
