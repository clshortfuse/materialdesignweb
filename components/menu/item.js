// https://www.w3.org/TR/wai-aria-practices/#menu

import * as Attributes from '../../core/aria/attributes.js';
import {
  dispatchDomEvent,
  iterateElementSiblings,
} from '../../core/dom.js';
import * as Overlay from '../../core/overlay/index.js';
import * as Ripple from '../../core/ripple/index.js';

export const ACTIVATE_EVENT = 'mdw:menuitem-activate';
export const CHECK_EVENT = 'mdw:menuitem-check';
export const UNCHECK_EVENT = 'mdw:menuitem-uncheck';

/**
 * @param {Element} element
 * @return {void}
 */
export function setupARIA(element) {
  if (element.hasAttribute('mdw-no-aria')) {
    return;
  }
  const role = element.getAttribute('role');
  let useAriaChecked = false;
  if (role === 'menuitemcheckbox' || role === 'menuitemradio') {
    useAriaChecked = true;
  } else if (role !== 'menuitem') {
    if (element.getElementsByClassName('mdw-menu__check').length) {
      useAriaChecked = true;
      element.setAttribute('role', 'menuitemcheckbox');
    } else if (element.getElementsByClassName('mdw-menu__radio').length) {
      useAriaChecked = true;
      element.setAttribute('role', 'menuitemradio');
    } else {
      element.setAttribute('role', 'menuitem');
    }
  }
  if (useAriaChecked && !element.hasAttribute('aria-checked')) {
    element.setAttribute('aria-checked', 'false');
  }
  for (const el of element.getElementsByClassName('mdw-menu__icon')) el.setAttribute('aria-hidden', 'true');
  for (const el of element.getElementsByClassName('mdw-menu__text')) el.setAttribute('role', 'text');
  for (const el of element.getElementsByClassName('mdw-menu__check')) el.setAttribute('aria-hidden', 'true');
  for (const el of element.getElementsByClassName('mdw-menu__info')) el.setAttribute('role', 'note');
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onMouseMove(event) {
  const el = /** @type {HTMLElement} */ (event.currentTarget);
  if (!el) {
    return;
  }
  const previousFocus = document.activeElement;
  if (previousFocus === el) {
    // Already focused
    return;
  }
  if (el.getAttribute('aria-disabled') === 'true') {
    return;
  }
  el.focus();
  if (document.activeElement !== el
    && document.activeElement !== previousFocus
    && previousFocus instanceof HTMLElement) {
    previousFocus.focus();
  }
}

/**
 * @param {Element} element
 * @param {boolean} checked
 * @return {boolean} uiChanged
 */
export function setChecked(element, checked) {
  const role = element.getAttribute('role');
  let isCheckable = false;
  if (role === 'menuitemcheckbox') {
    isCheckable = true;
    if (!dispatchDomEvent(element, checked ? CHECK_EVENT : UNCHECK_EVENT)) {
      return false;
    }
  }
  if (role === 'menuitemradio') {
    isCheckable = true;
    if (checked) {
      if (!dispatchDomEvent(element, CHECK_EVENT)) {
        return false;
      }
      iterateElementSiblings(element, (sibling) => {
        if (sibling.getAttribute('role') === 'menuitemradio') {
          sibling.setAttribute('aria-checked', 'false');
        }
      });
    }
  }
  if (!isCheckable) {
    return false;
  }
  element.setAttribute('aria-checked', checked ? 'true' : 'false');
  return true;
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function toggleChecked(element) {
  const checked = !Attributes.isChecked(element);
  return setChecked(element, checked);
}

/**
 * @param {Element} element
 * @return {boolean} handled
 */
export function openSubMenu(element) {
  const hasPopup = element.getAttribute('aria-haspopup');
  if (hasPopup !== 'menu' && hasPopup !== 'true') {
    return false;
  }

  // TODO: Open new menu
  return false;
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  event.stopPropagation();

  const menuItemElement = /** @type {HTMLElement} */ (event.currentTarget);
  if (Attributes.isDisabled(menuItemElement)) {
    return;
  }
  const role = menuItemElement.getAttribute('role');
  if (role === 'menuitemcheckbox') {
    toggleChecked(menuItemElement);
  } else if (role === 'menuitemradio') {
    setChecked(menuItemElement, true);
  }
  dispatchDomEvent(menuItemElement, ACTIVATE_EVENT);
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  const menuItemElement = /** @type {HTMLElement} */ (event.currentTarget);

  if (event.key === 'Enter') {
    event.stopPropagation();
    event.preventDefault();
    if (Attributes.isDisabled(menuItemElement)) {
      return;
    }
    onClick(event);
    return;
  }

  if (event.key === 'Spacebar' || (event.key === ' ')) {
    event.stopPropagation();
    event.preventDefault();
    if (Attributes.isDisabled(menuItemElement)) {
      return;
    }
    const role = menuItemElement.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      toggleChecked(menuItemElement);
    } else if (role === 'menuitemradio') {
      setChecked(menuItemElement, true);
    } else {
      dispatchDomEvent(menuItemElement, ACTIVATE_EVENT);
    }
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attachCore(element) {
  // If mouseover is used, an item can still lose focus via keyboard navigation.
  // An extra event listener would need to be created to catch blur but the cursor
  // would still remain over the element, thus needing another mousemove event.
  // Prioritization is given to less event listeners rather than operations per second.
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('click', onClick);
  element.addEventListener('keydown', onKeyDown);
  setupARIA(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.classList.add('mdw-overlay');
  Overlay.attach(element);

  element.classList.add('mdw-ripple');
  Ripple.attach(element);

  attachCore(element);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detachCore(element) {
  element.removeEventListener('click', onClick);
  element.removeEventListener('mousemove', onMouseMove);
  element.removeEventListener('keydown', onKeyDown);
  element.removeAttribute('mdw-js');
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  detachCore(element);
  Ripple.detach(element);
  Overlay.detach(element);
}
