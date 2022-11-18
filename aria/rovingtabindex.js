// https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex

export const TABINDEX_ZEROED = 'mdw:rovingtabindex-tabindexzeroed';

/**
 * @param {FocusEvent} event
 * @this {HTMLElement}
 * @return {void}
 */
function onChildFocus(event) {
  if (this.getAttribute('tabindex') === '0') return;

  this.tabIndex = 0;
  this.dispatchEvent(new Event(TABINDEX_ZEROED, { bubbles: true, cancelable: true }));
}

/**
 * @param {Iterable<Element>} items
 * @param {Element[]} [excludeItems]
 * @return {void}
 */
export function removeTabIndex(items, excludeItems = []) {
  for (const item of items) {
    if (excludeItems.includes(item)) {
      continue;
    }
    if (item.hasAttribute('tabindex')) {
      item.tabIndex = -1;
      // item.setAttribute('tabindex', '-1');
    }
  }
}

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
function attemptFocus(element) {
  try {
    element.focus();
  } catch (e) {
    console.error(e);
    // Ignore error.
  }
  const focused = document.activeElement === element;
  if (!focused) {
    console.warn('Element was not focused', element);
    return false;
  }
  return true;
}

/**
 * @param {Iterable<HTMLElement>} list
 * @param {Element|HTMLElement} [current]
 * @param {boolean} [loop=true]
 * @param {boolean} [reverse]
 * @return {HTMLElement} focusedElement
 */
export function selectNext(list, current = null, loop = true, reverse = false) {
  let foundCurrent = false;

  const array = reverse ? [...list].reverse() : list;
  for (const candidate of array) {
    if (!foundCurrent) {
      if (current) {
        if (candidate === current) {
          foundCurrent = true;
        }
      } else if (candidate.getAttribute('tabindex') === '0') {
        foundCurrent = true;
      }
      continue;
    }
    if (!candidate.hasAttribute('tabindex')) {
      continue;
    }
    if (candidate.getAttribute('aria-hidden') === 'true') {
      continue;
    }
    if (candidate.getAttribute('mdw-skip-tab') === 'true') {
      continue;
    }
    if (attemptFocus(candidate)) {
      return candidate;
    }
  }

  if (!loop) {
    if (document.activeElement !== current && current instanceof HTMLElement) {
      current.focus();
    }
    return current;
  }
  // Loop
  for (const candidate of array) {
    if (!candidate.hasAttribute('tabindex')) {
      continue;
    }
    if (candidate.getAttribute('aria-hidden') === 'true') {
      continue;
    }
    if (candidate.getAttribute('mdw-skip-tab') === 'true') {
      continue;
    }
    // Abort if we've looped all the way back to original element
    // Abort if candidate received focus
    if (attemptFocus(candidate)) {
      return candidate;
    }
    if (candidate === current) {
      return candidate;
    }
  }
  return null;
}

/**
 * Alias for selectNext(list, current, true);
 * @param {Iterable<HTMLElement>} list
 * @param {Element} [current]
 * @param {boolean} [loop=true]
 * @return {HTMLElement}
 */
export function selectPrevious(list, current, loop = true) {
  return selectNext(list, current, loop, true);
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  if (!element.hasAttribute('tabindex')) {
    element.tabIndex = (document.activeElement === element) ? 0 : -1;
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
 * @param {Iterable<Element>} items
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
  for (const child of items) {
    if (!currentlyFocusedChild && document.activeElement === child) {
      currentlyFocusedChild = child;
    } else if (!currentTabIndexChild && child.getAttribute('tabindex') === '0') {
      currentTabIndexChild = child;
    } else {
      if (!firstFocusableChild && child.getAttribute('aria-hidden') !== 'true'
        && (focusableWhenDisabled || child.getAttribute('aria-disabled') !== 'true')) {
        firstFocusableChild = child;
      }
      child.tabIndex = -1;
      // child.setAttribute('tabindex', '-1');
    }
    attach(child);
  }
  if (currentlyFocusedChild) {
    currentlyFocusedChild.tabIndex = 0;
    // currentlyFocusedChild.setAttribute('tabindex', '0');
  } else if (currentTabIndexChild) {
    if (currentlyFocusedChild) {
      currentTabIndexChild.tabIndex = -1;
      // currentTabIndexChild.setAttribute('tabindex', '-1');
    }
  } else if (firstFocusableChild) {
    firstFocusableChild.tabIndex = 0;
    // firstFocusableChild.setAttribute('tabindex', '0');
  }
}
