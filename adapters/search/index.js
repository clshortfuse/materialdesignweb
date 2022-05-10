// https://www.w3.org/TR/wai-aria-practices/#combobox

import * as ListContent from '../../components/list/content.js';
import * as List from '../../components/list/index.js';
import * as TextField from '../../components/textfield/index.js';
import { getTextNode } from '../../core/dom.js';

/**
 * @param {string} input
 * @param {string} content
 * @return {boolean}
 */
function containsTextFilter(input, content) {
  return content.trim().toLocaleLowerCase()
    .includes(input.trim().toLocaleLowerCase());
}

/**
 * @param {string} input
 * @param {string} content
 * @return {boolean}
 */
function startsWithTextFilter(input, content) {
  return content.trim().toLocaleLowerCase()
    .indexOf(input.trim().toLocaleLowerCase()) === 0;
}

/**
 * @param {Element} item
 * @return {string}
 */
function defaultItemTextParser(item) {
  if (item.hasAttribute('data-mdw-search-text')) {
    return item.getAttribute('data-mdw-search-text');
  }
  let textElement;
  [
    'mdw-list__text-line',
    'mdw-list__text',
    'mdw-list__content',
  ].some((className) => {
    textElement = item.getElementsByClassName(className)[0];
    return textElement != null;
  });

  const textNode = textElement ? getTextNode(textElement) : getTextNode(item);
  if (textNode) {
    return textNode.textContent || '';
  }
  return '';
}

/**
 * @param {Element} list
 * @param {boolean} [backwards=false]
 * @return {Element} sibling
 */
function selectSibling(list, backwards) {
  const current = list.querySelector('[role="option"][aria-selected="true"]');
  const items = list.querySelectorAll('[role="option"]:not([aria-hidden="true"]):not([disabled])');
  let sibling;
  if (current && current.getAttribute('aria-hidden') !== 'true') {
    for (let i = 0; i < items.length; i++) {
      const item = items.item(i);
      if (item === current) {
        sibling = backwards ? items[i - 1] : items[i + 1];
        break;
      }
    }
  } else if (backwards) {
    sibling = items[items.length - 1];
  } else {
    sibling = items[0];
  }
  if (sibling && sibling !== current) {
    if (current) {
      current.setAttribute('aria-selected', 'false');
    }
    sibling.setAttribute('aria-selected', 'true');
    return sibling;
  }
  return null;
}

/**
 * @param {Element} el
 * @return {number}
 */
function getElementVisibility(el) {
  let rect = el.getBoundingClientRect();
  const { top, height } = rect;
  let next = el.parentElement;
  do {
    rect = next.getBoundingClientRect();
    // eslint-disable-next-line unicorn/consistent-destructuring
    if ((top + height) > rect.bottom) {
      // bottom clipped
      return 1;
    }
    // eslint-disable-next-line unicorn/consistent-destructuring
    if (top < rect.top) {
      // top clipped
      return -1;
    }
    next = next.parentElement;
  } while (next !== document.body);
  if (top < 0) {
    return -1;
  }
  if ((top + height) > document.documentElement.clientHeight) {
    return 1;
  }
  return 0;
}

/**
 * @param {Element} listItem
 * @return {void}
 */
function scrollItemIntoView(listItem) {
  const visibility = getElementVisibility(listItem);
  if (visibility < 0) {
    listItem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  } else if (visibility > 0) {
    listItem.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }
}

/**
 * @callback SearchAdapterTextFilter
 * @param {string} input
 * @param {string} content
 * @return {boolean} passes
 */

/**
 * @template T
 * @typedef SearchAdapterOptions
 * @prop {Element} textfield
 * @prop {Element} list
 * @prop {('contains'|'startsWith'|SearchAdapterTextFilter)} [textFilter='contains']
 * @prop {function(Element):string} [itemTextParser]
 * @prop {boolean} [dropdown=false]
 * @prop {boolean} [filterItems=true]
 * @prop {('replace'|'append'|'none')} [suggestionMethod='replace']
 * @prop {function(string):(Promise<T[]>)|T[]} [performSearch]
 * @prop {function(T[]):(Promise<void>|void)} [updateList]
 * @prop {boolean} [searchOnFocus=true]
 * @prop {number} [debounce=null] Debounce time in milliseconds
 */

