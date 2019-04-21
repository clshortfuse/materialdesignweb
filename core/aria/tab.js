// https://www.w3.org/TR/wai-aria-1.1/#tab

import { dispatchDomEvent } from '../dom';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('role', 'tab');
  element.setAttribute('mdw-aria-tab-js', '');
  element.addEventListener('keydown', onKeyDown);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('keydown', onKeyDown);
  element.removeAttribute('mdw-aria-tab-js');
}

/**
 * @param {Element} element
 * @param {boolean} value
 * @param {string} [dispatchEventName]
 * @return {boolean} changed
 */
export function setSelected(element, value, dispatchEventName) {
  const originalSelectedAttr = element.getAttribute('aria-selected');
  const originalCurrentAttr = element.getAttribute('aria-current');
  if (value === true) {
    if (originalSelectedAttr === 'true' && originalCurrentAttr != null) {
      return false;
    }
    element.setAttribute('aria-selected', 'true');
    element.setAttribute('aria-current', 'true');
  } else {
    if (originalSelectedAttr === 'false' && originalCurrentAttr == null) {
      return false;
    }
    if ((!originalSelectedAttr || originalSelectedAttr !== 'false') && originalCurrentAttr == null) {
      element.setAttribute('aria-selected', 'false');
      return false;
    }
    element.setAttribute('aria-selected', 'false');
    element.removeAttribute('aria-current');
  }
  if (!dispatchEventName) {
    return true;
  }
  if (!dispatchDomEvent(element, dispatchEventName, { value })) {
    // Revert
    if (originalSelectedAttr == null) {
      element.removeAttribute('aria-selected');
    } else {
      element.setAttribute('aria-selected', originalSelectedAttr);
    }
    if (originalCurrentAttr == null) {
      element.removeAttribute('aria-current');
    } else {
      element.setAttribute('aria-current', originalCurrentAttr);
    }
    return false;
  }
  return true;
}

/**
 * Remap Space and Enter as Click
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onKeyDown(event) {
  if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
    return;
  }
  /** @type {HTMLElement} */
  const element = (event.currentTarget);
  if (!element) {
    return;
  }
  event.stopPropagation();
  event.preventDefault();
  const newEvent = document.createEvent('Event');
  newEvent.initEvent('click', true, true);
  element.dispatchEvent(newEvent);
}
