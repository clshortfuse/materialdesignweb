// https://www.w3.org/TR/wai-aria-practices/#menu

import {
  dispatchDomEvent,
  iterateArrayLike,
  iterateElementSiblings,
} from '../common/dom';

import * as Ripple from '../ripple/index';

export const ACTIVATE_EVENT = 'mdw:menuitem-activate';
export const CHECK_EVENT = 'mdw:menuitem-check';
export const UNCHECK_EVENT = 'mdw:menuitem-uncheck';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('mdw-js', '');
  Ripple.attach(element);
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
  iterateArrayLike(element.getElementsByClassName('mdw-menu__icon'),
    el => el.setAttribute('aria-hidden', 'true'));
  iterateArrayLike(element.getElementsByClassName('mdw-menu__text'),
    el => el.setAttribute('role', 'text'));
  iterateArrayLike(element.getElementsByClassName('mdw-menu__check'),
    el => el.setAttribute('aria-hidden', 'true'));
  iterateArrayLike(element.getElementsByClassName('mdw-menu__info'),
    el => el.setAttribute('role', 'note'));
}

/**
 * @param {MouseEvent|KeyboardEvent|PointerEvent} event
 * @return {void}
 */
export function onClick(event) {
  event.stopPropagation();

  /** @type {HTMLElement} */
  const menuItemElement = (event.currentTarget);
  if (isDisabled(menuItemElement)) {
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
 * @param {MouseEvent} event
 * @return {void}
 */
export function onMouseMove(event) {
  const el = event.currentTarget;
  if (!el) {
    return;
  }
  const previousFocus = document.activeElement;
  if (previousFocus === el) {
    // Already focused
    return;
  }
  el.focus();
  if (document.activeElement !== el) {
    if (previousFocus && document.activeElement !== previousFocus) {
      previousFocus.focus();
    }
  }
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  /** @type {HTMLElement} */
  const menuItemElement = (event.currentTarget);

  if (event.key === 'Enter') {
    event.stopPropagation();
    if (isDisabled(menuItemElement)) {
      return;
    }
    onClick(event);
    return;
  }

  if (event.key === 'Spacebar' || (event.key === ' ')) {
    event.stopPropagation();
    event.preventDefault();
    if (isDisabled(menuItemElement)) {
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
 * @return {boolean}
 */
export function isChecked(element) {
  return (element.getAttribute('aria-checked') === 'true');
}

/**
 * @param {Element} element
 * @return {boolean}
 */
export function isDisabled(element) {
  return (element.getAttribute('aria-disabled') === 'true');
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
  const checked = !isChecked(element);
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
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('click', onClick);
  element.removeEventListener('mousemove', onMouseMove);
  element.removeEventListener('keydown', onKeyDown);
  element.removeAttribute('mdw-js');
  Ripple.detach(element);
}
