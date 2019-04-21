// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import { iterateArrayLike } from '../../core/dom';

import * as RovingTabIndex from '../../core/aria/rovingtabindex';
import * as BottomNavItem from './item';

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function attach(bottomnavElement) {
  setupARIA(bottomnavElement);
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
  bottomnavElement.addEventListener(BottomNavItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  bottomnavElement.addEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  bottomnavElement.addEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  bottomnavElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

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
 * @param {Event} event
 * @return {void}
 */
function onForwardsRequested(event) {
  event.stopPropagation();
  /** @type {HTMLElement} */
  const bottomnavElement = (event.currentTarget);
  RovingTabIndex.selectNext(bottomnavElement.querySelectorAll('[role="tab"]'));
}

/**
 * @param {Event} event
 * @return {void}
 */
function onBackwardsRequested(event) {
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
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function detach(bottomnavElement) {
  bottomnavElement.removeEventListener(BottomNavItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  bottomnavElement.removeEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  bottomnavElement.removeEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  bottomnavElement.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'), BottomNavItem.detach);
}

/**
 * @param {Event} event
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
