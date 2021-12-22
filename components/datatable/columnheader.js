import * as Attributes from '../../core/aria/attributes.js';
import * as Keyboard from '../../core/aria/keyboard.js';
import { dispatchDomEvent } from '../../core/dom.js';

import * as Cell from './cell.js';

export const SORT_EVENT = 'mdw:datatablecolumnheader-sort';

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onClick(event) {
  /** @type {HTMLElement} */
  const columnHeaderElement = (event.currentTarget);
  if (Attributes.isDisabled(columnHeaderElement)) {
    return;
  }
  const ariaSort = columnHeaderElement.getAttribute('aria-sort');
  if (!ariaSort) {
    return;
  }
  const sort = (ariaSort === 'ascending' ? 'descending' : 'ascending');
  const detail = { sort };
  dispatchDomEvent(columnHeaderElement, SORT_EVENT, detail);
}

/**
 * @param {HTMLTableHeaderCellElement} element
 * @return {void}
 */
export function attach(element) {
  Keyboard.attach(element);
  element.setAttribute('role', 'columnheader');
  element.addEventListener('click', onClick);
  Cell.attach(element);
}

/**
 * @param {HTMLTableHeaderCellElement} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('click', onClick);
  Keyboard.detach(element);
  Cell.detach(element);
}
