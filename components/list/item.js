import * as Ripple from '../ripple/index';

import { dispatchDomEvent } from '../common/dom';

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attach(listItemElement) {
  Ripple.attach(listItemElement);
  listItemElement.addEventListener('click', onClick);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detach(listItemElement) {
  listItemElement.removeEventListener('click', onClick);
  Ripple.detach(listItemElement);
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  /** @type {HTMLElement} */
  const listItemElement = (event.currentTarget);
  dispatchDomEvent(listItemElement, 'mdw:itemactivated');
}
