import * as ListContent from './content';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';
import { dispatchDomEvent, iterateArrayLike } from '../../core/dom';

export const ACTIVATE_EVENT = 'mdw:listitem-activate';

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attach(listItemElement) {
  iterateArrayLike(listItemElement.getElementsByClassName('mdw-list__content'), ListContent.attach);
  if (listItemElement.getAttribute('role') === 'option') {
    if (!listItemElement.hasAttribute('mdw-no-overlay')) {
      listItemElement.classList.add('mdw-overlay');
      Overlay.attach(listItemElement);
    }
    if (!listItemElement.hasAttribute('mdw-no-ripple')) {
      listItemElement.classList.add('mdw-ripple');
      Ripple.attach(listItemElement);
    }
  }
  attachCore(listItemElement);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attachCore(listItemElement) {
  if (!listItemElement.hasAttribute('role')) {
    listItemElement.setAttribute('role', 'listitem');
  }
  listItemElement.addEventListener('click', onClick);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detachCore(listItemElement) {
  listItemElement.removeEventListener('click', onClick);
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  /** @type {HTMLElement} */
  const listItemElement = (event.currentTarget);
  dispatchDomEvent(listItemElement, ACTIVATE_EVENT);
}


/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detach(listItemElement) {
  detachCore(listItemElement);
  iterateArrayLike(listItemElement.getElementsByClassName('mdw-list__content'), ListContent.detach);
}
