import ControlMixin from '../mixins/ControlMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';

import Container from './Container.js';
import styles from './Select.css' assert { type: 'css' };

/* @implements {HTMLSelectElement} */

/**
 * @template {abstract new (...args: any) => unknown} T
 * @param {InstanceType<T>} instance
 */
function superOf(instance) {
  const staticContext = instance.constructor;
  const superOfStatic = Object.getPrototypeOf(staticContext);
  return superOfStatic.prototype;
}

const Select = Container
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
    /** Locked to false because dropdown */
    multiple() { return false; },
    /** Locked to 1 because dropdown */
    size() { return 1; },
    type() {
      return 'select-one';
    },
  })
  .events('#slot', {
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
  })
  .methods({
    formResetCallback() {
      this._select.value = this.querySelector('option[selected]')?.value ?? '';
      // this._value = this.#select.value;
      superOf(this).formResetCallback.call(this);
    },
  })
  .on({
    composed({ template, $ }) {
      template.append($('#slot'));
      $('#prefix').remove();
      $('#suffix').remove();
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
