import {
  nextTick,
  getPassiveEventListenerOption,
  dispatchDomEvent,
  iterateSomeOfArrayLike,
} from '../../core/dom';

import * as TabContent from './content';
import * as TabList from './list';
import * as TabPanel from './panel';
import * as TabItem from './item';

const RESIZE_WAIT_FRAMES = 5;

export const SELECTED_INDEX_CHANGE_EVENT = 'mdw:tab-selectedindexchange';

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

  tabElement.addEventListener(TabContent.SCROLL_EVENT, onTabContentScroll,
    getPassiveEventListenerOption());
  tabElement.addEventListener(TabItem.SELECTED_CHANGE_EVENT, onTabItemSelectedChange,
    getPassiveEventListenerOption());
  tabElement.addEventListener(TabPanel.EXPANDED_CHANGE_EVENT, onTabPanelExpandedChange,
    getPassiveEventListenerOption());

  /** @type {ArrayLike<Element>} */
  const items = (tabListElement && tabListElement.getElementsByClassName('mdw-tab__item')) || [];
  /** @type {ArrayLike<Element>} */
  const panels = (tabContentElement && tabContentElement.getElementsByClassName('mdw-tab__panel')) || [];

  let selectedItem;
  let selectedPanel;
  let selectedIndex;
  iterateSomeOfArrayLike(items, (itemElement, index) => {
    if (itemElement.getAttribute('aria-selected') === 'true') {
      selectedItem = itemElement;
      selectedPanel = panels[index];
      selectedIndex = index;
      return true;
    }
    return false;
  });
  if (selectedIndex == null) {
    iterateSomeOfArrayLike(panels, (panelElement, index) => {
      if (panelElement.getAttribute('aria-expanded') === 'true') {
        selectedPanel = panelElement;
        selectedItem = items[index];
        selectedIndex = index;
        return true;
      }
      return false;
    });
  }
  if (!selectedItem && items.length) {
    selectedItem = items[0];
    selectedIndex = 0;
  }
  if (!selectedPanel && panels.length) {
    selectedPanel = panels[0];
    selectedIndex = 0;
  }
  if (selectedItem) {
    TabItem.setSelected(selectedItem, true);
  }
  if (selectedPanel) {
    TabPanel.setHidden(selectedPanel, false);
    TabPanel.setExpanded(selectedPanel, true);
  }
  if (selectedIndex != null) {
    tabElement.setAttribute('mdw-selected-index', selectedIndex.toString());
  }
  onResize(tabElement);
}

/**
 * @param {CustomEvent} event
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
  const tabListElement = (tabElement.getElementsByClassName('mdw-tab__list')[0]);
  if (!tabListElement) {
    return;
  }

  /** @type {HTMLElement} */
  const tabContentElement = (tabElement.getElementsByClassName('mdw-tab__content')[0]);
  const tabItemIndex = TabList.getTabItemIndex(tabListElement, tabItemElement);
  if (tabItemIndex === -1) {
    return;
  }
  if (tabContentElement) {
    const hasNoScroll = tabContentElement.hasAttribute('mdw-no-scroll');
    if (!hasNoScroll) {
      TabContent.selectPanel(tabContentElement, tabItemIndex, 'smooth');
      return;
    }
    TabContent.selectPanel(tabContentElement, tabItemIndex, true);
  }
  TabList.setIndicatorPosition(tabListElement, tabItemElement, 0, true);
  if (!tabContentElement) {
    updateSelectedIndex(tabElement, tabItemIndex);
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

  tabElement.removeEventListener(TabPanel.EXPANDED_CHANGE_EVENT, onTabPanelExpandedChange);
  tabElement.removeEventListener(TabContent.SCROLL_EVENT, onTabContentScroll);
  tabElement.removeEventListener(TabItem.SELECTED_CHANGE_EVENT, onTabItemSelectedChange);
  tabElement.removeAttribute('mdw-resize-stage');
  tabElement.removeAttribute('mdw-selected-index');
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
      if (tabContentElement) {
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
 * @param {CustomEvent} event
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
  if (tabListElement) {
    TabList.setIndicatorPosition(
      tabListElement,
      detail.leftPanelIndex,
      detail.visibilityPercentage
    );
  }
  if (detail.updateSelected) {
    updateSelectedIndex(tabElement, detail.leftPanelIndex);
  }
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onTabPanelExpandedChange(event) {
  if (event.detail.value !== 'true') {
    return;
  }
  /** @type {HTMLElement} */
  const tabElement = (event.currentTarget);
  if (tabElement.hasAttribute('mdw-resize-stage')) {
    return;
  }
  let index = 0;
  /** @type {HTMLElement} */
  const tabPanelElement = (event.target);
  let sibling = tabPanelElement.previousElementSibling;
  while (sibling) {
    index += 1;
    sibling = sibling.previousElementSibling;
  }
  const tabListElement = tabElement.getElementsByClassName('mdw-tab__list')[0];
  if (tabListElement) {
    TabList.selectItemAtIndex(tabListElement, index, false);
  }
}

/**
 * @param {HTMLElement} tabElement
 * @param {number} index
 * @return {void}
 */
function updateSelectedIndex(tabElement, index) {
  const currentIndex = tabElement.getAttribute('mdw-selected-index');
  if (currentIndex == null || currentIndex === index.toString()) {
    return;
  }
  tabElement.setAttribute('mdw-selected-index', index.toString());
  dispatchDomEvent(tabElement, SELECTED_INDEX_CHANGE_EVENT, { value: index });
}
