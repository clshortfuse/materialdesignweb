import { constructHTMLOptionsCollectionProxy } from '../dom/HTMLOptionsCollectionProxy.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import List from './List.js';
import ListOption from './ListOption.js';

/** -implements {HTMLSelectElement} */
export default List
  .extend()
  .mixin(StateMixin)
  .mixin(FormAssociatedMixin)
  .mixin(KeyboardNavMixin)
  .mixin(DelegatesFocusMixin)
  .observe({
    multiple: 'boolean',
    size: { type: 'integer', empty: 0 },
  })
  .set({
    _ariaRole: 'listbox',
    /** @type {HTMLCollectionOf<InstanceType<typeof ListOption>> & HTMLOptionsCollection} */
    _optionsCollection: null,
    /** @type {HTMLCollectionOf<InstanceType<typeof ListOption>>} */
    _selectedOptionsCollection: null,
    _handlingSelectedness: false,
    _handleFormReset: true,
  })
  .define({
    options() {
      if (!this._optionsCollection) {
        // eslint-disable-next-line operator-linebreak
        const collection = /** @type {HTMLCollectionOf<InstanceType<typeof ListOption>>} */
          (this.getElementsByTagName(ListOption.elementName));
        this._optionsCollection = constructHTMLOptionsCollectionProxy({
          host: this,
          collection,
          OptionConstructor: ListOption,
          GroupConstructor: ListOption,
        });
      }
      return this._optionsCollection;
    },

    /** @return {HTMLCollectionOf<InstanceType<typeof ListOption>>} */
    selectedOptions() {
      // eslint-disable-next-line no-return-assign
      return (this._selectedOptionsCollection
        ??= (
          /** @type {HTMLCollectionOf<InstanceType<typeof ListOption>>} */
          (this.getElementsByClassName('mdw-list-option__selected')))
      );
    },

    type() { return this.multiple ? 'select-multiple' : 'select-one'; },

    kbdNavQuery() { return ListOption.elementName; },

    kbdNavFocusableWhenDisabled() { return true; },
  })
  .define({
    length() { return this.options.length; },

    selectedIndex: {
      get() {
        const [selectedItem] = this.selectedOptions;
        if (!selectedItem) return -1;
        return Array.prototype.indexOf.call(this.options, selectedItem);
      },
      set(value) {
        const itemToSelect = this.options[value];
        this._handlingSelectedness = true;
        for (const option of this.options) {
          option.selected = (option === itemToSelect);
        }
        this._handlingSelectedness = false;
        this._value = this.value;
      },
    },
    value: {
      get() {
        return this.selectedOptions[0]?.value ?? '';
      },
      /** @param {string} v */
      set(v) {
        let newValue = '';
        const vString = `${v}`;
        this._handlingSelectedness = true;
        for (const option of this.options) {
          if ((option.selected = (option.value === vString))) {
            newValue = vString;
          }
        }
        this._handlingSelectedness = false;
        this._value = newValue;
      },
    },
    add() { return this.options.add; },
  })
  .on({
    disabledStateChanged(oldValue, newValue) {
      this._kbdFocusable = !newValue;
      this.tabIndex = newValue ? -1 : 0;
    },
    multipleChanged(oldValue, newValue) {
      this.updateAriaProperty('ariaMultiSelectable', newValue ? 'true' : 'false');
    },
    _formResetChanged(oldValue, newValue) {
      if (!newValue) return;
      if (!this._handleFormReset) return;
      this.value = this.defaultValue;
    },
    connected() {
      if (!this.hasAttribute('tabindex')) {
        this.tabIndex = 0;
      }
    },
  })
  .methods({
    * _selectedOptionsGenerator() {
      for (const el of this.options) {
        if (!el.selected) continue;
        yield el;
      }
    },
    * [Symbol.iterator]() {
      for (const el of this.options) {
        yield el;
      }
    },
    focus() {
      this.focusCurrentOrFirst();
    },
    /**
     * @param {number} index
     * @return {InstanceType<typeof ListOption>|null}
     */
    item(index) { return this.options[index]; },
    /**
     * @param {string} name ID of ListOption
     * @return {InstanceType<typeof ListOption>|null}
     */
    namedItem(name) {
      for (const option of this.options) {
        if (option.id === name) {
          return option;
        }
      }
      return null;
    },
    /** @param {Event} event */
    onListboxClick(event) {
      const target = event.target;
      if (!(target instanceof ListOption)) return;
      event.stopImmediatePropagation();
      event.stopPropagation();

      const listOption = /** @type {InstanceType<ListOption>} */ (target);
      if (listOption.disabledState) return;

      let sendUpdateNotifications = false;
      this._handlingSelectedness = true;

      // Perform unselect
      if (listOption.selected) {
        // Unselect condition
        if (!this.required || (this.multiple && this.selectedOptions.length > 1)) {
          sendUpdateNotifications = true;
          listOption.selected = false;
        }
      } else {
        if (!this.multiple) {
          // Unselect all other values
          for (const option of this.selectedOptions) {
            option.selected = false;
          }
        }

        listOption.selected = true;
        sendUpdateNotifications = true;
      }

      this._value = this.value;
      this._handlingSelectedness = false;
      this._updateFormAssociatedValue();

      if (sendUpdateNotifications) {
        this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        this.dispatchEvent(new Event('change', { bubbles: true }));
      }
    },
  })
  .css`
    :host(:disabled) {
      cursor: not-allowed;
      pointer-events: none;
    }
    
    :host([internals-disabled]) {
      cursor: not-allowed;
      pointer-events: none;
    }
  `
  .events({
    'mdw-list-option:changed'(event) {
      event.stopPropagation();
      if (this.multiple) return;
      if (this._handlingSelectedness) return;

      const target = /** @type {InstanceType<typeof ListOption>} */ (event.target);
      if (target.selected) return;
      this._handlingSelectedness = true;

      // Programmatic selection of option means deselection of others
      for (const option of this.selectedOptions) {
        if (option !== target) {
          option.selected = false;
        }
      }

      this._value = this.value;
      this._handlingSelectedness = false;
    },
    focus() {
      // Manual delegates focus because disabled items need to be focusable
      this.focusCurrentOrFirst();
    },
    keydown(event) {
      if (event.key === 'Spacebar' || event.key === ' ') {
        const target = event.target;
        if (!(target instanceof ListOption)) return;
        event.stopPropagation();
        event.preventDefault();
        this.onListboxClick.call(this, event);
      }
    },
    click: 'onListboxClick',
  })
  .childEvents({
    slot: {
      slotchange() {
        this.refreshTabIndexes();
        let index = 0;
        for (const el of this.options) {
          el._index = index++;
        }
        // Refresh internal value
        this._value = this.value;
      },
    },
  })
  .autoRegister('mdw-listbox');
