import {
  iterateArrayLike,
  nextTick,
  scrollToElement,
  dispatchDomEvent,
  getPassiveEventListenerOption,
  isRtl,
  iterateSomeOfArrayLike,
} from '../../core/dom';
import * as TabPanel from './panel';

export const SCROLL_EVENT = 'mdw:tabcontent-scroll';

/**
 * @param {Element} tabContentElement
 * @return {void}
 */
export function attach(tabContentElement) {
  tabContentElement.addEventListener('scroll', onTabContentScroll, getPassiveEventListenerOption());
  iterateArrayLike(tabContentElement.getElementsByClassName('mdw-tab__panel'), TabPanel.attach);
  tabContentElement.addEventListener('keydown', onKeyDown);
}

/**
 * @param {Element} tabContentElement
 * @return {void}
 */
export function detach(tabContentElement) {
  tabContentElement.removeEventListener('keydown', onKeyDown);
  tabContentElement.removeAttribute('mdw-selected-index');
  tabContentElement.removeEventListener('scroll', onTabContentScroll);
  iterateArrayLike(tabContentElement.getElementsByClassName('mdw-tab__panel'), TabPanel.detach);
}

/**
 * Prevent scrolling with keyboard
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
    return;
  }
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Left':
    case 'Right':
      event.preventDefault();
      break;
    default:
  }
}


/**
 * @param {Event} event
 * @return {void}
 */
export function onTabContentScroll(event) {
  /** @type {HTMLElement} */
  const tabContentElement = (event.currentTarget);
  if (tabContentElement.hasAttribute('mdw-no-scroll')) {
    return;
  }
  const isPageRtl = isRtl();
  const scrollPoint = tabContentElement.scrollLeft / tabContentElement.clientWidth;
  let visibleIndex = Math.floor(scrollPoint);
  let visibilityPercentage = scrollPoint - visibleIndex;

  // Percentage may be incorrect due to floating point rounding errors
  // Compare of integer values provided by browser
  iterateSomeOfArrayLike(tabContentElement.children, ((panel, index) => {
    if (tabContentElement.scrollLeft === panel.offsetLeft) {
      visibleIndex = index;
      visibilityPercentage = 0;
      return true;
    }
    return false;
  }));

  const isResting = visibilityPercentage === 0;
  let rightPanel;
  let leftPeekPanel;
  let rightPeekPanel;
  let leftSelected = false;
  let rightSelected = false;
  let selectedIndex;
  let leftPanelIndex;
  if (isPageRtl) {
    const lastIndex = tabContentElement.children.length - 1;
    leftPanelIndex = lastIndex - visibleIndex;
    leftPeekPanel = tabContentElement.children.item(lastIndex - (visibleIndex - 1));
    rightPanel = tabContentElement.children.item(lastIndex - (visibleIndex + 1));
    rightPeekPanel = tabContentElement.children.item(lastIndex - (visibleIndex + 2));
    if (visibilityPercentage < 0.5) {
      leftSelected = true;
      selectedIndex = lastIndex - visibleIndex;
    } else {
      rightSelected = true;
      selectedIndex = lastIndex - (visibleIndex + 1);
    }
  } else {
    leftPanelIndex = visibleIndex;
    rightPanel = tabContentElement.children.item(visibleIndex + 1);
    leftPeekPanel = tabContentElement.children.item(visibleIndex - 1);
    rightPeekPanel = tabContentElement.children.item(visibleIndex + 2);
    if (visibilityPercentage < 0.5) {
      leftSelected = true;
      selectedIndex = visibleIndex;
    } else {
      rightSelected = true;
      selectedIndex = visibleIndex + 1;
    }
  }
  /** @type {HTMLElement} */
  const leftPanel = (tabContentElement.children.item(leftPanelIndex));

  const currentTargetIndexString = tabContentElement.getAttribute('mdw-target-index');
  const currentTargetIndex = currentTargetIndexString == null
    ? null : parseInt(currentTargetIndexString, 10);

  let newSelectedIndex = null;
  if (currentTargetIndex == null) {
    TabPanel.setExpanded(leftPanel, leftSelected);
    if (rightPanel) {
      TabPanel.setExpanded(rightPanel, rightSelected);
    }
    newSelectedIndex = selectedIndex;
  } else if (currentTargetIndex === selectedIndex) {
    tabContentElement.removeAttribute('mdw-target-index');
  }


  TabPanel.setHidden(leftPanel, false);
  if (leftPeekPanel) {
    TabPanel.setHidden(leftPeekPanel, isResting || !leftSelected);
  }
  if (rightPanel) {
    TabPanel.setHidden(rightPanel, isResting);
  }
  if (rightPeekPanel) {
    TabPanel.setHidden(rightPeekPanel, isResting || !rightSelected);
  }

  dispatchDomEvent(tabContentElement, SCROLL_EVENT, {
    newSelectedIndex,
    leftPanelIndex,
    visibilityPercentage,
  });
}

/**
 * @param {HTMLElement} tabContentElement
 * @param {HTMLElement|number} panel element or index
 * @param {true|false|'smooth'} [scrollToPanel='smooth']
 * @return {void}
 */
export function selectPanel(tabContentElement, panel, scrollToPanel = 'smooth') {
  /** @type {HTMLElement} */
  let panelElement;
  /** @type {number} */
  let currentSelectedIndex = null;
  /** @type {number} */
  let panelIndex = null;
  const otherPanels = [];
  iterateArrayLike(tabContentElement.getElementsByClassName('mdw-tab__panel'), (el, index) => {
    if (currentSelectedIndex == null && TabPanel.isExpanded(el)) {
      currentSelectedIndex = index;
    }
    if (panel === el || panel === index) {
      TabPanel.setExpanded(el, true);
      TabPanel.setHidden(el, false);
      /** @type {HTMLElement} */
      panelElement = (el);
      panelIndex = index;
    } else {
      otherPanels.push(el);
    }
  });
  if (!panelElement) {
    // Invalid index or panel not in tabcontent
    return;
  }
  otherPanels.forEach(sibling => TabPanel.setExpanded(sibling, false));

  const isPageRtl = isRtl();
  const targetScrollLeft = isPageRtl
    ? panelElement.parentElement.scrollWidth + panelElement.offsetLeft - panelElement.offsetWidth
    : panelElement.offsetLeft;
  if (!scrollToPanel || panelElement.parentElement.scrollLeft === targetScrollLeft) {
    // No scrolling, hide others
    otherPanels.forEach(sibling => TabPanel.setHidden(sibling, true));
    return;
  }
  if (scrollToPanel && panelElement) {
    if (panelIndex == null) {
      tabContentElement.removeAttribute('mdw-target-index');
    } else {
      tabContentElement.setAttribute('mdw-target-index', panelIndex.toString(10));
    }
    scrollToElement(panelElement, scrollToPanel === 'smooth', isPageRtl);
  }
}
