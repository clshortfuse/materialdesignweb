// https://www.w3.org/TR/wai-aria-practices/#Listbox

import { iterateArrayLike } from '../../core/dom.js';

import * as ChipItem from './item.js';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  iterateArrayLike(element.getElementsByClassName('mdw-chip__item'), ChipItem.attach);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  iterateArrayLike(element.getElementsByClassName('mdw-chip__item'), ChipItem.detach);
}
