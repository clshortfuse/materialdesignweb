// https://www.w3.org/TR/wai-aria-practices/#button

import * as Attributes from './attributes.js';

/**
 * @param {KeyboardEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  if (!this) {
    return;
  }
  if (this.getAttribute('aria-disabled') === 'true') {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  this.dispatchEvent(newEvent);
}

/**
 * @param {MouseEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onClick(event) {
  if (event.button != null && event.button !== 0) return;
  if (!this) {
    return;
  }
  if (this.getAttribute('aria-disabled') === 'true') {
    return;
  }
  switch (this.getAttribute('aria-pressed')) {
    case 'true':
      Attributes.setPressed(this, 'false', Attributes.ARIA_PRESSED_EVENT);
      break;
    case 'false':
      Attributes.setPressed(this, 'true', Attributes.ARIA_PRESSED_EVENT);
      break;
    default:
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  if (element.hasAttribute('role') && element.getAttribute('role') !== 'button') return;
  element.setAttribute('role', 'button');
  if (!(element instanceof HTMLButtonElement)
      && !element.hasAttribute('tabindex') && element.getAttribute('aria-disabled') !== 'true') {
    element.setAttribute('tabindex', '0');
  }
  if (!(element instanceof HTMLButtonElement)
    && !(element instanceof HTMLInputElement)) {
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
