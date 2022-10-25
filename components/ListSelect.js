import * as RovingTabIndex from '../aria/rovingtabindex.js';
import { constructHTMLOptionsCollectionProxy } from '../dom/ HTMLOptionsCollectionProxy.js';

import CustomElement from './CustomElement.js';
import { FormAssociatedMixin } from './FormAssociatedMixin.js';
import styles from './List.css' assert { type: 'css' };
import List from './List.js';
import ListItem from './ListItem.js';
import ListOption from './ListOption.js';

/** @implements {HTMLSelectElement} */
export default class ListSelect extends FormAssociatedMixin(List) {
  static elementName = 'mdw-list-select';

  static ariaRole = 'listbox';

  static delegatesFocus = true;

  static styles = [...super.styles, styles];

  /** @type {HTMLCollectionOf<ListItem> & HTMLOptionsCollection} */
  _optionsCollection = null;

  constructor() {
    super();
    this.setAttribute('aria-orientation', 'vertical');
    this.refs.slot.addEventListener('slotchange', ListSelect.onSlotChange, { passive: true });
    this.addEventListener('keydown', this.static.onControlKeydown);
    this.addEventListener(RovingTabIndex.TABINDEX_ZEROED, this.static.onTabIndexZeroed);
    this.addEventListener('click', this.static.onListSelectClick);
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChange(event) {
    /** @type {{host:ListSelect}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    console.log('onslotchange', event);
    RovingTabIndex.setupTabIndexes(host.options, true);
    let index = 0;
    for (const el of host.options) {
      el._index = index++;
    }
  }

  /**
   * @param {Event} event
   * @this {ListSelect}
   * @return {void}
   */
  static onTabIndexZeroed(event) {
    event.stopPropagation();
    const currentItem = /** @type {HTMLElement} */ (event.target);
    RovingTabIndex.removeTabIndex(this.options, [currentItem]);
  }

  /**
   * @param {MouseEvent|KeyboardEvent} event
   * @this {ListSelect}
   * @return {void}
   */
  static onListSelectClick(event) {
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

  /**
   * @param {KeyboardEvent} event
   * @this {ListSelect}
   * @return {void}
   */
  static onControlKeydown(event) {
    super.onControlKeydown(event);
    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      event.stopPropagation();
      event.preventDefault();
      // @ts-ignore AOM
      this.ariaActiveDescendantElement = RovingTabIndex.selectNext([...this.options]);
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      event.stopPropagation();
      event.preventDefault();
      // @ts-ignore AOM
      this.ariaActiveDescendantElement = RovingTabIndex.selectPrevious([...this.options]);
      return;
    }
    if (event.key === 'Spacebar' || event.key === ' ') {
      const target = event.target;
      if (!(target instanceof ListOption)) return;
      event.stopPropagation();
      event.preventDefault();
      ListSelect.onListSelectClick.call(this, event);
    }
  }

  /** @type {CustomElement['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'multiple':
        this.setAttribute('aria-multiselectable', newValue ? 'true' : 'false');
        break;
      default:
    }
  }

  /** @return {NodeListOf<ListItem>} */
  get childListItems() {
    return this.querySelectorAll(ListItem.elementName);
  }

  get options() {
    if (!this._optionsCollection) {
      this._optionsCollection = constructHTMLOptionsCollectionProxy({
        host: this,
        collection: this.getElementsByTagName(ListOption.elementName),
        OptionConstructor: ListOption,
        GroupConstructor: ListOption,
      });
      console.log('collection created', this);
    }
    return this._optionsCollection;
  }

  get selectedOptions() {
    return this._selectedOptionsGenerator();
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'select'; }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    const nextTarget = this.querySelector('[role="option"][tabindex="0"]');
    nextTarget?.focus();
  }

  // @ts-ignore @override
  get length() {
    return this.querySelectorAll('[role="option"]').length;
  }

  get selectedIndex() {
    return this.options.selectedIndex;
  }

  set selectedIndex(value) {
    this.options.selectedIndex = value;
    this._value = this.options.item(value)?.value ?? '';
  }

  get value() {
    return this._value;
  }

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

  * _selectedOptionsGenerator() {
    for (const el of this.options) {
      if (!el.selected) continue;
      yield el;
    }
  }
}

// https://html.spec.whatwg.org/multipage/form-elements.html#htmlselectelement

// [CEReactions] attribute DOMString autocomplete;
ListSelect.prototype.disabled = ListSelect.idl('disabled', { type: 'boolean' });
// readonly attribute HTMLFormElement? form;
ListSelect.prototype.multiple = ListSelect.idl('multiple', { type: 'boolean' });
// [CEReactions] attribute boolean multiple;
// [CEReactions] attribute DOMString name;
// [CEReactions] attribute boolean required;
ListSelect.prototype.size = ListSelect.idl('size', { type: 'integer', empty: 0 });