/** @template T */
export default class SearchAdapter {
  /** @param {SearchAdapterOptions<T>} options */
  constructor(options) {
    this.textfield = options.textfield;
    this.list = options.list;
    this.list.setAttribute('role', 'listbox');
    List.attach(this.list);
    if (typeof options.textFilter === 'function') {
      this.filter = options.textFilter;
    } else if (options.textFilter === 'startsWith') {
      this.filter = startsWithTextFilter;
    } else {
      this.filter = containsTextFilter;
    }
    this.itemTextParser = defaultItemTextParser || options.itemTextParser;
    const input = /** @type {HTMLInputElement} */ (this.textfield.getElementsByClassName('mdw-textfield__input')[0]);
    this.input = input;
    this.list.addEventListener(ListContent.ACTIVATE_EVENT, (event) => {
      const item = /** @type {HTMLElement} */(event.target);
      this.onItemSelected(item);
      const inputValue = this.input.value || '';
      this.suggestedInput = inputValue;
      this.input.setSelectionRange(inputValue.length, inputValue.length);
      this.input.focus();
      this.hideDropDown();
    });
    this.input.addEventListener('keydown', (event) => {
      this.onTextFieldKeydownEvent(event);
    });
    this.input.addEventListener('input', (event) => {
      if (this.handleInputEvent) {
        this.handleInputEvent(event);
      }
    });
    this.input.addEventListener('blur', (event) => {
      if (this.handleBlurEvent) {
        this.handleBlurEvent(event);
      }
    });
    this.input.addEventListener('focus', (event) => {
      if (this.searchOnFocus) {
        this.handleInputEvent(event);
      }
    });

    this.dropdown = options.dropdown;
    if (options.filterItems !== false) {
      this.filterItems = true;
    }
    if (options.searchOnFocus !== false) {
      this.searchOnFocus = true;
    }
    this.debounce = options.debounce;
    this.suggestionMethod = options.suggestionMethod || 'replace';
    this.currentSearchTerm = this.input.value || '';
    /** @type {?string} */
    this.suggestedInput = null;
    /** @type {?string} */
    this.previousValue = null;
    this.performSearch = options.performSearch || this.performSearch.bind(this);
    this.updateList = options.updateList || this.updateList.bind(this);
  }

  /**
   * @param {string} value
   * @return {Promise<T[]>|T[]}
   */
  // eslint-disable-next-line class-methods-use-this
  performSearch(value) {
    return [];
  }

  /**
   * @param {T[]} results
   * @return {Promise<void>|void}
   */
  // eslint-disable-next-line class-methods-use-this
  updateList(results) {
    return undefined;
  }

  /**
   * Default input handler
   * @param {Event} [event]
   * @return {void}
   */
  handleInputEvent(event) { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (document.activeElement !== this.input) {
      return;
    }
    const inputValue = this.input.value || '';
    if (inputValue === this.suggestedInput) {
      return;
    }
    this.showDropDown();
    if (inputValue === this.previousValue) {
      return;
    }
    this.previousValue = inputValue;
    this.currentSearchTerm = inputValue;

    void (async () => {
      try {
        await this.performDebounce(inputValue);
        await this.checkExpired(inputValue);
        const searchResults = await this.performSearch(inputValue);
        await this.checkExpired(inputValue);
        await this.updateList(searchResults);
        await this.filterListItems();
      } catch (error) {
        if (error.message === 'debounced') {
          return;
        }
        if (error.message === 'expired') {
          return;
        }
        throw error;
      }
    })();
  }

