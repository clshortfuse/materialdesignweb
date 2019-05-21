import * as Selection from './index';
import { iterateArrayLike } from '../../core/dom';

/**
 * @param {HTMLElement} element
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

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onCheckedChange(event) {
  const { detail } = event;
  if (detail.value === 'false') {
    return;
  }
  /** @type {HTMLElement} */
  const radiogroupElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  setTimeout(() => {
    // Wait to see if event is cancelled
    if (event.defaultPrevented) {
      return;
    }
    iterateArrayLike(radiogroupElement.querySelectorAll('[role="radio"][aria-checked="true"]'),
      (item) => {
        if (item === itemElement) {
          return;
        }
        item.setAttribute('aria-checked', 'false');
      });
  });
}
