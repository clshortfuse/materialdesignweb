import * as Keyboard from '../../core/aria/keyboard';
import { dispatchDomEvent } from '../../core/dom';

export const CLICK_EVENT = 'mdw:selectioninput-click';
export const FOCUS_EVENT = 'mdw:selectioninput-focus';

/**
 * @param {HTMLElement} element
 * @return {void}
 */
export function attach(element) {
  Keyboard.attach(element);
  element.addEventListener(Keyboard.SPACEBAR_KEY, onSpacebarKey);
  element.addEventListener('click', onClick);
  element.addEventListener('focus', onFocus);
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onSpacebarKey(event) {
  if (event.target instanceof HTMLInputElement) {
    // Don't pass up Spacebar on native input elements
    event.stopPropagation();
  }
}


/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onClick(event) {
  event.stopPropagation();
  dispatchDomEvent(/** @type {HTMLElement} */(event.target), CLICK_EVENT);
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
function onFocus(event) {
  dispatchDomEvent(/** @type {HTMLElement} */(event.target), FOCUS_EVENT);
}

/**
 * @param {HTMLElement} element
 * @return {void}
 */
export function detach(element) {
  Keyboard.detach(element);
}
