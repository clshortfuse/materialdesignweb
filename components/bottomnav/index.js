// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import * as Keyboard from '../../core/aria/keyboard.js';
import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';
import { iterateArrayLike } from '../../core/dom.js';

import * as BottomNavItem from './item.js';

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const bottomnavElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const currentItem = (event.target);
  RovingTabIndex.removeTabIndex(bottomnavElement.querySelectorAll('[role="tab"]'), [currentItem]);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onForwardsRequested(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  /** @type {HTMLElement} */
  const bottomnavElement = (event.currentTarget);
  RovingTabIndex.selectNext(bottomnavElement.querySelectorAll('[role="tab"]'));
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onBackwardsRequested(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  /** @type {HTMLElement} */
  const bottomnavElement = (event.currentTarget);
  RovingTabIndex.selectPrevious(bottomnavElement.querySelectorAll('[role="tab"]'));
}

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function setupARIA(bottomnavElement) {
  bottomnavElement.setAttribute('role', 'tablist');
  bottomnavElement.setAttribute('aria-multiselectable', 'false');
  bottomnavElement.setAttribute('aria-orientation', 'horizontal');
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onSelectedChangeEvent(event) {
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  if (event.detail.value !== 'true') {
    return;
  }
  /** @type {HTMLElement} */
  const bottomnavElement = (event.currentTarget);
  iterateArrayLike(bottomnavElement.querySelectorAll('[role="tab"]'), (item) => {
    if (item !== itemElement) {
      BottomNavItem.setSelected(item, false);
    }
  });
}

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function attach(bottomnavElement) {
  setupARIA(bottomnavElement);
  /** @type {Element} */
  let selectedItem;
  const items = bottomnavElement.getElementsByClassName('mdw-bottomnav__item');

  iterateArrayLike(items, (item) => {
    BottomNavItem.attach(item);
    if (!selectedItem && item.getAttribute('aria-selected') === 'true') {
      selectedItem = item;
    }
  });
  if (!selectedItem) {
    selectedItem = items[0];
  }
  if (selectedItem) {
    BottomNavItem.setSelected(selectedItem, true, true);
  }
  RovingTabIndex.setupTabIndexes(bottomnavElement.querySelectorAll('[role="tab"]'));
  bottomnavElement.addEventListener(BottomNavItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  bottomnavElement.addEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardsRequested);
  bottomnavElement.addEventListener(Keyboard.BACK_ARROW_KEY, onBackwardsRequested);
  bottomnavElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function detach(bottomnavElement) {
  bottomnavElement.removeEventListener(BottomNavItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  bottomnavElement.removeEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardsRequested);
  bottomnavElement.removeEventListener(Keyboard.BACK_ARROW_KEY, onBackwardsRequested);
  bottomnavElement.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'), BottomNavItem.detach);
}
