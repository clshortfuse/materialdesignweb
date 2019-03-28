// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import { iterateArrayLike, iterateElementSiblings } from '../../core/dom';

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
  RovingTabIndex.attach(bottomnavElement, 'mdw-bottomnav__item');
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
  RovingTabIndex.detach(bottomnavElement, 'mdw-bottomnav__item');
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
  iterateElementSiblings(itemElement, sibling => sibling.setAttribute('aria-selected', 'false'));
}
