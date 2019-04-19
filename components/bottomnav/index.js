// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import { iterateArrayLike } from '../../core/dom';

import * as AriaAttributes from '../../core/aria/attributes';
import * as RovingTabIndex from '../../core/aria/rovingtabindex';
import * as BottomNavItem from './item';

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function attach(bottomnavElement) {
  bottomnavElement.classList.add('mdw-overlay__group');
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'), BottomNavItem.attach);
  bottomnavElement.addEventListener(AriaAttributes.SELECTED_CHANGED_EVENT, onSelectedChangedEvent);
  setupARIA(bottomnavElement);
  RovingTabIndex.setupTabIndexes(bottomnavElement, bottomnavElement.querySelectorAll('[role="tab"]'));
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
  if (bottomnavElement.hasAttribute('mdw-no-aria')) {
    return;
  }
  bottomnavElement.setAttribute('role', 'tablist');
  bottomnavElement.setAttribute('aria-multiselectable', 'false');
  bottomnavElement.setAttribute('aria-orientation', 'horizontal');
}

/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function detach(bottomnavElement) {
  iterateArrayLike(bottomnavElement.getElementsByClassName('mdw-bottomnav__item'), BottomNavItem.detach);
  bottomnavElement.removeEventListener(AriaAttributes.SELECTED_CHANGED_EVENT, onSelectedChangedEvent);
  RovingTabIndex.detach(bottomnavElement, bottomnavElement.querySelectorAll('[role="tab"]'));
  bottomnavElement.removeEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  bottomnavElement.removeEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  bottomnavElement.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}


/**
 * @param {Element} bottomnavElement
 * @return {void}
 */
export function removeSelection(bottomnavElement) {
  return iterateArrayLike(
    bottomnavElement.querySelectorAll('mdw-bottomnav__item[aria-selected="true"]'),
    item => item.setAttribute('aria-selected', 'false')
  );
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onSelectedChangedEvent(event) {
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  if (itemElement.getAttribute('aria-selected') !== 'true') {
    return;
  }
  /** @type {HTMLElement} */
  const bottomnavElement = (event.currentTarget);
  iterateArrayLike(bottomnavElement.querySelectorAll('[role="tab"]'), (item) => {
    if (item !== itemElement) {
      item.setAttribute('aria-selected', 'false');
    }
  });
}
