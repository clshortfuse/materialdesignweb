import { TextField } from '../../core/textfield/index';
import { List } from '../../core/list/index';


/**
 * @param {Object} options
 * @param {string} options.input
 * @param {string} options.content
 * @return {boolean}
 */
function containsTextFilter(options) {
  return options.content.trim().toLocaleLowerCase()
    .indexOf(options.input.trim().toLocaleLowerCase()) !== -1;
}

/**
 * @param {Object} options
 * @param {string} options.input
 * @param {string} options.content
 * @return {boolean}
 */
function startsWithTextFilter(options) {
  return options.content.trim().toLocaleLowerCase()
    .indexOf(options.input.trim().toLocaleLowerCase()) === 0;
}

/**
 * @param {HTMLElement} row
 * @return {string}
 */
function defaultRowTextParser(row) {
  /**
   * @param {Node} node
   * @return {string}
   */
  function getTextNodeOnly(node) {
    let text = '';
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const childNode = node.childNodes[i];
      if (childNode.nodeType === Node.TEXT_NODE) {
        text += childNode.textContent;
      }
    }
    return text;
  }
  if (row.hasAttribute('data-mdw-search-text')) {
    return row.getAttribute('data-mdw-search-text');
  }
  let textElement = row.querySelector('.mdw-list__text .mdw-list__text-line');
  if (!textElement) {
    textElement = row.querySelector('.mdw-list__text');
  }
  if (!textElement) {
    textElement = row.querySelector('.mdw-list__text');
  }
  if (textElement) {
    return getTextNodeOnly(textElement);
  }
  return getTextNodeOnly(row);
}

/**
 * @param {Element} list
 * @param {boolean=} backwards
 * @return {Element} sibling
 */
function selectSibling(list, backwards) {
  const current = list.querySelector('.mdw-list__row[selected]');
  const rows = list.querySelectorAll('.mdw-list__row:not([hidden]):not([disabled])');
  let sibling;
  if (current && !current.hasAttribute('hidden')) {
    for (let i = 0; i < rows.length; i += 1) {
      const item = rows[i];
      if (item === current) {
        if (backwards) {
          sibling = rows[i - 1];
        } else {
          sibling = rows[i + 1];
        }
        break;
      }
    }
  } else if (backwards) {
    sibling = rows[rows.length - 1];
  } else {
    sibling = rows[0];
  }
  if (sibling && sibling !== current) {
    if (current) {
      current.removeAttribute('selected');
    }
    sibling.setAttribute('selected', '');
    return sibling;
  }
  return null;
}

/**
 * @param {HTMLElement} listRow
 * @return {void}
 */
function scrollRowIntoView(listRow) {
  /**
   * @param {HTMLElement} el
   * @return {number}
   */
  function getElementVisibility(el) {
    let rect = el.getBoundingClientRect();
    const { top, height } = rect;
    let next = el.parentElement;
    do {
      rect = next.getBoundingClientRect();
      if ((top + height) > rect.bottom) {
        // bottom clipped
        return 1;
      }
      if (top < rect.top) {
        // top clipped
        return -1;
      }
      next = next.parentElement;
    } while (next !== document.body);
    if (top < 0) {
      return -1;
    } else if ((top + height) > document.documentElement.clientHeight) {
      return 1;
    }
    return 0;
  }
  const visibility = getElementVisibility(listRow);
  if (visibility < 0) {
    listRow.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  } else if (visibility > 0) {
    listRow.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }
}

export default class Search {
  /**
   * @param {Object} options
   * @param {TextField} options.textfield
   * @param {List} options.list
   * @param {('contains'|'startsWith'|function({input:string, content:string}):boolean)=} [options.textFilter='contains']
   * @param {(function(HTMLElement):string)=} options.rowTextParser
   * @param {boolean=} [options.dropdown=false]
   * @param {boolean=} [options.filterRows=true]
   * @param {('replace'|'append'|'none')} [options.suggestionMethod='replace']
   * @param {(function(HTMLElement))=} options.onRowActivated
   * @param {(function(string):Promise)=} options.performSearch
   * @param {(function(any):Promise)=} options.updateList
   * @param {boolean=} [options.searchOnFocus=true]
   * @param {number=} options.debounce Debounce time in milliseconds
   */
  constructor(options) {
    this.textfield = options.textfield;
    this.list = options.list;
    if (typeof options.textFilter === 'function') {
      this.filter = options.textFilter;
    } else if (options.textFilter === 'startsWith') {
      this.filter = startsWithTextFilter;
    } else {
      this.filter = containsTextFilter;
    }
    this.rowTextParser = defaultRowTextParser || options.rowTextParser;

    this.list.element.addEventListener('click', (event) => {
      this.handleClickEvent(event);
    });
    this.textfield.input.addEventListener('keydown', (event) => {
      this.onTextFieldKeydownEvent(event);
    });
    this.textfield.input.addEventListener('input', (event) => {
      if (this.handleInputEvent) {
        this.handleInputEvent(event);
      }
    });
    this.textfield.input.addEventListener('blur', (event) => {
      if (this.handleBlurEvent) {
        this.handleBlurEvent(event);
      }
    });
    this.textfield.input.addEventListener('focus', (event) => {
      if (this.searchOnFocus) {
        this.handleInputEvent(event);
      }
    });

    this.dropdown = options.dropdown;
    if (options.filterRows !== false) {
      this.filterRows = true;
    }
    if (options.searchOnFocus !== false) {
      this.searchOnFocus = true;
    }
    this.debounce = options.debounce;
    this.suggestionMethod = options.suggestionMethod || 'replace';
    this.currentSearchTerm = this.textfield.input.value || '';
    /** @type {string} */
    this.suggestedInput = null;
    /** @type {string} */
    this.previousValue = null;
    if (options.onRowActivated) {
      this.onRowActivated = options.onRowActivated;
    }
    this.performSearch = options.performSearch || (() => Promise.resolve());
    this.updateList = options.updateList || (() => Promise.resolve());
  }

