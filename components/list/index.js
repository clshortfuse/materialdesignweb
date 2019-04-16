// https://www.w3.org/TR/wai-aria-practices/#Listbox
// https://www.w3.org/TR/wai-aria-practices/#TreeView
// https://www.w3.org/TR/wai-aria-practices/examples/landmarks/navigation.html

import { iterateArrayLike } from '../../core/dom';
import * as RovingTabIndex from '../../core/aria/rovingtabindex';

import * as ListItem from './item';
import * as ListItemGroup from './itemgroup';

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
  listElement.classList.add('mdw-overlay__group');

  const hasExpanders = listElement.querySelector('mdw-list__item[aria-expanded]') == null;
  const defaultRole = (hasExpanders ? 'tree' : 'listbox');
  const role = listElement.getAttribute('role') || defaultRole;

  iterateArrayLike(listElement.getElementsByClassName('mdw-list__content'), (content) => {
    if (!content.hasAttribute('role')) {
      switch (role) {
        default:
        case 'tree':
          if (content.parentElement.hasAttribute('aria-expanded')) {
            content.setAttribute('role', 'none');
          } else {
            content.setAttribute('role', 'treeitem');
          }
          break;
        case 'listbox':
          content.setAttribute('role', 'option');
          break;
        case 'list':
          if (content instanceof HTMLAnchorElement) {
            content.setAttribute('role', 'link');
          } else {
            content.setAttribute('role', 'listitem');
          }
          break;
      }
    }
  });
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.attach);
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item-group'), ListItemGroup.attach);
  setupAria(listElement, defaultRole);
  if (role !== 'listbox' && role !== 'tree') {
    return;
  }
  RovingTabIndex.setupTabIndexes(listElement, `[role="${role === 'tree' ? 'treeitem' : 'option'}"]`);
  listElement.addEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  listElement.addEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  listElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const currentItem = (event.target);
  RovingTabIndex.removeTabIndex(
    listElement.querySelectorAll(`[role="${listElement.getAttribute('role') === 'tree' ? 'treeitem' : 'option'}"]`),
    [currentItem]
  );
}
/**
 * @param {Event} event
 * @return {void}
 */
function onForwardsRequested(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  RovingTabIndex.selectNext(
    listElement.querySelectorAll(`[role="${listElement.getAttribute('role') === 'tree' ? 'treeitem' : 'option'}"]`)
  );
}

/**
 * @param {Event} event
 * @return {void}
 */
function onBackwardsRequested(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  RovingTabIndex.selectPrevious(
    listElement.querySelectorAll(`[role="${listElement.getAttribute('role') === 'tree' ? 'treeitem' : 'option'}"]`)
  );
}

/**
 * @param {Element} listElement
 * @param {'listbox'|'tree'|'list'} role
 * @return {void}
 */
export function setupAria(listElement, role = 'tree') {
  if (!listElement.hasAttribute('role')) {
    listElement.setAttribute('role', role);
  }
  listElement.setAttribute('aria-orientation', 'vertical');
  if (!listElement.hasAttribute('aria-multiselectable')) {
    listElement.setAttribute('aria-multiselectable', 'false');
  }
}

/**
 * @param {Element} listElement
 * @return {void}
 */
export function detach(listElement) {
  iterateArrayLike(listElement.getElementsByClassName('mdw-list__item'), ListItem.detach);
}
