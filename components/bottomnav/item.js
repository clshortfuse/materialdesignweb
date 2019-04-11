// https://www.w3.org/TR/wai-aria-1.1/#tab

import * as AriaTab from '../../core/aria/tab';
import { iterateArrayLike } from '../../core/dom';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-overlay');
  if (!element.hasAttribute('mdw-overlay-off')) {
    element.setAttribute('mdw-overlay-off', 'selected');
  }
  if (!element.hasAttribute('mdw-overlay-default')) {
    element.setAttribute('mdw-overlay-default', 'medium');
  }
  Overlay.attach(element);

  element.classList.add('mdw-ripple');
  Ripple.attach(element);

  attachCore(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachCore(element) {
  attachAria(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachAria(element) {
  AriaTab.attach(element);
  iterateArrayLike(element.getElementsByClassName('mdw-bottomnav__icon'),
    el => el.setAttribute('aria-hidden', 'true'));
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachAria(element) {
  AriaTab.attach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachCore(element) {
  AriaTab.detach(element);
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
