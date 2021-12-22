import * as Attributes from '../../core/aria/attributes.js';
import * as Keyboard from '../../core/aria/keyboard.js';

import * as SelectionInput from './input.js';

export const CHECKED_CHANGE_EVENT = 'mdw:selection-checkedchange';

/**
 * @param {Element} selectionElement
 * @param {boolean|string} newValue
 * @param {boolean} [dispatchEvent=false]
 * @return {boolean} successful
 */
export function setChecked(selectionElement, newValue, dispatchEvent) {
  return Attributes.setChecked(
    selectionElement,
    newValue,
    dispatchEvent ? CHECKED_CHANGE_EVENT : null,
  );
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onActivateEvent(event) {
  if (event.target instanceof HTMLInputElement) {
    return;
  }
  if (event.type === Keyboard.SPACEBAR_KEY) {
    event.stopPropagation();
    event.preventDefault();
  }
  /** @type {HTMLElement} */
  const selectionElement = (event.currentTarget);
  if (Attributes.isDisabled(selectionElement)) {
    return;
  }
  if (Attributes.isReadonly(selectionElement)) {
    return;
  }
  if (!selectionElement.hasAttribute('aria-checked')) {
    return;
  }
  if (event.type === 'click' || event.type === SelectionInput.CLICK_EVENT) {
    if (selectionElement.hasAttribute('mdw-no-autocheck')) {
      return;
    }
  }
  const role = selectionElement.getAttribute('role');
  if (event.type === 'focus' || event.type === SelectionInput.FOCUS_EVENT) {
    if (role !== 'radio') {
      return;
    }
  }
  const newValue = (role === 'radio' ? true : !Attributes.isChecked(selectionElement));
  setChecked(selectionElement, newValue, true);
}

/**
 * @param {HTMLElement} element
 * @return {void}
 */
export function attach(element) {
  /** @type {HTMLElement} */
  const inputElement = (element.getElementsByClassName('mdw-selection__input')[0]);
  if (inputElement) {
    SelectionInput.attach(inputElement);
  }
  Keyboard.attach(element);
  element.addEventListener('focus', onActivateEvent);
  element.addEventListener('click', onActivateEvent);
  element.addEventListener(Keyboard.SPACEBAR_KEY, onActivateEvent);
  element.addEventListener(SelectionInput.FOCUS_EVENT, onActivateEvent);
  element.addEventListener(SelectionInput.CLICK_EVENT, onActivateEvent);
}
