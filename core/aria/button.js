// https://www.w3.org/TR/wai-aria-practices/#button

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  const buttonElement = /** @type {HTMLElement} */ (event.currentTarget);
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

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onClick(event) {
  if (event.button != null && event.button !== 0) return;
  const buttonElement = /** @type {HTMLElement} */ (event.currentTarget);
  if (!buttonElement) {
    return;
  }
  if (buttonElement.getAttribute('aria-disabled') === 'true') {
    return;
  }
  switch (buttonElement.getAttribute('aria-pressed')) {
    case 'true':
      buttonElement.setAttribute('aria-pressed', 'false');
      break;
    case 'false':
      buttonElement.setAttribute('aria-pressed', 'true');
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
