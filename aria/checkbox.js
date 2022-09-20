// https://w3c.github.io/aria-practices/#checkbox

import * as Attributes from './attributes.js';

/**
 * Remap Space as Click
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  const element = /** @type {HTMLElement} */ (event.currentTarget);
  if (!element) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  element.dispatchEvent(newEvent);
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
  const ariaChecked = element.getAttribute('aria-checked');
  if (ariaChecked === 'true') {
    Attributes.setChecked(element, 'false', Attributes.ARIA_CHECKED_EVENT);
  } else {
    Attributes.setChecked(element, 'true', Attributes.ARIA_CHECKED_EVENT);
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  if (element.hasAttribute('role') && element.getAttribute('role') !== 'checkbox') return;
  element.setAttribute('role', 'checkbox');
  if (!element.hasAttribute('tabindex') && element.getAttribute('aria-disabled') !== 'true') {
    element.setAttribute('tabindex', '0');
  }
  if (!(element instanceof HTMLInputElement)) {
    element.addEventListener('keydown', onKeyDown);
  }
  element.addEventListener('click', onClick);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('keydown', onKeyDown);
}
