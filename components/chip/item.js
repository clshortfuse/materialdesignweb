// https://www.w3.org/TR/wai-aria-practices/#Listbox

import * as Ripple from '../../core/ripple/index.js';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-ripple');
  Ripple.attach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  Ripple.detach(element);
}
