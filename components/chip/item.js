// https://www.w3.org/TR/wai-aria-practices/#Listbox

import * as Ripple from '../../core/ripple/index';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-ripple');
  Ripple.attach(element);

  attachCore(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachCore(element) {}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachCore(element) {}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  detachCore(element);
  Ripple.detach(element);
}
