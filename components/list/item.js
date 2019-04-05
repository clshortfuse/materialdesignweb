import * as ListContent from './content';
import { iterateArrayLike } from '../../core/dom';

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attach(listItemElement) {
  iterateArrayLike(listItemElement.getElementsByClassName('mdw-list__content'), ListContent.attach);
  attachCore(listItemElement);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function attachCore(listItemElement) {
  setupAria(listItemElement);
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function setupAria(listItemElement) {
  if (!listItemElement.hasAttribute('role')) {
    listItemElement.setAttribute('role', 'none');
  }
}

/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detachCore(listItemElement) {
}


/**
 * @param {Element} listItemElement
 * @return {void}
 */
export function detach(listItemElement) {
  detachCore(listItemElement);
  iterateArrayLike(listItemElement.getElementsByClassName('mdw-list__content'), ListContent.detach);
}
