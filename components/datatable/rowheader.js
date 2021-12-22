import * as Keyboard from '../../core/aria/keyboard.js';

/**
 * @param {HTMLTableHeaderCellElement} element
 * @return {void}
 */
export function attach(element) {
  Keyboard.attach(element);
  element.setAttribute('role', 'rowheader');
}

/**
 * @param {HTMLTableHeaderCellElement} element
 * @return {void}
 */
export function detach(element) {
  Keyboard.detach(element);
}