  /**
   * @param {string} inputValue
   * @return {Promise<void>}
   */
  checkExpired(inputValue) {
    if (inputValue === this.currentSearchTerm) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('expired'));
  }

  /**
   * @param {string} searchTerm
   * @return {Promise<void>}
   */
  performDebounce(searchTerm) {
    if (!this.debounce) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (searchTerm !== this.currentSearchTerm) {
          reject(new Error('debounced'));
          return;
        }
        resolve();
      }, this.debounce);
    });
  }

  /** @return {boolean} handled */
  showDropDown() {
    if (!this.dropdown) {
      return false;
    }
    const dropDownElement = this.textfield.querySelector('.mdw-textfield__dropdown');
    let changed = false;
    if (dropDownElement.hasAttribute('mdw-hide')) {
      dropDownElement.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!dropDownElement.hasAttribute('mdw-show')) {
      dropDownElement.setAttribute('mdw-show', '');
      changed = true;
    }
    return changed;
  }

  /** @return {boolean} handled */
  isDropDownShown() {
    if (!this.dropdown) {
      return true;
    }
    const dropDownElement = this.textfield.querySelector('.mdw-textfield__dropdown');
    if (dropDownElement.hasAttribute('mdw-hide')) {
      return false;
    }
    if (this.input === document.activeElement) {
      return true;
    }
    if (dropDownElement.hasAttribute('mdw-show')) {
      return true;
    }
    return false;
  }

  /** @return {boolean} handled */
  hideDropDown() {
    if (!this.dropdown) {
      return true;
    }
    const dropDownElement = this.textfield.querySelector('.mdw-textfield__dropdown');
    if (!dropDownElement.hasAttribute('mdw-hide')) {
      dropDownElement.setAttribute('mdw-hide', '');
      return true;
    }
    return false;
  }

  /**
   * @param {Event|FocusEvent} event
   * @return {void}
   */
  handleBlurEvent(event) { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (this.dropdown) {
      const dropDownElement = this.textfield.querySelector('.mdw-textfield__dropdown');
      if (dropDownElement.hasAttribute('mdw-show')) {
        dropDownElement.removeAttribute('mdw-show');
      }
    }
  }

  /**
   * @param {Element} item
   * @return {void}
   */
  onItemSelected(item) {
    if (this.suggestionMethod === 'none') {
      return;
    }
    let suggestion = this.itemTextParser(item);
    if (suggestion) {
      suggestion = suggestion.trim();
    }
    if (!suggestion) {
      return;
    }
    this.suggestedInput = suggestion;
    if (this.suggestionMethod === 'replace') {
      TextField.setValue(this.textfield, suggestion);
    } else if (this.suggestionMethod === 'append') {
      const selectionStart = (this.previousValue || '').length;
      const selectionEnd = suggestion.length;
      TextField.setValue(this.textfield, suggestion);
      this.input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  /**
   * @param {SearchAdapterTextFilter} [fnFilter]
   * @return {void}
   */
  filterListItems(fnFilter) {
    if (!this.filterItems) {
      return;
    }
    const input = this.input.value;
    const current = this.list.querySelector('[role="option"][aria-selected="true"]');
    const items = this.list.querySelectorAll('[role="option"]');
    let hasItem = false;
    for (const item of items) {
      const content = this.itemTextParser(item);
      const fn = fnFilter || this.filter;
      if (fn(input, content)) {
        hasItem = true;
        item.setAttribute('aria-hidden', 'false');
      } else {
        item.setAttribute('aria-hidden', 'true');
      }
    }
    if (current && current.getAttribute('aria-hidden') === 'true') {
      const newSelection = selectSibling(this.list);
      if (newSelection) {
        this.onItemSelected(newSelection);
      }
    }
    if (!hasItem) {
      this.hideDropDown();
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  onTextFieldKeydownEvent(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.ctrlKey || event.altKey) {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
      case 'Up': {
        if (this.isDropDownShown()) {
          const sibling = selectSibling(this.list, true);
          if (sibling) {
            scrollItemIntoView(sibling);
            this.onItemSelected(sibling);
          }
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      case 'ArrowDown':
      case 'Down': {
        if (this.isDropDownShown()) {
          const sibling = selectSibling(this.list, false);
          if (sibling) {
            scrollItemIntoView(sibling);
            this.onItemSelected(sibling);
          }
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      case 'Esc':
      case 'Escape': {
        if (this.hideDropDown()) {
          this.suggestedInput = this.previousValue;
          TextField.setValue(this.textfield, this.previousValue);
          event.stopPropagation();
          event.preventDefault();
        }
        break;
      }
      case 'Enter': {
        /** @type {HTMLElement} */
        const current = this.list.querySelector('[role="option"][aria-selected="true"]');
        if (current && this.hideDropDown()) {
          current.click();
          event.stopPropagation();
          event.preventDefault();
        }
        break;
      }
      case 'Tab': {
        /** @type {HTMLElement} */
        const current = this.list.querySelector('[role="option"][aria-selected="true"]');
        if (current && this.hideDropDown()) {
          current.click();
          event.stopPropagation();
        }
        break;
      }
      default:
    }
  }
}
