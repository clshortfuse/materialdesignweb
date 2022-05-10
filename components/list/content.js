import * as Attributes from '../../core/aria/attributes.js';
import * as Keyboard from '../../core/aria/keyboard.js';
import { dispatchDomEvent } from '../../core/dom.js';
import * as Overlay from '../../core/overlay/index.js';
import * as Ripple from '../../core/ripple/index.js';

import * as ListSecondary from './secondary.js';

export const ACTIVATE_EVENT = 'mdw:listcontent-activate';
export const SELECTED_CHANGE_EVENT = 'mdw:listcontent-selectedchange';
export const FOCUS_EVENT = 'mdw:listcontent-focus';

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onEnterKey(event) {
  if (event.detail.ctrlKey || event.detail.shiftKey
    || event.detail.altKey || event.detail.metaKey) {
    return;
  }
  const listContentElement = /** @type {HTMLElement} */ (event.currentTarget);
  if (!listContentElement) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();

  // Slightly redundant, but performs ripple
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  listContentElement.dispatchEvent(newEvent);
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  event.preventDefault();
  const listContentElement = /** @type {HTMLElement} */ (event.currentTarget);
  if (Attributes.isDisabled(listContentElement)) {
    return;
  }
  dispatchDomEvent(listContentElement, ACTIVATE_EVENT);
}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function attach(listContentElement) {
  if (!listContentElement.hasAttribute('role') && listContentElement.parentElement.getAttribute('role') === 'none') {
    listContentElement.setAttribute('role', 'option');
  }
  for (const el of listContentElement.getElementsByClassName('mdw-list__icon')) {
    el.setAttribute('aria-hidden', 'true');
  }
  for (const el of listContentElement.getElementsByClassName('mdw-list__avatar')) {
    el.setAttribute('aria-hidden', 'true');
  }
  listContentElement.addEventListener('click', onClick);

  if (!listContentElement.hasAttribute('mdw-no-overlay')) {
    listContentElement.classList.add('mdw-overlay');
    Overlay.attach(listContentElement);
  }
  if (!listContentElement.hasAttribute('mdw-no-ripple')) {
    listContentElement.classList.add('mdw-ripple');
    Ripple.attach(listContentElement);
  }
  if (listContentElement.getAttribute('role') === 'radio'
  && listContentElement.getAttribute('aria-checked') === 'true'
  && listContentElement.getAttribute('tabindex') !== '0') {
    listContentElement.setAttribute('tabindex', '0');
  }
  const secondaryElement = listContentElement.getElementsByClassName('mdw-list__secondary')[0];
  if (secondaryElement) {
    ListSecondary.attach(secondaryElement);
  }
  Keyboard.attach(listContentElement);
  listContentElement.addEventListener(Keyboard.ENTER_KEY, onEnterKey);
}
/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function detach(listContentElement) {
  Keyboard.detach(listContentElement);
  const secondaryElement = listContentElement.getElementsByClassName('mdw-list__secondary')[0];
  if (secondaryElement) {
    ListSecondary.detach(secondaryElement);
  }
  Ripple.detach(listContentElement);
  Overlay.detach(listContentElement);
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {boolean} [dispatchEvent=true]
 * @return {boolean} successful
 */
export function setSelected(element, value, dispatchEvent = true) {
  return Attributes.setSelected(element, value, dispatchEvent ? SELECTED_CHANGE_EVENT : null);
}
