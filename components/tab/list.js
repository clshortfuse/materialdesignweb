// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import * as Keyboard from '../../core/aria/keyboard.js';
import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';
import { scrollToElement } from '../../core/dom.js';

import * as TabItem from './item.js';

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  const tabListElement = /** @type {HTMLElement} */ (event.currentTarget);
  const currentItem = /** @type {HTMLElement} */ (event.target);
  RovingTabIndex.removeTabIndex(tabListElement.querySelectorAll('[role="tab"]'), [currentItem]);
}
/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onForwardArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const tabListElement = /** @type {HTMLElement} */ (event.currentTarget);
  RovingTabIndex.selectNext(tabListElement.querySelectorAll('[role="tab"]'));
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
function onBackArrowKey(event) {
  if (event.detail.ctrlKey || event.detail.altKey
    || event.detail.shiftKey || event.detail.metaKey) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const tabListElement = /** @type {HTMLElement} */ (event.currentTarget);
  RovingTabIndex.selectPrevious(tabListElement.querySelectorAll('[role="tab"]'));
}

/**
 * @param {Element} tabListElement
 * @return {void}
 */
export function setupARIA(tabListElement) {
  if (tabListElement.hasAttribute('mdw-no-aria')) {
    return;
  }
  tabListElement.setAttribute('role', 'tablist');
  tabListElement.setAttribute('aria-multiselectable', 'false');
  tabListElement.setAttribute('aria-orientation', 'horizontal');
  const indicatorElement = tabListElement.getElementsByClassName('mdw-tab__indicator')[0];
  if (indicatorElement) {
    indicatorElement.setAttribute('role', 'presentation');
  }
}

/**
 * @param {Element} tabListElement
 * @param {Element|number} item element or index
 * @param {number} [percentage=0]
 * @param {boolean} [animate=false]
 * @return {void}
 */
export function setIndicatorPosition(tabListElement, item, percentage, animate = false) {
  const indicatorElement = /** @type {HTMLElement} */ (tabListElement.getElementsByClassName('mdw-tab__indicator')[0]);
  if (!indicatorElement) {
    return;
  }
  const items = (tabListElement.getElementsByClassName('mdw-tab__item'));
  const leftItem = /** @type {HTMLElement} */ (item instanceof Element ? item : items.item(item));
  let left = leftItem.offsetLeft;
  let right = left + leftItem.offsetWidth;

  if (percentage > 0) {
    left += (percentage * leftItem.offsetWidth);
    let nextItem = /** @type {HTMLElement} */ (leftItem.nextElementSibling);
    if (!nextItem.classList.contains('mdw-tab__item')) {
      // RTL
      nextItem = /** @type {HTMLElement} */ (leftItem.previousElementSibling);
    }
    right = nextItem.offsetLeft + (percentage * nextItem.offsetWidth);
  }

  // RTL is inversed
  const width = Math.abs(right - left);
  indicatorElement.style.setProperty('transform', `translateX(${left}px) scaleX(${width / 1000})`);
  if (animate) {
    indicatorElement.setAttribute('mdw-animate', '');
  } else {
    indicatorElement.removeAttribute('mdw-animate');
  }
}

/**
 * @param {HTMLElement} tabListElement
 * @param {HTMLElement} tabItemElement
 * @return {number}
 */
export function getTabItemIndex(tabListElement, tabItemElement) {
  const items = /** @type {HTMLCollectionOf<HTMLElement>} */ (tabListElement.getElementsByClassName('mdw-tab__item'));
  let tabItemIndex = -1;
  [...items].some((el, index) => {
    if (el === tabItemElement) {
      tabItemIndex = index;
      return true;
    }
    return false;
  });
  return tabItemIndex;
}

/**
 * @param {Element} tabListElement
 * @param {number} tabItemIndex
 * @param {boolean} [dispatchEvents=false]
 * @return {void}
 */
export function selectItemAtIndex(tabListElement, tabItemIndex, dispatchEvents = false) {
  const items = /** @type {HTMLCollectionOf<HTMLElement>} */ (tabListElement.getElementsByClassName('mdw-tab__item'));
  if (dispatchEvents) {
    const item = items.item(tabItemIndex);
    if (item) {
      TabItem.setSelected(item, true, true);
    }
    return;
  }
  // eslint-disable-next-line github/array-foreach
  [...items].forEach((el, index) => {
    if (tabItemIndex === index) {
      TabItem.setSelected(el, true, false);
      if (tabListElement.hasAttribute('mdw-scrollable')) {
        scrollToElement(el, true);
      }
    } else {
      TabItem.setSelected(el, false, false);
    }
  });
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onSelectedChangeEvent(event) {
  if (event.detail.value !== 'true') {
    return;
  }
  const itemElement = /** @type {HTMLElement} */ (event.target);
  const tabListElement = /** @type {HTMLElement} */ (event.currentTarget);
  for (const item of tabListElement.querySelectorAll('[role="tab"]')) {
    if (item !== itemElement) {
      TabItem.setSelected(item, false, false);
    }
  }
}

/**
 * @param {Element} tabListElement
 * @return {void}
 */
export function attach(tabListElement) {
  let indicatorElement = tabListElement.getElementsByClassName('mdw-tab__indicator')[0];
  if (!indicatorElement) {
    indicatorElement = document.createElement('div');
    indicatorElement.classList.add('mdw-tab__indicator');
    tabListElement.appendChild(indicatorElement);
  }

  setupARIA(tabListElement);
  for (const element of tabListElement.getElementsByClassName('mdw-tab__item')) { TabItem.attach(element); }
  RovingTabIndex.setupTabIndexes(tabListElement.querySelectorAll('[role="tab"]'));
  tabListElement.addEventListener(TabItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent, { passive: true });
  tabListElement.addEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  tabListElement.addEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
  tabListElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

/**
 * @param {Element} tabListElement
 * @return {void}
 */
export function detach(tabListElement) {
  tabListElement.removeEventListener(TabItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  tabListElement.removeEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  tabListElement.removeEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
  for (const el of tabListElement.querySelectorAll('[role="tab"]')) RovingTabIndex.detach(el);
  for (const el of tabListElement.getElementsByClassName('mdw-tab__item')) TabItem.detach(el);
}
