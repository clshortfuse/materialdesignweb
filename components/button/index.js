// https://www.w3.org/TR/wai-aria-practices/#button

import * as Ripple from '../ripple/index';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('mdw-js', '');
  Ripple.attach(element);
  if (element instanceof HTMLButtonElement === false
    && element instanceof HTMLInputElement === false) {
    element.addEventListener('keydown', onKeyDown);
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('keydown', onKeyDown);
  element.removeAttribute('mdw-js');
  Ripple.detach(element);
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  const buttonElement = event.currentTarget;
  if (!buttonElement) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  buttonElement.dispatchEvent(newEvent);
}
