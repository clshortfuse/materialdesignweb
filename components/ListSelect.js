import { constructHTMLOptionsCollectionProxy } from '../dom/HTMLOptionsCollectionProxy.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import List from './List.js';
import ListOption from './ListOption.js';

/** @implements {HTMLSelectElement} */
export default class ListSelect extends List
  .mixin(StateMixin)
  .mixin(FormAssociatedMixin)
  .mixin(KeyboardNavMixin) {
  static {
    this.autoRegister('mdw-list-select');
    // eslint-disable-next-line no-unused-expressions
    this.css`
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

  constructor() {
    super();
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
    this.refs.slot.addEventListener('slotchange', this.onSlotChange);
    this.addEventListener('keydown', this.onControlKeydown);
    this.addEventListener('click', this.onListSelectClick);
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
    /** @type {{host:ListSelect}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.refreshTabIndexes();
    let index = 0;
    for (const el of host.options) {
      el._index = index++;
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @this {ListSelect}
   * @return {void}
   */
  onControlKeydown(event) {
    if (event.key === 'Spacebar' || event.key === ' ') {
      const target = event.target;
      if (!(target instanceof ListOption)) return;
      event.stopPropagation();
      event.preventDefault();
      this.onListSelectClick.call(this, event);
    }
  }

  /**
   * @param {MouseEvent|KeyboardEvent} event
   * @this {ListSelect}
   * @return {void}
   */
  onListSelectClick(event) {
    console.log('onListSelectClick');
    const target = event.target;
    if (!(target instanceof ListOption)) return;
    event.stopPropagation();
    if (target.disabledState) return;

    // Perform unselect
    if (target.selected) {
      if (this.multiple) {
        const selections = [...this.selectedOptions];
        if (this.required && selections.length === 1) return;
        if (selections.length === 0) {
          console.warn('impossible??');
        }
        target.selected = false;
        let firstSelection = selections.shift();
        if (firstSelection === target) {
          // Get new first selection (or undefined)
          firstSelection = selections.shift();
        }
        this._value = firstSelection?.value ?? '';
        return;
      }
      if (this.required) return;
      target.selected = false;
      this._value = '';
      return;
    }

    if (this.multiple) {
      // Skip ctrlKey requirement
      target.selected = true;
      this._value = this.selectedOptions.next().value;
      return;
    }

    for (const el of this.options) {
      el.selected = el === target;
    }
    this._value = target.value;
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

  get selectedOptions() {
    return this._selectedOptionsGenerator();
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
    return this.options.selectedIndex;
  }

  set selectedIndex(value) {
    this.options.selectedIndex = value;
    this._value = (this.options.item(value)?.value) ?? '';
  }

  get value() {
    return this._value;
  }

  /** @param {string} v */
  set value(v) {
    for (const el of this.options) {
      el.selected = (el.value === v);
    }
    this._value = v;
  }

  get add() { return this.options.add; }

  get item() { return this.options.item; }

  get namedItem() { return this.options.namedItem; }

  * [Symbol.iterator]() {
    for (const el of this.options) {
      yield el;
    }
  }

  get kbdNavFocusableWhenDisabled() { return true; }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#htmlselectelement

// [CEReactions] attribute DOMString autocomplete;
// ListSelect.prototype.disabled = ListSelect.prop('disabled', { type: 'boolean' });
// readonly attribute HTMLFormElement? form;
ListSelect.prototype.multiple = ListSelect.prop('multiple', { type: 'boolean' });
// [CEReactions] attribute boolean multiple;
// [CEReactions] attribute DOMString name;
// [CEReactions] attribute boolean required;
ListSelect.prototype.size = ListSelect.prop('size', { type: 'integer', empty: 0 });
ListSelect.prototype._ariaRole = 'listbox';
ListSelect.prototype.delegatesFocus = true;
