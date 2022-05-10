import { dispatchDomEvent } from '../../core/dom.js';

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
  const listSecondaryElement = /** @type {HTMLElement} */ (event.currentTarget);
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
  listSecondaryElement.addEventListener('mousedown', onInteraction, { passive: true });
  listSecondaryElement.addEventListener('touchstart', onInteraction, { passive: true });
  listSecondaryElement.addEventListener('keydown', onInteraction, { passive: true });
}
/**
 * @param {Element} listSecondaryElement
 * @return {void}
 */
export function detach(listSecondaryElement) {
  listSecondaryElement.removeEventListener('click', onClick);
  listSecondaryElement.removeEventListener('mousedown', onInteraction);
  listSecondaryElement.removeEventListener('touchstart', onInteraction);
  listSecondaryElement.removeEventListener('keydown', onInteraction);
}
