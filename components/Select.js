import CustomElement from '../core/CustomElement.js';
import ControlMixin from '../mixins/ControlMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Select.css' assert { type: 'css' };

/* @implements {HTMLSelectElement} */

export default class Select extends CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(ControlMixin)
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
  })
  .setStatic({
    controlTagName: 'select',
    controlVoidElement: false,
  })
  .autoRegister('mdw-select') {
  /* Overrides */
  static clonedContentAttributes = [
    ...super.clonedContentAttributes,
    'autocomplete', // Hint for form autofill feature
  ];

  formResetCallback() {
    this._select.value = this.querySelector('option[selected]')?.value ?? '';
    super.formResetCallback();
  }
}