  /**
   * @param {MouseEvent} event
   * @return {void}
   */
  handleClickEvent(event) {
    if (!event.target) {
      return;
    }
    if (!event.target.classList) {
      return;
    }
    if (!event.target.classList.contains('mdw-list__row')) {
      return;
    }
    this.onRowActivated(event.target);
  }


  /**
   * Default input handler
   * @param {Event|InputEvent} event
   * @return {void}
   */
  handleInputEvent(event) {
    if (document.activeElement !== this.textfield.input) {
      return;
    }
    this.showDropDown();
    const inputValue = this.textfield.input.value || '';
    if (inputValue === this.suggestedInput) {
      return;
    }
    if (inputValue === this.previousValue) {
      return;
    }
    this.previousValue = inputValue;
    this.currentSearchTerm = inputValue;
    let results = null;
    Promise.resolve()
      .then(() => this.performDebounce(inputValue))
      .then(() => this.checkExpired(inputValue))
      .then(() => this.performSearch(inputValue))
      .then((searchResults) => {
        results = searchResults;
      })
      .then(() => this.checkExpired(inputValue))
      .then(() => this.updateList(results))
      .then(() => this.filterListRows())
      .catch((error) => {
        if (error.message === 'debounced') {
          return;
        }
        if (error.message === 'expired') {
          return;
        }
        throw error;
      });
  }

  checkExpired(inputValue) {
    return new Promise((resolve, reject) => {
      if (inputValue === this.currentSearchTerm) {
        resolve();
      } else {
        reject(new Error('expired'));
      }
    });
  }

  /**
   * @param {string} searchTerm
   * @return {Promise}
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
    const dropDownElement = this.textfield.element.querySelector('.mdw-textfield__dropdown');
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
    const dropDownElement = this.textfield.element.querySelector('.mdw-textfield__dropdown');
    if (dropDownElement.hasAttribute('mdw-hide')) {
      return false;
    }
    if (this.textfield.input === document.activeElement) {
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
    const dropDownElement = this.textfield.element.querySelector('.mdw-textfield__dropdown');
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
  handleBlurEvent(event) {
    if (this.dropdown) {
      const dropDownElement = this.textfield.element.querySelector('.mdw-textfield__dropdown');
      if (dropDownElement.hasAttribute('mdw-show')) {
        dropDownElement.removeAttribute('mdw-show');
      }
    }
  }

  /**
   * @param {HTMLElement} row
   * @return {void}
   */
  onRowSelected(row) {
    if (this.suggestionMethod === 'none') {
      return;
    }
    let suggestion = this.rowTextParser(row);
    if (suggestion) {
      suggestion = suggestion.trim();
    }
    if (!suggestion) {
      return;
    }
    this.suggestedInput = suggestion;
    if (this.suggestionMethod === 'replace') {
      this.textfield.input.value = suggestion;
    } else if (this.suggestionMethod === 'append') {
      const selectionStart = (this.previousValue || '').length;
      const selectionEnd = suggestion.length;
      this.textfield.input.value = suggestion;
      this.textfield.input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  /**
   * @param {HTMLElement} row
   * @return {void}
   */
  onRowActivated(row) {
    // Override me
  }

  /**
   * @param {(function({input:string, content:string}):boolean)=} fnFilter
   * @return {void}
   */
  filterListRows(fnFilter) {
    if (!this.filterRows) {
      return;
    }
    const input = this.textfield.input.value;
    const current = this.list.element.querySelector('.mdw-list__row[selected]');
    const rows = this.list.element.querySelectorAll('.mdw-list__row');
    let hasRow = false;
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const content = this.rowTextParser(row);
      const fn = fnFilter || this.filter;
      if (fn({ input, content })) {
        hasRow = true;
        row.removeAttribute('hidden');
      } else {
        row.setAttribute('hidden', '');
      }
    }
    if (current && current.hasAttribute('hidden')) {
      const newSelection = selectSibling(this.list.element);
      if (newSelection) {
        this.onRowSelected(newSelection);
      }
    }
    if (!hasRow) {
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
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }
    switch (event.key) {
      case 'ArrowUp': {
        if (this.isDropDownShown()) {
          const sibling = selectSibling(this.list.element, true);
          if (sibling) {
            scrollRowIntoView(sibling);
            this.onRowSelected(sibling);
          }
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        if (this.isDropDownShown()) {
          const sibling = selectSibling(this.list.element, false);
          if (sibling) {
            scrollRowIntoView(sibling);
            this.onRowSelected(sibling);
          }
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      case 'Escape': {
        if (this.hideDropDown()) {
          this.suggestedInput = this.previousValue;
          this.textfield.input.value = this.previousValue;
          event.stopPropagation();
          event.preventDefault();
        }
        break;
      }
      case 'Enter': {
        const current = this.list.element.querySelector('.mdw-list__row[selected]');
        if (current) {
          if (this.hideDropDown()) {
            const inputValue = this.textfield.input.value || '';
            this.textfield.input.setSelectionRange(inputValue.length, inputValue.length);
            this.onRowActivated(current);
            event.stopPropagation();
            event.preventDefault();
          }
        }
        break;
      }
      default:
    }
  }
}
