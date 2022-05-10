import * as Selection from './index.js';

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onCheckedChange(event) {
  if (event.detail.value === 'false') {
    return;
  }
  const radiogroupElement = /** @type {HTMLElement} */ (event.currentTarget);
  const itemElement = /** @type {HTMLElement} */ (event.target);
  setTimeout(() => {
    // Wait to see if event is cancelled
    if (event.defaultPrevented) {
      return;
    }
    for (const item of radiogroupElement.querySelectorAll('[role="radio"][aria-checked="true"]')) {
      if (item !== itemElement) {
        item.setAttribute('aria-checked', 'false');
      }
    }
  });
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.addEventListener(Selection.CHECKED_CHANGE_EVENT, onCheckedChange);
}

/**
 * @param {HTMLElement} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener(Selection.CHECKED_CHANGE_EVENT, onCheckedChange);
}
