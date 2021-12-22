// https://www.w3.org/TR/wai-aria-1.1/#tabpanel

import * as Attributes from '../../core/aria/attributes.js';

export const EXPANDED_CHANGE_EVENT = 'mdw:tabpanel-expandedchange';

export const { isExpanded } = Attributes;

/**
 * @param {Element} tabPanelElement
 * @return {void}
 */
export function attach(tabPanelElement) {
  tabPanelElement.setAttribute('role', 'tabpanel');
  if (!tabPanelElement.hasAttribute('aria-expanded')) {
    tabPanelElement.setAttribute('aria-expanded', 'false');
    tabPanelElement.setAttribute('aria-hidden', 'true');
  } else if (!tabPanelElement.hasAttribute('aria-hidden')) {
    tabPanelElement.setAttribute('aria-hidden', isExpanded(tabPanelElement) ? 'false' : 'true');
  }
}

/**
 * @param {Element} tabPanelElement
 * @return {void}
 */
export function detach(tabPanelElement) {
  if (!tabPanelElement.hasAttribute('aria-expanded')) {
    tabPanelElement.setAttribute('aria-expanded', 'false');
    tabPanelElement.setAttribute('aria-hidden', 'true');
  } else if (!tabPanelElement.hasAttribute('aria-hidden')) {
    tabPanelElement.setAttribute('aria-hidden', isExpanded(tabPanelElement) ? 'false' : 'true');
  }
}

/**
 * @param {Element} element
 * @param {string|boolean} value
 * @param {boolean} [dispatchEvent=true]
 * @return {boolean} successful
 */
export function setExpanded(element, value, dispatchEvent = true) {
  return Attributes.setExpanded(element, value, dispatchEvent ? EXPANDED_CHANGE_EVENT : null);
}

/**
 * Hide element to avoid tabbing into next panel
 * @param {Element} tabPanelElement
 * @param {boolean} value
 * @return {void}
 */
export function setHidden(tabPanelElement, value) {
  tabPanelElement.setAttribute('aria-hidden', value ? 'true' : 'false');
}
