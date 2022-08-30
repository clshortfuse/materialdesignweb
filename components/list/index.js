// https://www.w3.org/TR/wai-aria-practices/#Listbox
// https://www.w3.org/TR/wai-aria-practices/#TreeView
// https://www.w3.org/TR/wai-aria-practices/examples/landmarks/navigation.html

import * as Attributes from '../../core/aria/attributes.js';
import * as Keyboard from '../../core/aria/keyboard.js';
import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';

import * as ListContent from './content.js';
import * as ListItem from './item.js';

/**
 * @param {Event} event
 * @return {void}
 */
function onContentFocusEvent(event) {
  const listElement = /** @type {HTMLElement} */ (event.currentTarget);
  const onFocusInteraction = listElement.getAttribute('mdw-on-focus');
  if (!onFocusInteraction) {
    return;
  }
  const listContentElement = /** @type {HTMLElement} */ (event.target);
  if (Attributes.isDisabled(listContentElement)) {
    return;
  }
  for (const interaction of onFocusInteraction.split(' ')) {
    switch (interaction) {
      case 'select':
        ListContent.setSelected(listContentElement, true);
        break;
      default:
    }
  }
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onSelectedChangeEvent(event) {
  const listElement = /** @type {HTMLElement} */ (event.currentTarget);
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
  if (event.detail.value === 'false') {
    // Item is radio-like and cannot be unselected
    if (listElement.getAttribute('aria-required') === 'true'
      && listElement.getAttribute('aria-multiselectable') !== 'true') {
      event.stopPropagation();
      event.preventDefault();
    }
    return;
  }
  const itemElement = /** @type {HTMLElement} */ (event.target);
  if (listElement.getAttribute('aria-multiselectable') !== 'true') {
    // Item is radio-like and must uncheck others
    setTimeout(() => {
      // Wait to see if event is cancelled
      if (event.defaultPrevented) {
        return;
      }
      const role = itemElement.getAttribute('role');
      for (const item of listElement.querySelectorAll(`[role="${role}"][aria-selected="true"]`)) {
        if (item !== itemElement) {
          item.setAttribute('aria-selected', 'false');
        }
      }
    });
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  event.stopPropagation();
  const listElement = /** @type {HTMLElement} */ (event.currentTarget);
  const currentItem = /** @type {HTMLElement} */ (event.target);
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
 * @param {CustomEvent} event
 * @return {void}
 */
function onDownArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const listElement = /** @type {HTMLElement} */ (event.currentTarget);
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
 * @param {CustomEvent} event
 * @return {void}
 */
function onUpArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const listElement = /** @type {HTMLElement} */ (event.currentTarget);
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
 * @param {string} role
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
export function attach(listElement) {
  let role = listElement.getAttribute('role');
  if (!role) {
    let newRole = 'listbox';
    const parentRole = listElement.parentElement && listElement.parentElement.getAttribute('role');
    if (parentRole === 'treeitem') {
      newRole = 'group';
    } else {
      for (const child of listElement.children) {
        if (child.hasAttribute('aria-expanded') && child.classList.contains('mdw-list__item')) {
          newRole = 'tree';
          break;
        }
      }
    }
    listElement.setAttribute('role', newRole);
    role = newRole;
  }

  setupAria(listElement, role);
  for (const child of listElement.children) {
    if (child.classList.contains('mdw-list__item')) {
      ListItem.attach(child);
    }
  }
  for (const el of listElement.getElementsByClassName('mdw-list')) {
    attach(el);
  }
  if (listElement.hasAttribute('mdw-list-js')) {
    return;
  }
  if (role !== 'listbox' && role !== 'tree' && role !== 'radiogroup') {
    return;
  }

  switch (role) {
    case 'tree':
      RovingTabIndex.setupTabIndexes(listElement.querySelectorAll('[role="treeitem"]'));
      break;
    case 'listbox':
      RovingTabIndex.setupTabIndexes(listElement.querySelectorAll('[role="option"]'));
      break;
    case 'radiogroup':
      RovingTabIndex.setupTabIndexes(listElement.querySelectorAll('[role="radio"]'));
      break;
    default:
      return;
  }

  listElement.addEventListener(Keyboard.DOWN_ARROW_KEY, onDownArrowKey);
  listElement.addEventListener(Keyboard.UP_ARROW_KEY, onUpArrowKey);
  listElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  listElement.addEventListener(ListContent.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  listElement.addEventListener(ListContent.FOCUS_EVENT, onContentFocusEvent);
  listElement.setAttribute('mdw-list-js', '');
}

/**
 * @param {Element|Document} [root=document]
 * @return {void}
 */
export function attachAll(root = document) {
  for (const el of root.getElementsByClassName('mdw-list')) attach(el);
}

/**
 * @param {Element} listElement
 * @return {void}
 */
export function detach(listElement) {
  for (const child of listElement.children) {
    if (child.classList.contains('mdw-list__item')) {
      ListItem.detach(child);
    }
  }
  const elements = listElement.querySelectorAll(`[role="${listElement.getAttribute('role') === 'tree' ? 'treeitem' : 'option'}"]`);
  for (const element of elements) {
    RovingTabIndex.detach(element);
  }
  listElement.removeEventListener(ListContent.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  listElement.removeEventListener(Keyboard.DOWN_ARROW_KEY, onDownArrowKey);
  listElement.removeEventListener(Keyboard.UP_ARROW_KEY, onUpArrowKey);
  listElement.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  listElement.removeAttribute('mdw-list-js');
}
