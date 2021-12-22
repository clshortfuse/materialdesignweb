import {
  dispatchDomEvent,
} from '../../core/dom.js';

export const CLICK_EVENT = 'mdw:selectioninput-click';
export const FOCUS_EVENT = 'mdw:selectioninput-focus';

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.target instanceof HTMLInputElement) {
    if (event.key === ' ' || event.key === 'Spacebar') {
      // Don't pass up Spacebar on native input elements
      event.stopPropagation();
    }
  }
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onClick(event) {
  event.stopPropagation();
  dispatchDomEvent(/** @type {HTMLElement} */ (event.target), CLICK_EVENT);
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
function onFocus(event) {
  dispatchDomEvent(/** @type {HTMLElement} */ (event.target), FOCUS_EVENT);
}

/**
 * @param {HTMLElement} element
 * @return {void}
 */
export function attach(element) {
  element.addEventListener('keydown', onKeyDown);
  element.addEventListener('click', onClick);
  element.addEventListener('focus', onFocus);
}

/**
 * @param {HTMLElement} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('keydown', onKeyDown);
  element.removeEventListener('click', onClick);
  element.removeEventListener('focus', onFocus);
}
