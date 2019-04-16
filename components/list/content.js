import { iterateArrayLike, dispatchDomEvent } from '../../core/dom';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';

export const ACTIVATE_EVENT = 'mdw:listcontent-activate';

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function attach(listContentElement) {
  attachCore(listContentElement);
  if (!listContentElement.hasAttribute('mdw-no-overlay')) {
    listContentElement.classList.add('mdw-overlay');
    Overlay.attach(listContentElement);
  }
  if (!listContentElement.hasAttribute('mdw-no-ripple')) {
    listContentElement.classList.add('mdw-ripple');
    Ripple.attach(listContentElement);
  }
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    return;
  }
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  console.log(document.activeElement);
  if (document.activeElement !== event.currentTarget) {
    return;
  }
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (!element) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  element.dispatchEvent(newEvent);
}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function attachCore(listContentElement) {
  if (!listContentElement.hasAttribute('role')) {
    if (listContentElement.parentElement.getAttribute('role') === 'none') {
      listContentElement.setAttribute('role', 'option');
    }
  }
  iterateArrayLike(listContentElement.getElementsByClassName('mdw-list__icon'), (el) => {
    el.setAttribute('aria-hidden', 'true');
  });
  iterateArrayLike(listContentElement.getElementsByClassName('mdw-list__avatar'), (el) => {
    el.setAttribute('aria-hidden', 'true');
  });
  listContentElement.addEventListener('click', onClick);
  listContentElement.addEventListener('keydown', onKeyDown);
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  event.preventDefault();
  /** @type {HTMLElement} */
  const listContentElement = (event.currentTarget);
  dispatchDomEvent(listContentElement, ACTIVATE_EVENT);
}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function detachCore(listContentElement) {
  listContentElement.removeEventListener('click', onClick);
  listContentElement.removeEventListener('keydown', onKeyDown);
}

/**
 * @param {Element} listContentElement
 * @return {void}
 */
export function detach(listContentElement) {
  detachCore(listContentElement);
  Ripple.detach(listContentElement);
  Overlay.detach(listContentElement);
}
