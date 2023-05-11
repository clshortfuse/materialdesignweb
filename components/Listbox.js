import { constructHTMLOptionsCollectionProxy } from '../dom/HTMLOptionsCollectionProxy.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import List from './List.js';
import ListOption from './ListOption.js';

/** @implements {HTMLSelectElement} */
// @ts-expect-error Can't implement index signatures (use `item()`)
export default class Listbox extends List
  .mixin(StateMixin)
  .mixin(FormAssociatedMixin)
  .mixin(KeyboardNavMixin) {
  static {
    // eslint-disable-next-line no-unused-expressions
    this.css/* css */`
      :host(:disabled) {
        cursor: not-allowed;
        pointer-events: none;
      }
      
      :host([internals-disabled]) {
        cursor: not-allowed;
        pointer-events: none;
      }
    `;
    this.on({
      disabledStateChanged(oldValue, newValue) {
        this._kbdFocusable = !newValue;
        this.tabIndex = newValue ? -1 : 0;
      },
      multipleChanged(oldValue, newValue) {
        this.updateAriaProperty('ariaMultiSelectable', newValue ? 'true' : 'false');
      },
    });
  }

  /** @type {HTMLCollectionOf<ListOption> & HTMLOptionsCollection} */
  _optionsCollection = null;

  /** @type {HTMLCollectionOf<ListOption>} */
  _selectedOptionsCollection = null;

  constructor() {
    super();
    this.refs.slot.addEventListener('slotchange', this.onSlotChange);
    this.addEventListener('keydown', this.onControlKeydown);
    this.addEventListener('click', this.onListboxClick);
  }

  * _selectedOptionsGenerator() {
    for (const el of this.options) {
      if (!el.selected) continue;
      yield el;
    }
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  onSlotChange(event) {
    /** @type {{host:Listbox}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.refreshTabIndexes();
    let index = 0;
    for (const el of host.options) {
      el._index = index++;
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @this {Listbox}
   * @return {void}
   */
  onControlKeydown(event) {
    if (event.key === 'Spacebar' || event.key === ' ') {
      const target = event.target;
      if (!(target instanceof ListOption)) return;
      event.stopPropagation();
      event.preventDefault();
      this.onListboxClick.call(this, event);
    }
  }

  /**
   * @param {MouseEvent|KeyboardEvent} event
   * @this {Listbox}
   * @return {void}
   */
  onListboxClick(event) {
    const target = event.target;
    if (!(target instanceof ListOption)) return;
    event.stopPropagation();
    if (target.disabledState) return;

    /** @type {string} */
    const previousValue = this._value;

    // Perform unselect
    if (target.selected) {
      // Unselect condition
      if (!this.required || (this.multiple && this.selectedOptions.length > 1)) {
        target.selected = false;
      }
    } else {
      if (!this.multiple) {
        // Unselect all other values
        for (const option of this.selectedOptions) {
          option.selected = false;
        }
      }

      target.selected = true;
    }

    const newValue = this.value;

    if (previousValue !== newValue) {
      // Value changed
      this._value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  formResetCallback() {
    // TODO: Reset dirty on options
    super.formResetCallback();
  }

  get options() {
    if (!this._optionsCollection) {
      this._optionsCollection = constructHTMLOptionsCollectionProxy({
        host: this,
        collection: this.getElementsByTagName(ListOption.elementName),
        OptionConstructor: ListOption,
        GroupConstructor: ListOption,
      });
    }
    return this._optionsCollection;
  }

  /** @return {HTMLCollectionOf<ListOption>} */
  get selectedOptions() {
    // eslint-disable-next-line no-return-assign
    return (this._selectedOptionsCollection ??= this.getElementsByClassName('mdw-list-option__selected'));
  }

  // @ts-ignore @override
  get type() { return 'select'; }

  /** @override */
  get kbdNavQuery() { return ListOption.elementName; }

  // @ts-ignore @override
  get length() {
    return this.options.length;
  }

  get selectedIndex() {
    const [selectedItem] = this.selectedOptions;
    if (!selectedItem) return -1;
    return Array.prototype.indexOf.call(this.options, selectedItem);
  }

  set selectedIndex(value) {
    const itemToSelect = this.options[value];
    for (const option of this.options) {
      option.selected = (option === itemToSelect);
    }
    this._value = this.value;
  }

  get value() {
    return this.selectedOptions[0]?.value ?? '';
  }

  /** @param {string} v */
  set value(v) {
    let newValue = '';
    const vString = `${v}`;
    for (const option of this.options) {
      if ((option.selected = (option.value === vString))) {
        newValue = vString;
      }
    }
    this._value = newValue;
  }

  get add() { return this.options.add; }

  /**
   * @param {number} index
   * @return {ListOption|null}
   */
  item(index) { return this.options[index]; }

  /**
   * @param {string} name ID of ListOption
   * @return {ListOption|null}
   */
  namedItem(name) {
    for (const option of this.options) {
      if (option.id === name) {
        return option;
      }
    }
    return null;
  }

  * [Symbol.iterator]() {
    for (const el of this.options) {
      yield el;
    }
  }

  get kbdNavFocusableWhenDisabled() { return true; }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#htmlselectelement

// [CEReactions] attribute DOMString autocomplete;
// Listbox.prototype.disabled = Listbox.prop('disabled', { type: 'boolean' });
// readonly attribute HTMLFormElement? form;
Listbox.prototype.multiple = Listbox.prop('multiple', { type: 'boolean' });
// [CEReactions] attribute boolean multiple;
// [CEReactions] attribute DOMString name;
// [CEReactions] attribute boolean required;
Listbox.prototype.size = Listbox.prop('size', { type: 'integer', empty: 0 });
Listbox.prototype._ariaRole = 'listbox';
Listbox.prototype.delegatesFocus = false;

Listbox.autoRegister('mdw-listbox');
