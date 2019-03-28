// https://www.w3.org/TR/wai-aria-practices/#button

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('role', 'button');
  if (element instanceof HTMLButtonElement === false
      && element instanceof HTMLAnchorElement === false
      && !element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
  element.setAttribute('mdw-aria-button-js', '');
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
  element.removeAttribute('mdw-aria-button-js');
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  /** @type {HTMLElement} */
  const buttonElement = (event.currentTarget);
  if (!buttonElement) {
    return;
  }
  if (buttonElement.getAttribute('aria-disabled') === 'true') {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  buttonElement.dispatchEvent(newEvent);
}
