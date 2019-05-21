// https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex

import {
  iterateArrayLike,
  dispatchDomEvent,
  iterateSomeOfArrayLike,
} from '../dom';

export const TABINDEX_ZEROED = 'mdw:rovingtabindex-tabindexzeroed';

/**
 * @param {ArrayLike<Element>} items
 * @param {boolean} [focusableWhenDisabled=true]
 * @return {void}
 */
export function setupTabIndexes(items, focusableWhenDisabled = true) {
  /** @type {Element} */
  let currentlyFocusedChild = null;
  /** @type {Element} */
  let currentTabIndexChild = null;
  /** @type {Element} */
  let firstFocusableChild = null;
  iterateArrayLike(items, (child) => {
    if (!currentlyFocusedChild && document.activeElement === child) {
      currentlyFocusedChild = child;
    } else if (!currentTabIndexChild && child.getAttribute('tabindex') === '0') {
      currentTabIndexChild = child;
    } else {
      if (!firstFocusableChild && child.getAttribute('aria-hidden') !== 'true'
        && (focusableWhenDisabled || child.getAttribute('aria-disabled') !== 'true')) {
        firstFocusableChild = child;
      }
      child.setAttribute('tabindex', '-1');
    }
    attach(child);
  });
  if (currentlyFocusedChild) {
    currentlyFocusedChild.setAttribute('tabindex', '0');
  } else if (currentTabIndexChild) {
    if (currentlyFocusedChild) {
      currentTabIndexChild.setAttribute('tabindex', '-1');
    }
  } else if (firstFocusableChild) {
    firstFocusableChild.setAttribute('tabindex', '0');
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', (document.activeElement === element) ? '0' : '-1');
  }
  element.addEventListener('focus', onChildFocus);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeEventListener('focus', onChildFocus);
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
function onChildFocus(event) {
  /** @type {Element} */
  const child = (event.currentTarget);
  if (child.getAttribute('tabindex') === '0') {
    return;
  }
  child.setAttribute('tabindex', '0');
  dispatchDomEvent(child, TABINDEX_ZEROED);
}

/**
 * @param {ArrayLike<Element>} items
 * @param {Element[]} [excludeItems]
 * @return {void}
 */
export function removeTabIndex(items, excludeItems = []) {
  iterateArrayLike(items, (item) => {
    if (excludeItems.indexOf(item) !== -1) {
      return;
    }
    if (item.hasAttribute('tabindex')) {
      item.setAttribute('tabindex', '-1');
    }
  });
}

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
function attemptFocus(element) {
  try {
    element.focus();
  } catch (e) {
    // Ignore error.
  }
  return document.activeElement === element;
}

/**
 * @param {ArrayLike<HTMLElement>} list
 * @param {Element} [current]
 * @param {boolean} [loop=true]
 * @param {boolean} [reverse]
 * @return {void}
 */
export function selectNext(list, current = null, loop = true, reverse = false) {
  let foundCurrent = false;

  const iterateResult = iterateSomeOfArrayLike(list, (item, index, array) => {
    const candidate = reverse ? (array[array.length - 1 - index]) : item;
    if (!foundCurrent) {
      if (current) {
        if (candidate === current) {
          foundCurrent = true;
        }
      } else if (candidate.getAttribute('tabindex') === '0') {
        foundCurrent = true;
      }
      return false;
    }
    if (!candidate.hasAttribute('tabindex')) {
      return false;
    }
    if (candidate.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (candidate.getAttribute('mdw-skip-tab') === 'true') {
      return false;
    }
    return attemptFocus(candidate);
  });
  if (iterateResult) {
    return;
  }
  if (!loop) {
    if (document.activeElement !== current && current instanceof HTMLElement) {
      current.focus();
    }
    return;
  }
  iterateSomeOfArrayLike(list, (item, index, array) => {
    const candidate = reverse ? (array[array.length - 1 - index]) : item;
    if (!candidate.hasAttribute('tabindex')) {
      return false;
    }
    if (candidate.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (candidate.getAttribute('mdw-skip-tab') === 'true') {
      return false;
    }
    // Abort if we've looped all the way back to original element
    // Abort if candidate received focus
    return (attemptFocus(candidate) || candidate === current);
  });
}

/**
 * Alias for selectNext(list, current, true);
 * @param {ArrayLike<HTMLElement>} list
 * @param {Element} [current]
 * @param {boolean} [loop=true]
 * @return {void}
 */
export function selectPrevious(list, current, loop = true) {
  return selectNext(list, current, loop, true);
}
