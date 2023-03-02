import Block from '../layout/Block.js';
import ControlMixin from '../mixins/ControlMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';

import styles from './Select.css' assert { type: 'css' };

/* @implements {HTMLSelectElement} */

const Select = Block
  .mixin(StateMixin)
  .mixin(ControlMixin)
  .mixin(SurfaceMixin)
  .mixin(TextFieldMixin)
  .extend()
  .css(styles)
  .observe({
    autocomplete: 'string',
    trailingIcon: {
      empty: 'arrow_drop_down',
    },
  })
  .define({
    _select() {
      return /** @type {HTMLSelectElement} */ (this.refs.control);
    },
    /** Readonly values */
    multiple: { value: false },
    size: { value: 1 },
    type: { value: 'select-one' },
  })
  .childEvents({
    slot: {
    /** @param {Event & {currentTarget:HTMLSlotElement}} event */
      slotchange(event) {
        const select = this._select;
        // Skip redundancy check, just replace.
        let lastChild;
        while ((lastChild = select.lastChild) != null) {
          lastChild.remove();
        }
        for (const child of event.currentTarget.assignedNodes()) {
          select.append(child.cloneNode(true));
        }
        this._value = select.value;
      },
    },
  })
  .overrides({
    formResetCallback() {
      this._select.value = this.querySelector('option[selected]')?.value ?? '';
      this.super.formResetCallback();
    },
  })
  .on({
    composed({ template }) {
      const { slot, prefix, suffix } = this.refs;
      template.append(slot);
      prefix.remove();
      suffix.remove();
    },
  })
  .setStatic({
    controlTagName: 'select',
    controlVoidElement: false,
  })
  .autoRegister('mdw-select');

Select.clonedContentAttributes = [
  ...Select.clonedContentAttributes,
  'autocomplete', // Hint for form autofill feature
];

export default Select;
