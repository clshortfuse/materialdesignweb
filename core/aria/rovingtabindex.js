// https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex

import {
  iterateArrayLike,
  isRtl,
  dispatchDomEvent,
  iterateSomeOfArrayLike,
} from '../dom';

export const TABINDEX_ZEROED = 'mdw:rovingtabindex-tabindexzeroed';
export const FORWARDS_REQUESTED = 'mdw:rovingtabindex-forwardsrequested';
export const BACKWARDS_REQUESTED = 'mdw:rovingtabindex-backwardsrequested';

/**
 * @param {Element} parentElement
 * @param {string} querySelectorString
 * @param {boolean} [focusableWhenDisabled=true]
 * @return {void}
 */
export function setupTabIndexes(parentElement, querySelectorString, focusableWhenDisabled = true) {
  /** @type {Element} */
  let currentlyFocusedChild = null;
  /** @type {Element} */
  let currentTabIndexChild = null;
  /** @type {Element} */
  let firstFocusableChild = null;
  iterateArrayLike(parentElement.querySelectorAll(querySelectorString), (child) => {
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
    child.addEventListener('focus', onChildFocus);
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
  parentElement.addEventListener('keydown', onKeyDownHandler);
}


/**
 * @param {Element} parentElement
 * @param {string} querySelectorString
 * @return {void}
 */
export function detach(parentElement, querySelectorString) {
  iterateArrayLike(parentElement.querySelectorAll(querySelectorString), (child) => {
    child.removeEventListener('focus', onChildFocus);
  });
  parentElement.removeEventListener('keydown', onKeyDownHandler);
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
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDownHandler(event) {
  if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
    return;
  }

  /** @type {Element} */
  const parentElement = (event.currentTarget);
  /** @type {Element} */
  const childElement = (event.target);

  let moveHorizontal = false;
  let moveVertical = false;
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Left':
    case 'Right':
      moveHorizontal = true;
      break;
    case 'ArrowDown':
    case 'ArrowUp':
    case 'Down':
    case 'Up':
      moveVertical = true;
      break;
    default:
      return;
  }

  let verticalOrientation = true;
  // DOM Read
  const ariaOrientation = parentElement.getAttribute('aria-orientation');
  if (ariaOrientation === 'horizontal') {
    verticalOrientation = false;
  } else if (ariaOrientation !== 'vertical') {
    switch (parentElement.getAttribute('role')) {
      case 'listbox':
      case 'tablist':
      case 'tree':
        verticalOrientation = true;
        break;
      default:
        verticalOrientation = false;
    }
  }
  let moveForwards = false;
  if (verticalOrientation) {
    if (!moveVertical) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
      case 'Down':
        moveForwards = true;
        break;
      case 'ArrowUp':
      case 'Up':
        // moveForwards = false;
        break;
      default:
        return;
    }
  } else {
    if (!moveHorizontal) {
      return;
    }
    const isPageRTL = isRtl();
    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
        moveForwards = isPageRTL;
        break;
      case 'ArrowRight':
      case 'Right':
        moveForwards = !isPageRTL;
        break;
      default:
        return;
    }
  }
  event.stopPropagation();
  event.preventDefault();

  if (moveForwards) {
    dispatchDomEvent(childElement, FORWARDS_REQUESTED);
  } else {
    dispatchDomEvent(childElement, BACKWARDS_REQUESTED);
  }

  let candidate = childElement;

  do {
    if (moveForwards) {
      candidate = candidate.nextElementSibling || candidate.parentElement.firstElementChild;
    } else {
      candidate = candidate.previousElementSibling || candidate.parentElement.lastElementChild;
    }
    if (candidate.hasAttribute('tabindex') && candidate.getAttribute('aria-hidden') !== 'true') {
      try {
        // @ts-ignore
        candidate.focus();
      } catch (e) {
        // Ignore error.
      }
    }
    // Abort if we've looped all the way back to original element
    // Abort if candidate reserved focus
  } while (candidate !== childElement && document.activeElement !== candidate);
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
 * @param {boolean} [reverse]
 * @return {void}
 */
export function selectNext(list, current = null, reverse = false) {
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
    return attemptFocus(candidate);
  });
  if (iterateResult) {
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
    // Abort if we've looped all the way back to original element
    // Abort if candidate received focus
    return (attemptFocus(candidate) || candidate === current);
  });
}

/**
 * Alias for selectNext(list, current, true);
 * @param {ArrayLike<HTMLElement>} list
 * @param {Element} [current]
 * @return {void}
 */
export function selectPrevious(list, current) {
  return selectNext(list, current, true);
}
