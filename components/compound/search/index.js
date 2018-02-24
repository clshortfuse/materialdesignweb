import TextField from '../../core/textfield/index';

/**
 * @param {Element} list
 * @param {boolean=} backwards
 * @return {Element} sibling
 */
function selectSibling(list, backwards) {
  const current = list.querySelector('.mdw-list__row[selected]:not([hidden])');
  const rows = list.querySelectorAll('.mdw-list__row:not([hidden])');
  let sibling;
  if (current) {
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
  }
  if (!sibling) {
    if (backwards) {
      sibling = rows[rows.length - 1];
    } else {
      sibling = rows[0];
    }
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
   * @param {TextField|HTMLElement} options.textfield
   * @param {HTMLElement=} options.list
   */
  constructor(options) {
    if (options.textfield instanceof TextField) {
      this.textfield = options.textfield;
    } else if (options.textfield && options.textfield.classList.contains('mdw-textfield')) {
      this.textfield = new TextField(options.textfield);
    } else {
      /** @type {HTMLElement} */
      const element = options.textfield.querySelector('.mdw-textfield');
      if (!element) {
        throw new Error('Textfield not found!');
      }
      this.textfield = new TextField(element);
    }
    if (options.list) {
      this.list = options.list;
    } else {
      /** @type {HTMLElement} */
      const element = this.textfield.element.querySelector('.mdw-list');
      if (!element) {
        throw new Error('List not found!');
      }
      this.list = element;
    }

    this.textfield.input.addEventListener('keydown', (event) => {
      this.onTextFieldInputEvent(event);
    });
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
        const sibling = selectSibling(this.list, true);
        if (sibling) {
          scrollRowIntoView(sibling);
        }
        event.stopPropagation();
        event.preventDefault();
        break;
      }
      case 'ArrowDown': {
        const sibling = selectSibling(this.list, false);
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
