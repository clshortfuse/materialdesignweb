import {
  dispatchDomEvent,
} from '../../core/dom.js';

import * as TabContent from './content.js';
import * as TabItem from './item.js';
import * as TabList from './list.js';
import * as TabPanel from './panel.js';

const RESIZE_WAIT_FRAMES = 5;

export const SELECTED_INDEX_CHANGE_EVENT = 'mdw:tab-selectedindexchange';

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
      const tabContentElement = /** @type {HTMLElement} */ (tabElement.getElementsByClassName('mdw-tab__content')[0]);
      if (tabContentElement) {
        /** @type {HTMLElement} */
        const relatedPanel = (tabContentElement.querySelector('.mdw-tab__panel[aria-expanded="true"]'));
        if (relatedPanel) {
          TabContent.selectPanel(tabContentElement, relatedPanel, true);
        }
      }
    } else if (stage === RESIZE_WAIT_FRAMES * 2) {
      const tabListElement = /** @type {HTMLElement} */ (tabElement.getElementsByClassName('mdw-tab__list')[0]);
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

    requestAnimationFrame(performResize);
  }
  requestAnimationFrame(performResize);
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

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onTabItemSelectedChange(event) {
  if (event.detail.value !== 'true') {
    return;
  }
  const tabElement = /** @type {HTMLElement} */ (event.currentTarget);
  const tabItemElement = /** @type {HTMLElement} */ (event.target);
  const tabListElement = /** @type {HTMLElement} */ (tabElement.getElementsByClassName('mdw-tab__list')[0]);
  if (!tabListElement) {
    return;
  }

  const tabContentElement = /** @type {HTMLElement} */ (tabElement.getElementsByClassName('mdw-tab__content')[0]);
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
 * @param {CustomEvent} event
 * @return {void}
 */
export function onTabContentScroll(event) {
  const tabElement = /** @type {HTMLElement} */ (event.currentTarget);
  const { detail } = event;
  if (!detail.forceSelection && tabElement.hasAttribute('mdw-resize-stage')) {
    return;
  }
  const tabListElement = tabElement.getElementsByClassName('mdw-tab__list')[0];
  if (tabListElement) {
    TabList.setIndicatorPosition(
      tabListElement,
      detail.leftPanelIndex,
      detail.visibilityPercentage,
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
  const tabElement = /** @type {HTMLElement} */ (event.currentTarget);
  if (tabElement.hasAttribute('mdw-resize-stage')) {
    return;
  }
  let index = 0;
  const tabPanelElement = /** @type {HTMLElement} */ (event.target);
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

  tabElement.addEventListener(
    TabContent.SCROLL_EVENT,
    onTabContentScroll,
    { passive: true },
  );
  tabElement.addEventListener(
    TabItem.SELECTED_CHANGE_EVENT,
    onTabItemSelectedChange,
    { passive: true },
  );
  tabElement.addEventListener(
    TabPanel.EXPANDED_CHANGE_EVENT,
    onTabPanelExpandedChange,
    { passive: true },
  );

  /** @type {HTMLCollectionOf<Element>|Element[]} */
  const items = (tabListElement && tabListElement.getElementsByClassName('mdw-tab__item')) || [];
  /** @type {HTMLCollectionOf<Element>|Element[]} */
  const panels = (tabContentElement && tabContentElement.getElementsByClassName('mdw-tab__panel')) || [];

  let selectedItem;
  let selectedPanel;
  let selectedIndex;
  [...items].some((itemElement, index) => {
    if (itemElement.getAttribute('aria-selected') === 'true') {
      selectedItem = itemElement;
      selectedPanel = panels[index];
      selectedIndex = index;
      return true;
    }
    return false;
  });
  if (selectedIndex == null) {
    [...panels].some((panelElement, index) => {
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
