import { dispatchDomEvent, getPassiveEventListenerOption } from '../../core/dom.js';

export const SECONDARY_ACTION_EVENT = 'mdw:listsecondary-action';

/**
 * @param {Event} event
 * @return {void}
 */
export function onInteraction(event) {
  event.stopPropagation();
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const listSecondaryElement = (event.currentTarget);
  dispatchDomEvent(listSecondaryElement, SECONDARY_ACTION_EVENT);
}

/**
 * @param {Element} listSecondaryElement
 * @return {void}
 */
export function attach(listSecondaryElement) {
  if (!listSecondaryElement.hasAttribute('mdw-action')) {
    return;
  }
  listSecondaryElement.addEventListener('click', onClick);
  listSecondaryElement.addEventListener('mousedown', onInteraction, getPassiveEventListenerOption());
  listSecondaryElement.addEventListener('touchstart', onInteraction, getPassiveEventListenerOption());
  listSecondaryElement.addEventListener('keydown', onInteraction, getPassiveEventListenerOption());
}
/**
 * @param {Element} listSecondaryElement
 * @return {void}
 */
export function detach(listSecondaryElement) {
  listSecondaryElement.removeEventListener('click', onClick);
  listSecondaryElement.removeEventListener('mousedown', onInteraction, getPassiveEventListenerOption());
  listSecondaryElement.removeEventListener('touchstart', onInteraction, getPassiveEventListenerOption());
  listSecondaryElement.removeEventListener('keydown', onInteraction, getPassiveEventListenerOption());
}
