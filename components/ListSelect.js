import { constructHTMLOptionsCollectionProxy } from '../dom/ HTMLOptionsCollectionProxy.js';
import FormAssociatedMixin from '../mixins/FormAssociatedMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';

import styles from './List.css' assert { type: 'css' };
import List from './List.js';
import ListOption from './ListOption.js';

/** @implements {HTMLSelectElement} */
export default class ListSelect extends KeyboardNavMixin(FormAssociatedMixin(List)) {
  static {
    this.autoRegister('mdw-list-select');
    this.css(styles);
  }

  /** @type {HTMLCollectionOf<ListOption> & HTMLOptionsCollection} */
  _optionsCollection = null;

  constructor() {
    super();
    this.refs.slot.addEventListener('slotchange', this.onSlotChange, { passive: true });
    this.addEventListener('keydown', this.onControlKeydown);
    this.addEventListener('click', this.onListSelectClick);
  }

  /** @type {InstanceType<typeof List>['propChangedCallback']} */
  propChangedCallback(name, oldValue, newValue) {
    super.propChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'multiple':
        this.setAttribute('aria-multiselectable', newValue ? 'true' : 'false');
        break;
      default:
    }
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
    const target = event.target;
    if (!(target instanceof ListOption)) return;
    event.stopPropagation();
    if (target.disabled) return;

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
}

// https://html.spec.whatwg.org/multipage/form-elements.html#htmlselectelement

// [CEReactions] attribute DOMString autocomplete;
ListSelect.prototype.disabled = ListSelect.prop('disabled', { type: 'boolean' });
// readonly attribute HTMLFormElement? form;
ListSelect.prototype.multiple = ListSelect.prop('multiple', { type: 'boolean' });
// [CEReactions] attribute boolean multiple;
// [CEReactions] attribute DOMString name;
// [CEReactions] attribute boolean required;
ListSelect.prototype.size = ListSelect.prop('size', { type: 'integer', empty: 0 });
ListSelect.prototype.ariaRole = 'listbox';
ListSelect.prototype.delegatesFocus = true;
