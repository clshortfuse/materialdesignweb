import * as Attributes from '../../core/aria/attributes.js';
import * as Keyboard from '../../core/aria/keyboard.js';
import { dispatchDomEvent, iterateArrayLike } from '../../core/dom.js';

import * as DataTableCell from './cell.js';

export const FOCUS_EVENT = 'mdw:datatablerow-focus';
export const SELECTED_CHANGE_EVENT = 'mdw:datatablerow-selectedchange';

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onFocus(event) {
  /** @type {HTMLTableRowElement} */
  const rowElement = (event.currentTarget);
  dispatchDomEvent(rowElement, FOCUS_EVENT);
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {boolean} [dispatchEvent=true]
 * @return {boolean} successful
 */
export function setSelected(element, value, dispatchEvent = true) {
  return Attributes.setSelected(element, value, dispatchEvent ? SELECTED_CHANGE_EVENT : null);
}

/**
 * @param {HTMLTableRowElement} element
 * @return {void}
 */
export function attach(element) {
  Keyboard.attach(element);
  element.setAttribute('role', 'row');
  element.addEventListener('focus', onFocus);
  iterateArrayLike(element.cells, DataTableCell.attach);
}

/**
 * @param {HTMLTableRowElement} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('focus', onFocus);
  Keyboard.detach(element);
  iterateArrayLike(element.cells, DataTableCell.detach);
}
