// https://www.w3.org/TR/wai-aria-practices/#Listbox

import { iterateArrayLike } from '../../core/dom';

import * as ListItem from './item';
import * as ListExpander from './expander';

/**
 * @param {Element|Document} [root=document]
 * @return {void}
 */
export function attachAll(root = document) {
  iterateArrayLike(root.getElementsByClassName('mdw-list'), attach);
}

/**
 * @param {Element} listElement
 * @return {void}
 */
export function attach(listElement) {
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.attach);
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__expander'), ListExpander.attach);
  setupAria(listElement);
}

/**
 * @param {Element} listElement
 * @return {void}
 */
export function setupAria(listElement) {
  if (!listElement.hasAttribute('role')) {
    listElement.setAttribute('role', 'list');
  }
  // listElement.setAttribute('aria-orientation', 'vertical');
}

/**
 * @param {Element} listElement
 * @return {void}
 */
export function detach(listElement) {
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.detach);
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__expander'), ListExpander.detach);
}
