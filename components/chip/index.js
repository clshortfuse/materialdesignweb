// https://www.w3.org/TR/wai-aria-practices/#Listbox

import * as ChipItem from './item.js';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  for (const el of element.getElementsByClassName('mdw-chip__item')) {
    ChipItem.attach(el);
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  for (const el of element.getElementsByClassName('mdw-chip__item')) {
    ChipItem.detach(el);
  }
}
