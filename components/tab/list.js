// https://www.w3.org/TR/wai-aria-practices/#tabpanel

import {
  iterateArrayLike, dispatchDomEvent, getPassiveEventListenerOption, scrollToElement,
} from '../../core/dom';

import * as AriaAttributes from '../../core/aria/attributes';
import * as RovingTabIndex from '../../core/aria/rovingtabindex';
import * as TabItem from './item';

export const SELECTION_CHANGED_EVENT = 'mdw:tablistselectionchanged';

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

  tabListElement.classList.add('mdw-overlay__group');
  iterateArrayLike(tabListElement.getElementsByClassName('mdw-tab__item'), TabItem.attach);
  tabListElement.addEventListener(AriaAttributes.SELECTED_CHANGED_EVENT, onSelectedChangedEvent, getPassiveEventListenerOption());
  setupARIA(tabListElement);
  RovingTabIndex.attach(tabListElement, 'mdw-tab__item');
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
  iterateArrayLike(tabListElement.getElementsByClassName('mdw-tab__item'), TabItem.detach);
  tabListElement.removeEventListener(AriaAttributes.SELECTED_CHANGED_EVENT, onSelectedChangedEvent);
  RovingTabIndex.detach(tabListElement, 'mdw-tab__item');
}


/**
 * @param {Element} tabListElement
 * @return {void}
 */
export function removeSelection(tabListElement) {
  return iterateArrayLike(
    tabListElement.querySelectorAll('mdw-tab__item[aria-selected="true"]'),
    item => item.setAttribute('aria-selected', 'false')
  );
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
 * @param {boolean} [deselectSiblings=true]
 * @param {boolean} [dispatchEvents=false]
 * @return {void}
 */
export function selectItemAtIndex(tabListElement, tabItemIndex, deselectSiblings = true, dispatchEvents = false) {
  tabListElement.setAttribute('mdw-selected-index', tabItemIndex.toString(10));
  const items = tabListElement.getElementsByClassName('mdw-tab__item');
  if (!deselectSiblings) {
    const item = items.item(tabItemIndex);
    if (item) {
      TabItem.selectTabItem(item, false, dispatchEvents);
    }
    return;
  }
  iterateArrayLike(items, (el, index) => {
    if (tabItemIndex === index) {
      TabItem.selectTabItem(el, false, dispatchEvents);
      if (tabListElement.hasAttribute('mdw-scrollable')) {
        scrollToElement(el, true);
      }
    } else {
      TabItem.deselectTabItem(el, dispatchEvents);
    }
  });
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
  TabItem.deselectTabItemSiblings(itemElement, false);
  dispatchDomEvent(itemElement, SELECTION_CHANGED_EVENT);
}
