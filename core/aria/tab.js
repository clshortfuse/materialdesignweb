// https://www.w3.org/TR/wai-aria-1.1/#tab

import { setSelected } from './attributes';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('role', 'tab');
  element.setAttribute('mdw-aria-tab-js', '');
  element.addEventListener('click', onClick);
  element.addEventListener('keydown', onKeyDown);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('keydown', onKeyDown);
  element.removeAttribute('mdw-aria-tab-js');
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onClick(event) {
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (element.getAttribute('aria-disabled') === 'true') {
    return;
  }
  setSelected(element, 'true');
}

/**
 * Remap Space and Enter as Click
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (!element) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  element.dispatchEvent(newEvent);
}
