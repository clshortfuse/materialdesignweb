import {
  iterateArrayLike,
  nextTick,
  getPassiveEventListenerOption,
  iterateSomeOfArrayLike,
} from '../../core/dom';

import * as TabContent from './content';
import * as TabList from './list';
import * as TabPanel from './panel';
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
  tabElement.addEventListener(TabItem.SELECTED_CHANGE_EVENT, onTabItemSelectedChange, getPassiveEventListenerOption());

  const items = (tabListElement && tabListElement.getElementsByClassName('mdw-tab__item')) || [];
  const panels = (tabContentElement && tabContentElement.getElementsByClassName('mdw-tab__panel')) || [];

  let selectedItem;
  let selectedPanel;
  iterateArrayLike(items, (itemElement, index) => {
    if (itemElement.getAttribute('aria-selected') === 'true') {
      selectedItem = itemElement;
      selectedPanel = panels[index];
    }
  });
  if (!selectedItem && items.length) {
    selectedItem = items[0];
    selectedPanel = panels[0];
  }
  if (selectedItem) {
    TabItem.setSelected(selectedItem, true);
  }
  if (selectedPanel) {
    TabPanel.setHidden(selectedPanel, false);
    TabPanel.setExpanded(selectedPanel, true);
  }
  onResize(tabElement);
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onTabItemSelectedChange(event) {
  if (event.detail.value !== 'true') {
    return;
  }
  /** @type {HTMLElement} */
  const tabElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const tabItemElement = (event.target);
  /** @type {HTMLElement} */
  const tabContentElement = (tabElement.getElementsByClassName('mdw-tab__content')[0]);
  if (tabContentElement) {
    let tabItemIndex = -1;
    const tabItems = tabElement.querySelectorAll('.mdw-tab__list [role="tab"]');
    iterateSomeOfArrayLike(tabItems, (el, index) => {
      if (el === tabItemElement) {
        tabItemIndex = index;
        return true;
      }
      return false;
    });
    if (!tabContentElement.hasAttribute('mdw-no-scroll')) {
      TabContent.selectPanel(tabContentElement, tabItemIndex, 'smooth');
      return;
    }
    TabContent.selectPanel(tabContentElement, tabItemIndex, true);
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
  tabElement.removeEventListener(TabItem.SELECTED_CHANGE_EVENT, onTabItemSelectedChange);
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
    TabList.selectItemAtIndex(tabListElement, detail.newSelectedIndex, false);
  }
}
