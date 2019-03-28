// https://www.w3.org/TR/wai-aria-1.1/#tabpanel

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
 * @param {Element} tabPanelElement
 * @return {boolean}
 */
export function isExpanded(tabPanelElement) {
  return tabPanelElement.getAttribute('aria-expanded') === 'true';
}

/**
 * @param {Element} tabPanelElement
 * @param {boolean} value
 * @return {void}
 */
export function setExpanded(tabPanelElement, value) {
  tabPanelElement.setAttribute('aria-expanded', value ? 'true' : 'false');
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
