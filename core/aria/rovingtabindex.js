import { iterateArrayLike, iterateElementSiblings, isRtl } from '../dom';

// https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex

/**
 * @param {Element} parentElement
 * @param {string} childClass
 * @param {boolean} [focusableWhenDisabled=true]
 * @return {void}
 */
export function attach(parentElement, childClass, focusableWhenDisabled = true) {
  /** @type {Element} */
  let currentlyFocusedChild = null;
  /** @type {Element} */
  let currentTabIndexChild = null;
  /** @type {Element} */
  let firstFocusableChild = null;
  iterateArrayLike(parentElement.getElementsByClassName(childClass), (child) => {
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
  parentElement.addEventListener('keydown', onParentKeyDown);
}


/**
 * @param {Element} parentElement
 * @param {string} childClass
 * @return {void}
 */
export function detach(parentElement, childClass) {
  iterateArrayLike(parentElement.getElementsByClassName(childClass), (child) => {
    child.removeEventListener('focus', onChildFocus);
  });
  parentElement.removeEventListener('keydown', onParentKeyDown);
}

/**
 * @param {FocusEvent} event
 * @return {void}
 */
function onChildFocus(event) {
  /** @type {Element} */
  const child = (event.currentTarget);
  child.setAttribute('tabindex', '0');
  iterateElementSiblings(child, (sibling) => {
    if (sibling.hasAttribute('tabindex')) {
      sibling.setAttribute('tabindex', '-1');
    }
  });
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
function onParentKeyDown(event) {
  if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
    return;
  }

  /** @type {Element} */
  const parentElement = (event.currentTarget);
  /** @type {Element} */
  const childElement = (event.target);
  if (childElement.parentElement !== parentElement) {
    return;
  }

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
    const role = parentElement.getAttribute('role');
    verticalOrientation = role !== 'listbox' && role !== 'tablist';
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
