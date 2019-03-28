// https://www.w3.org/TR/wai-aria-practices/#button

import * as Ripple from '../../core/ripple/index';
import * as Overlay from '../../core/overlay/index';
import * as AriaButton from '../../core/aria/button';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-overlay');
  Ripple.attach(element);
  element.classList.add('mdw-ripple');
  Overlay.attach(element);
  attachCore(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachCore(element) {
  AriaButton.attach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachCore(element) {
  AriaButton.detach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  detachCore(element);
  Ripple.detach(element);
  Overlay.detach(element);
}
