// https://www.w3.org/TR/wai-aria-1.1/#tab

import * as Keyboard from './keyboard';
import * as Attributes from './attributes';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('role', 'tab');
  element.setAttribute('mdw-aria-tab-js', '');
  element.addEventListener('keydown', onKeyDown);
  Keyboard.attach(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  Keyboard.detach(element);
  element.removeEventListener('keydown', onKeyDown);
  element.removeAttribute('mdw-aria-tab-js');
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} successful
 */
export function setSelected(element, value, dispatchEventName) {
  if (Attributes.setSelected(element, value, dispatchEventName)) {
    Attributes.setCurrent(element, value);
    return true;
  }
  return false;
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
