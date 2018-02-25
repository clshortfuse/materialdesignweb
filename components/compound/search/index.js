import { TextField } from '../../core/textfield/index';
import { List } from '../../core/list/index';


/**
 * @param {Object} options
 * @param {string} options.input
 * @param {string} options.content
 * @return {boolean}
 */
function defaultFilter(options) {
  return options.content.trim().toLocaleLowerCase()
    .indexOf(options.input.trim().toLocaleLowerCase()) !== -1;
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
    listRow.scrollIntoView(true);
  } else if (visibility > 0) {
    listRow.scrollIntoView(false);
  }
}

export default class Search {
  /**
   * @param {Object} options
   * @param {TextField} options.textfield
   * @param {List} options.list
   * @param {(function({input:string, content:string}):boolean)=} options.textFilter
   * @param {(function({HTMLElement}):string)=} options.rowTextParser
   */
  constructor(options) {
    this.textfield = options.textfield;
    this.list = options.list;
    this.filter = defaultFilter || options.textFilter;
    this.rowTextParser = defaultRowTextParser || options.rowTextParser;

    this.textfield.input.addEventListener('keydown', (event) => {
      this.onTextFieldInputEvent(event);
    });
    this.textfield.input.addEventListener('input', (event) => {
      this.handleInputEvent(event);
    });
  }

  /**
   * @param {Event|InputEvent} event
   * @return {void}
   */
  handleInputEvent(event) {
    this.filterListRows();
  }

  /**
   * @param {function({input:string, content:string}):boolean} fnFilter
   * @return {void}
   */
  filterListRows(fnFilter) {
    const input = this.textfield.input.value;
    const current = this.list.element.querySelector('.mdw-list__row[selected]');
    const rows = this.list.element.querySelectorAll('.mdw-list__row');
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const content = this.rowTextParser(row);
      const fn = fnFilter || this.filter;
      if (fn({ input, content })) {
        row.removeAttribute('hidden');
      } else {
        row.setAttribute('hidden', '');
      }
    }
    if (current && current.hasAttribute('hidden')) {
      selectSibling(this.list.element);
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  onTextFieldInputEvent(event) {
    if (event.defaultPrevented) {
      return;
    }
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }
    switch (event.key) {
      case 'ArrowUp': {
        const sibling = selectSibling(this.list.element, true);
        if (sibling) {
          scrollRowIntoView(sibling);
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        const sibling = selectSibling(this.list.element, false);
        if (sibling) {
          scrollRowIntoView(sibling);
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      default:
    }
  }
}
