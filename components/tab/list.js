// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import {
  iterateArrayLike, getPassiveEventListenerOption, scrollToElement, iterateSomeOfArrayLike,
} from '../../core/dom';

import * as RovingTabIndex from '../../core/aria/rovingtabindex';
import * as Keyboard from '../../core/aria/keyboard';
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
  RovingTabIndex.setupTabIndexes(tabListElement.querySelectorAll('[role="tab"]'));
  tabListElement.addEventListener(TabItem.SELECTED_CHANGE_EVENT, onSelectedChangeEvent,
    getPassiveEventListenerOption());
  tabListElement.addEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  tabListElement.addEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
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
  /** @type {HTMLElement} */
  const tabListElement = (event.currentTarget);
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
  tabListElement.removeEventListener(Keyboard.FORWARD_ARROW_KEY, onForwardArrowKey);
  tabListElement.removeEventListener(Keyboard.BACK_ARROW_KEY, onBackArrowKey);
  iterateArrayLike(tabListElement.querySelectorAll('[role="tab"]'), RovingTabIndex.detach);
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
  const items = (tabListElement.getElementsByClassName('mdw-tab__item'));
  /** @type {HTMLElement} */
  const leftItem = (item instanceof Element ? item : items.item(item));
  let left = leftItem.offsetLeft;
  let right = left + leftItem.offsetWidth;

  if (percentage > 0) {
    left += (percentage * leftItem.offsetWidth);
    /** @type {HTMLElement} */
    let nextItem = (leftItem.nextElementSibling);
    if (!nextItem.classList.contains('mdw-tab__item')) {
      // RTL
      /** @type {HTMLElement} */
      nextItem = (leftItem.previousElementSibling);
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
  /** @type {HTMLCollectionOf<HTMLElement>} */
  const items = (tabListElement.getElementsByClassName('mdw-tab__item'));
  let tabItemIndex = -1;
  iterateSomeOfArrayLike(items, (el, index) => {
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
  /** @type {HTMLCollectionOf<HTMLElement>} */
  const items = (tabListElement.getElementsByClassName('mdw-tab__item'));
  if (dispatchEvents) {
    const item = items.item(tabItemIndex);
    if (item) {
      TabItem.setSelected(item, true, true);
    }
    return;
  }
  iterateArrayLike(items, (el, index) => {
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
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  /** @type {HTMLElement} */
  const tabListElement = (event.currentTarget);
  iterateArrayLike(tabListElement.querySelectorAll('[role="tab"]'), (item) => {
    if (item !== itemElement) {
      TabItem.setSelected(item, false, false);
    }
  });
}
