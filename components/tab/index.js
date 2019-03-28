import {
  iterateArrayLike,
  nextTick,
  getPassiveEventListenerOption,
} from '../../core/dom';

import * as TabContent from './content';
import * as TabList from './list';
import * as TabItem from './item';

const RESIZE_WAIT_FRAMES = 5;

/**
 * @param {Element} tabElement
 * @return {void}
 */
export function attach(tabElement) {
  const tabListElement = tabElement.getElementsByClassName('mdw-tab__list')[0];
  if (tabListElement) {
    TabList.attach(tabListElement);
  }

  const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
  if (tabContentElement) {
    TabContent.attach(tabContentElement);
  }

  tabElement.addEventListener(TabContent.SCROLL_EVENT, onTabContentScroll, getPassiveEventListenerOption());
  tabElement.addEventListener(TabList.SELECTION_CHANGED_EVENT, onTabListSelectionChanged, getPassiveEventListenerOption());

  const items = tabElement.getElementsByClassName('mdw-tab__item');

  let selectedItem;
  iterateArrayLike(items, (itemElement) => {
    if (itemElement.getAttribute('aria-selected') === 'true') {
      selectedItem = itemElement;
    }
  });
  if (!selectedItem && items.length) {
    selectedItem = items[0];
  }
  if (selectedItem) {
    TabItem.selectTabItem(selectedItem, true, true);
    onResize(tabElement);
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onTabListSelectionChanged(event) {
  /** @type {HTMLElement} */
  const tabElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const tabItemElement = (event.target);
  /** @type {HTMLElement} */
  const tabContentElement = (tabElement.getElementsByClassName('mdw-tab__content')[0]);
  if (tabContentElement) {
    let index = 0;
    let previous = tabItemElement.previousElementSibling;
    while (previous) {
      previous = previous.previousElementSibling;
      index += 1;
    }
    if (!tabContentElement.hasAttribute('mdw-no-scroll')) {
      TabContent.selectPanel(tabContentElement, index, 'smooth');
      return;
    }
    TabContent.selectPanel(tabContentElement, index, true);
  }

  const tabListElement = tabElement.getElementsByClassName('mdw-tab__list')[0];
  if (tabListElement) {
    TabList.setIndicatorPosition(tabListElement, tabItemElement, 0, true);
  }
}

/**
 * @param {Element} tabElement
 * @return {void}
 */
export function detach(tabElement) {
  const tabListElement = tabElement.getElementsByClassName('mdw-tab__list')[0];
  if (tabListElement) {
    TabList.detach(tabListElement);
  }

  const tabContentElement = tabElement.getElementsByClassName('mdw-tab__content')[0];
  if (tabContentElement) {
    TabContent.detach(tabContentElement);
  }

  tabElement.removeEventListener(TabContent.SCROLL_EVENT, onTabContentScroll);
  tabElement.removeEventListener(TabList.SELECTION_CHANGED_EVENT, onTabListSelectionChanged);
  tabElement.removeAttribute('mdw-resize-stage');
}

/**
 * @param {Element} tabElement
 * @return {void}
 */
export function onResize(tabElement) {
  let stage = 0;
  tabElement.setAttribute('mdw-resize-stage', stage.toString());
  /** @return {void} */
  function performResize() {
    if (!tabElement.hasAttribute('mdw-resize-stage')) {
      // Skip resize
      return;
    }
    const attrStage = tabElement.getAttribute('mdw-resize-stage');
    if (attrStage !== stage.toString()) {
      // Off-sync due to another resize event
      return;
    }
    stage += 1;
    tabElement.setAttribute('mdw-resize-stage', stage.toString());
    if (stage === RESIZE_WAIT_FRAMES) {
      /** @type {HTMLElement} */
      const tabContentElement = (tabElement.getElementsByClassName('mdw-tab__content')[0]);
      if (tabContentElement && !tabContentElement.hasAttribute('mdw-no-scroll')) {
        /** @type {HTMLElement} */
        const relatedPanel = (tabContentElement.querySelector('.mdw-tab__panel[aria-expanded="true"]'));
        if (relatedPanel) {
          TabContent.selectPanel(tabContentElement, relatedPanel, true);
        }
      }
    } else if (stage === RESIZE_WAIT_FRAMES * 2) {
      /** @type {HTMLElement} */
      const tabListElement = (tabElement.getElementsByClassName('mdw-tab__list')[0]);
      if (tabListElement) {
        /** @type {HTMLElement} */
        const relatedItem = (tabListElement.querySelector('.mdw-tab__item[aria-selected="true"]'));
        if (relatedItem) {
          TabList.setIndicatorPosition(tabListElement, relatedItem, 0);
        }
      }
      tabElement.removeAttribute('mdw-resize-stage');
      return;
    }

    nextTick(performResize);
  }
  nextTick(performResize);
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onTabContentScroll(event) {
  /** @type {HTMLElement} */
  const tabElement = (event.currentTarget);
  if (tabElement.hasAttribute('mdw-resize-stage')) {
    return;
  }
  const { detail } = event;
  const tabListElement = tabElement.getElementsByClassName('mdw-tab__list')[0];
  if (!tabListElement) {
    return;
  }
  TabList.setIndicatorPosition(tabListElement, detail.leftPanelIndex, detail.visibilityPercentage);
  if (detail.newSelectedIndex != null) {
    TabList.selectItemAtIndex(tabListElement, detail.newSelectedIndex, true);
  }
}
