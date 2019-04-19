// https://www.w3.org/TR/wai-aria-practices/#Listbox
// https://www.w3.org/TR/wai-aria-practices/#TreeView
// https://www.w3.org/TR/wai-aria-practices/examples/landmarks/navigation.html

import { iterateArrayLike, iterateSomeOfArrayLike } from '../../core/dom';
import * as RovingTabIndex from '../../core/aria/rovingtabindex';

import * as ListItem from './item';
import * as ListContent from './content';

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

  let role = listElement.getAttribute('role');
  if (!role) {
    let newRole = 'listbox';
    const parentRole = listElement.parentElement && listElement.parentElement.getAttribute('role');
    if (parentRole === 'treeitem') {
      newRole = 'group';
    } else if (iterateSomeOfArrayLike(listElement.children,
      child => child.hasAttribute('aria-expanded') && child.classList.contains('mdw-list__item'))) {
      newRole = 'tree';
    }
    listElement.setAttribute('role', newRole);
    role = newRole;
  }

  setupAria(listElement, role);
  iterateArrayLike(listElement.children, (child) => {
    if (child.classList.contains('mdw-list__item')) {
      ListItem.attach(child);
    }
  });
  iterateArrayLike(listElement.getElementsByClassName('mdw-list'), attach);
  if (listElement.hasAttribute('mdw-list-js')) {
    return;
  }
  if (role !== 'listbox' && role !== 'tree' && role !== 'radiogroup') {
    return;
  }

  switch (role) {
    case 'tree':
      RovingTabIndex.setupTabIndexes(listElement, listElement.querySelectorAll('[role="treeitem"]'));
      break;
    case 'listbox':
      RovingTabIndex.setupTabIndexes(listElement, listElement.querySelectorAll('[role="option"]'));
      break;
    case 'radiogroup':
      RovingTabIndex.setupTabIndexes(listElement, listElement.querySelectorAll('[role="radio"]'));
      break;
    default:
      return;
  }

  listElement.addEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  listElement.addEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  listElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  listElement.addEventListener(ListContent.SELECT_CHANGE_EVENT, onSelectChangeEvent);
  listElement.addEventListener(ListContent.CHECK_CHANGE_EVENT, onCheckChangeEvent);
  listElement.setAttribute('mdw-list-js', '');
}

/**
 * @param {Event} event
 * @return {void}
 */
function onSelectChangeEvent(event) {
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  // List is readonly
  if (listElement.getAttribute('aria-readonly') === 'true') {
    event.stopPropagation();
    event.preventDefault();
    return;
  }
  const listElementRole = listElement.getAttribute('role');
  if (listElementRole !== 'listbox' && listElementRole !== 'tree') {
    // Bubble up
    return;
  }
  const { detail } = event;
  if (detail.value === 'false') {
    // Item is radio-like and cannot be unselected
    if (listElement.getAttribute('aria-required') === 'true'
      && listElement.getAttribute('aria-multiselectable') !== 'true') {
      event.stopPropagation();
      event.preventDefault();
    }
    return;
  }
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  if (listElement.getAttribute('aria-multiselectable') !== 'true') {
    // Item is radio-like and must uncheck others
    setTimeout(() => {
      // Wait to see if event is cancelled
      if (event.defaultPrevented) {
        return;
      }
      const role = itemElement.getAttribute('role');
      iterateArrayLike(listElement.querySelectorAll(`[role="${role}"][aria-selected="true"]`),
        (item) => {
          if (item === itemElement) {
            return;
          }
          item.setAttribute('aria-selected', 'false');
        });
    });
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
function onCheckChangeEvent(event) {
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  if (listElement.getAttribute('aria-readonly') === 'true') {
    event.stopPropagation();
    event.preventDefault();
    return;
  }
  const listElementRole = listElement.getAttribute('role');
  if (listElementRole !== 'radiogroup') {
    // Bubble up
    return;
  }

  const { detail } = event;
  if (detail.value === 'false') {
    return;
  }
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  setTimeout(() => {
    // Wait to see if event is cancelled
    if (event.defaultPrevented) {
      return;
    }
    iterateArrayLike(listElement.querySelectorAll('[role="radio"][aria-checked="true"]'),
      (item) => {
        if (item === itemElement) {
          return;
        }
        item.setAttribute('aria-checked', 'false');
      });
  });
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
  switch (listElement.getAttribute('role')) {
    case 'tree':
      RovingTabIndex.removeTabIndex(listElement.querySelectorAll('[role="treeitem"]'), [currentItem]);
      break;
    case 'listbox':
      RovingTabIndex.removeTabIndex(listElement.querySelectorAll('[role="option"]'), [currentItem]);
      break;
    case 'radiogroup':
      RovingTabIndex.removeTabIndex(listElement.querySelectorAll('[role="radio"]'), [currentItem]);
      break;
    default:
  }
}
/**
 * @param {Event} event
 * @return {void}
 */
function onForwardsRequested(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  switch (listElement.getAttribute('role')) {
    case 'tree':
      RovingTabIndex.selectNext(listElement.querySelectorAll('[role="treeitem"]'));
      break;
    case 'listbox':
      RovingTabIndex.selectNext(listElement.querySelectorAll('[role="option"]'));
      break;
    case 'radiogroup':
      RovingTabIndex.selectNext(listElement.querySelectorAll('[role="radio"]'));
      break;
    default:
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
function onBackwardsRequested(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const listElement = (event.currentTarget);
  switch (listElement.getAttribute('role')) {
    case 'tree':
      RovingTabIndex.selectPrevious(listElement.querySelectorAll('[role="treeitem"]'));
      break;
    case 'listbox':
      RovingTabIndex.selectPrevious(listElement.querySelectorAll('[role="option"]'));
      break;
    case 'radiogroup':
      RovingTabIndex.selectPrevious(listElement.querySelectorAll('[role="radio"]'));
      break;
    default:
  }
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
  iterateArrayLike(listElement.children, (child) => {
    if (child.classList.contains('mdw-list__item')) {
      ListItem.detach(child);
    }
  });
  RovingTabIndex.detach(
    listElement,
    listElement.querySelectorAll(`[role="${listElement.getAttribute('role') === 'tree' ? 'treeitem' : 'option'}"]`)
  );
  listElement.removeEventListener(ListContent.SELECT_CHANGE_EVENT, onSelectChangeEvent);
  listElement.removeEventListener(ListContent.CHECK_CHANGE_EVENT, onCheckChangeEvent);
  listElement.removeEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  listElement.removeEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  listElement.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  listElement.removeAttribute('mdw-list-js');
}
