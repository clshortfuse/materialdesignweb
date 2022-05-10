// https://www.w3.org/TR/wai-aria-1.1/#tab

import * as AriaTab from '../../core/aria/tab.js';
import * as Overlay from '../../core/overlay/index.js';
import * as Ripple from '../../core/ripple/index.js';

export const SELECTED_CHANGE_EVENT = 'mdw:bottomnavitem-selectedchange';

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {boolean} [dispatchEvent=true]
 * @return {boolean} successful
 */
export function setSelected(element, value, dispatchEvent = true) {
  return AriaTab.setSelected(element, value, dispatchEvent ? SELECTED_CHANGE_EVENT : null);
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onClick(event) {
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (element.getAttribute('aria-disabled') === 'true') {
    return;
  }
  setSelected(element, true);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachAria(element) {
  AriaTab.attach(element);
  for (const el of element.getElementsByClassName('mdw-bottomnav__icon')) {
    el.setAttribute('aria-hidden', 'true');
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachCore(element) {
  attachAria(element);
  element.addEventListener('click', onClick);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-overlay');
  if (!element.hasAttribute('mdw-overlay-off')) {
    element.setAttribute('mdw-overlay-off', 'selected activated');
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
export function detachCore(element) {
  AriaTab.detach(element);
  element.removeEventListener('click', onClick);
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
