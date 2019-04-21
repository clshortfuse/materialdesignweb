// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import {
  iterateArrayLike, getPassiveEventListenerOption, scrollToElement,
} from '../../core/dom';

import * as RovingTabIndex from '../../core/aria/rovingtabindex';
import * as TabItem from './item';

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
  iterateArrayLike(tabListElement.getElementsByClassName('mdw-tab__item'), TabItem.attach);
  RovingTabIndex.setupTabIndexes(tabListElement, tabListElement.querySelectorAll('[role="tab"]'));
  tabListElement.addEventListener(TabItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent, getPassiveEventListenerOption());
  tabListElement.addEventListener(RovingTabIndex.FORWARDS_REQUESTED, onForwardsRequested);
  tabListElement.addEventListener(RovingTabIndex.BACKWARDS_REQUESTED, onBackwardsRequested);
  tabListElement.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  /** @type {HTMLElement} */
  const tabListElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const currentItem = (event.target);
  RovingTabIndex.removeTabIndex(tabListElement.querySelectorAll('[role="tab"]'), [currentItem]);
}
/**
 * @param {Event} event
 * @return {void}
 */
function onForwardsRequested(event) {
  /** @type {HTMLElement} */
  const tabListElement = (event.currentTarget);
  RovingTabIndex.selectNext(tabListElement.querySelectorAll('[role="tab"]'));
}

/**
 * @param {Event} event
 * @return {void}
 */
function onBackwardsRequested(event) {
  /** @type {HTMLElement} */
  const tabListElement = (event.currentTarget);
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
 * @return {void}
 */
export function detach(tabListElement) {
  tabListElement.removeEventListener(TabItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent);
  RovingTabIndex.detach(tabListElement, tabListElement.querySelectorAll('[role="tab"]'));
  iterateArrayLike(tabListElement.getElementsByClassName('mdw-tab__item'), TabItem.detach);
}

/**
 * @param {Element} tabListElement
 * @param {Element|number} item element or index
 * @param {number} [percentage=0]
 * @param {boolean} [animate=false]
 * @return {void}
 */
export function setIndicatorPosition(tabListElement, item, percentage, animate = false) {
  /** @type {HTMLElement} */
  const indicatorElement = (tabListElement.getElementsByClassName('mdw-tab__indicator')[0]);
  if (!indicatorElement) {
    return;
  }
  const items = tabListElement.getElementsByClassName('mdw-tab__item');
  /** @type {HTMLElement} */
  const leftItem = (item instanceof Element ? item : items.item(item));
  let left = leftItem.offsetLeft;
  let right = left + leftItem.offsetWidth;

  if (percentage > 0) {
    left += (percentage * leftItem.offsetWidth);
    let nextItem = (leftItem.nextElementSibling);
    if (!nextItem.classList.contains('mdw-tab__item')) {
      // RTL
      nextItem = leftItem.previousElementSibling;
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
 * @param {Element} tabListElement
 * @param {number} tabItemIndex
 * @return {Element}
 */

/**
 * @param {Element} tabListElement
 * @param {number} tabItemIndex
 * @param {boolean} [dispatchEvents=false]
 * @return {void}
 */
export function selectItemAtIndex(tabListElement, tabItemIndex, dispatchEvents = false) {
  tabListElement.setAttribute('mdw-selected-index', tabItemIndex.toString(10));
  const items = tabListElement.getElementsByClassName('mdw-tab__item');
  if (dispatchEvents) {
    const item = items.item(tabItemIndex);
    if (item) {
      TabItem.setSelected(item, true, TabItem.SELECTED_CHANGE_EVENT);
    }
    return;
  }
  iterateArrayLike(items, (el, index) => {
    if (tabItemIndex === index) {
      TabItem.setSelected(el, true);
      if (tabListElement.hasAttribute('mdw-scrollable')) {
        scrollToElement(el, true);
      }
    } else {
      TabItem.setSelected(el, false);
    }
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onSelectedChangeEvent(event) {
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  if (event.detail.value === false) {
    return;
  }
  /** @type {HTMLElement} */
  const tabListElement = (event.currentTarget);
  iterateArrayLike(tabListElement.querySelectorAll('[role="tab"]'), (item) => {
    if (item !== itemElement) {
      TabItem.setSelected(item, false);
    }
  });
}
