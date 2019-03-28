import { dispatchDomEvent } from '../dom';

export const SELECTED_CHANGED_EVENT = 'mdw:aria-selectedchanged';

/**
 * @param {Element} element
 * @param {'false'|'true'} value
 * @param {boolean} [dispatchEvent=true]
 * @return {boolean} changed
 */
export function setSelected(element, value, dispatchEvent = true) {
  const originalAttr = element.getAttribute('aria-selected');
  if (value === 'true') {
    if (originalAttr === 'true') {
      return false;
    }
    element.setAttribute('aria-selected', 'true');
  } else {
    if (originalAttr === 'false') {
      return false;
    }
    if (!originalAttr || originalAttr !== 'false') {
      element.setAttribute('aria-selected', 'false');
      return false;
    }
    element.setAttribute('aria-selected', 'false');
  }
  if (!dispatchEvent) {
    return true;
  }
  if (!dispatchDomEvent(element, SELECTED_CHANGED_EVENT)) {
    // Revert
    if (originalAttr == null) {
      element.removeAttribute('aria-selected');
    } else {
      element.setAttribute('aria-selected', originalAttr);
    }
    return false;
  }
  return true;
}
