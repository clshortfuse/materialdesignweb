import * as Keyboard from '../../core/aria/keyboard';
import * as Attributes from '../../core/aria/attributes';
import { dispatchDomEvent } from '../../core/dom';
import * as Cell from './cell';

export const SORT_EVENT = 'mdw:datatablecolumnheader-sort';

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
export function detach(element) {
  element.removeEventListener('click', onClick);
  Keyboard.detach(element);
  Cell.detach(element);
}
