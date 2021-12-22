import * as Attributes from '../../core/aria/attributes.js';
import * as Keyboard from '../../core/aria/keyboard.js';
import { dispatchDomEvent } from '../../core/dom.js';

export const FOCUS_EVENT = 'mdw:datatablecell-focus';
export const CHECKED_CHANGE_EVENT = 'mdw:datatablecell-checkedchange';
export const SELECTED_CHANGE_EVENT = 'mdw:datatablecell-selectedchange';

/**
 * @param {FocusEvent} event
 * @return {void}
 */
export function onFocus(event) {
  /** @type {HTMLElement} */
  const gridCellElement = (event.currentTarget);
  dispatchDomEvent(gridCellElement, FOCUS_EVENT);
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
 * @param {HTMLTableCellElement} element
 * @return {void}
 */
export function attach(element) {
  Keyboard.attach(element);
  element.addEventListener('focus', onFocus);
}

/**
 * @param {HTMLTableCellElement} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('focus', onFocus);
  Keyboard.detach(element);
}
