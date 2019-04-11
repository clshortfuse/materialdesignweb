// https://www.w3.org/TR/wai-aria-1.1/#alert
// https://www.w3.org/TR/wai-aria-practices/#alert

import {
  dispatchDomEvent,
  findElementParentByClassName,
  nextTick,
  setTextNode,
} from '../../core/dom';

import * as Button from '../button/index';

/**
 * @typedef SnackbarCreateOptions
 * @property {!string} text
 * @property {!string=} buttonText
 * @property {string=} [buttonInk='primary']
 * @property {boolean} [stacked=false]
 * @property {number|boolean} [autoHide=4] Auto hide time in seconds
 * @property {boolean} [autoDestroy=true] Destroy element after hide
 * @property {Element=} parent Parent element to which to append
 * @property {boolean=} [show=true] Show element after creation
 * @property {boolean=} [skipQueue=false] Skip queue
 */

class SnackbarQueueItem {
  /**
   * @param {Element} element
   * @param {SnackbarCreateOptions=} options
   */
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.hideTimeout = null;
  }

  /** @return {void} */
  clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}

/** @type {SnackbarQueueItem[]} */
const SNACKBAR_QUEUE = [];

export const HIDE_EVENT = 'mdw:snackbar-hide';
export const SHOW_EVENT = 'mdw:snackbar-show';

/**
 * @param {Element} snackbarElement
 * @return {void}
 */
export function attach(snackbarElement) {
  const button = snackbarElement.getElementsByClassName('mdw-button')[0];
  if (button) {
    Button.attach(button);
    button.addEventListener('click', onButtonClick);
  }
  snackbarElement.setAttribute('mdw-js', '');
  snackbarElement.addEventListener('animationend', onAnimationEnd);
  snackbarElement.addEventListener('keydown', onKeyDown);
  setupARIA(snackbarElement);
}

/**
 * @param {Element} snackbarElement
 * @return {void}
 */
export function setupARIA(snackbarElement) {
  if (snackbarElement.hasAttribute('mdw-no-aria')) {
    return;
  }
  snackbarElement.setAttribute('role', 'alert');
  snackbarElement.setAttribute('tabindex', '-1');
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    // Allow users to close snackbar with escape, for accessibilty reasons
    event.stopPropagation();
    event.preventDefault();
    /** @type {Element} */
    const snackbarElement = (event.currentTarget);
    hide(snackbarElement);
  }
}

/**
 * @param {Element} snackbarElement
 * @return {void}
 */
export function detach(snackbarElement) {
  const button = snackbarElement.getElementsByClassName('mdw-button')[0];
  if (button) {
    Button.detach(button);
    button.removeEventListener('click', onButtonClick);
  }
  // Remove timeouts and stacks
  SNACKBAR_QUEUE.slice().reverse().forEach((queue, reverseIndex, array) => {
    if (queue.element === snackbarElement) {
      queue.clearHideTimeout();
      const index = array.length - reverseIndex - 1;
      SNACKBAR_QUEUE.splice(index, 1);
    }
  });
  snackbarElement.removeAttribute('mdw-js');
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onButtonClick(event) {
  /** @type {HTMLElement} */
  const buttonElement = (event.currentTarget);
  if (buttonElement instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
  const snackbarElement = findElementParentByClassName(buttonElement, 'mdw-snackbar');
  hide(snackbarElement);
}

/** @return {SnackbarQueueItem} */
export function getNextSnackbarQueueItem() {
  const nextSnackbar = SnackbarQueueItem[0];
  if (nextSnackbar && (!nextSnackbar.element || !nextSnackbar.element.parentElement)) {
    // Item was removed from DOM externally
    SNACKBAR_QUEUE.splice(0, 1);
    return getNextSnackbarQueueItem();
  }
  return nextSnackbar;
}

/**
 * @param {Element} element
 * @return {SnackbarQueueItem}
 */
export function findNextQueueItem(element) {
  let queue = null;
  SNACKBAR_QUEUE.some((q) => {
    if (q.element === element) {
      queue = q;
      return true;
    }
    return false;
  });
  return queue;
}

/**
 * @param {AnimationEvent} event
 * @return {void}
 */
export function onAnimationEnd(event) {
  handleAnimationChange(/** @type {Element} */ (event.currentTarget));
}

/**
 * @param {Element} snackbarElement
 * @return {void}
 */
export function handleAnimationChange(snackbarElement) {
  const showing = snackbarElement.getAttribute('aria-hidden') === 'false';
  if (showing) {
    const currentQueueItem = findNextQueueItem(snackbarElement);
    if (currentQueueItem && currentQueueItem.hideTimeout) {
      return;
    }
    const autoHideString = snackbarElement.getAttribute('mdw-autohide');
    if (autoHideString == null) {
      return;
    }
    const timeInSeconds = parseFloat(autoHideString) || 4;
    if (timeInSeconds < 0) {
      return;
    }
    const timeout = setTimeout(() => {
      hide(snackbarElement);
    }, timeInSeconds * 1000);
    if (currentQueueItem) {
      currentQueueItem.hideTimeout = timeout;
    }
    return;
  }

  const nextQueueItem = findNextQueueItem(snackbarElement);
  if (nextQueueItem) {
    update(snackbarElement, nextQueueItem.options);
    show(snackbarElement);
    return;
  }
  if (snackbarElement.hasAttribute('mdw-autodestroy')) {
    if (snackbarElement.parentElement) {
      snackbarElement.parentElement.removeChild(snackbarElement);
    }
  }
}

/**
 * @param {Element} snackbarElement
 * @return {boolean} changed
 */
export function hide(snackbarElement) {
  if (snackbarElement.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  if (!dispatchDomEvent(snackbarElement, HIDE_EVENT)) {
    return false;
  }
  snackbarElement.setAttribute('aria-hidden', 'true');
  const currentQueueItem = findNextQueueItem(snackbarElement);
  if (currentQueueItem) {
    SNACKBAR_QUEUE.splice(SNACKBAR_QUEUE.indexOf(currentQueueItem), 1);
  }
  if (window.getComputedStyle(snackbarElement).animationName === 'none') {
    nextTick(() => handleAnimationChange(snackbarElement));
  }
  return true;
}

/**
 * @param {?Element} snackbarElement
 * @return {boolean} changed
 */
export function show(snackbarElement) {
  if (snackbarElement.getAttribute('aria-hidden') === 'false') {
    return false;
  }
  if (!dispatchDomEvent(snackbarElement, SHOW_EVENT)) {
    return false;
  }
  snackbarElement.setAttribute('aria-hidden', 'false');
  attach(snackbarElement);
  if (window.getComputedStyle(snackbarElement).animationName === 'none') {
    nextTick(() => handleAnimationChange(snackbarElement));
  }
  return true;
}

/**
 * @param {Element} element
 * @param {SnackbarCreateOptions} options
 * @return {void}
 */
export function update(element, options) {
  element.classList.add('mdw-snackbar');
  if (!element.classList.contains('mdw-theme')) {
    // Guidelines conflict stating a background should be fully opaque
    // But says spec says to use #000000 with 87% opacity
    // Calculated against white, opaque value is #212121 (Grey-900)
    element.classList.add('mdw-theme');
    element.setAttribute('mdw-surface', 'background 900');
    element.setAttribute('mdw-dark', '');
  }
  let span = element.getElementsByTagName('span')[0];
  if (span) {
    // To trigger screen readers, we destroy and create a new span and textnode
    span.parentElement.removeChild(span);
  }
  span = document.createElement('span');
  if (element.firstChild) {
    element.insertBefore(span, element.firstChild);
  } else {
    element.appendChild(span);
  }
  const textNode = document.createTextNode(options.text);
  span.appendChild(textNode);
  let button = element.getElementsByClassName('mdw-button')[0];
  if (options.buttonText) {
    if (!button) {
      button = document.createElement('a');
      element.appendChild(button);
    }
    setTextNode(button, options.buttonText);
    button.classList.add('mdw-button');
    if (typeof options.buttonInk === 'undefined') {
      button.classList.add('mdw-theme');
      button.setAttribute('mdw-ink', 'secondary');
    } else if (typeof options.buttonInk === 'string') {
      button.classList.add('mdw-theme');
      button.setAttribute('mdw-ink', options.buttonInk);
    } else {
      // Don't set attribute if null is passed
    }
  } else if (button && button.parentElement) {
    button.parentElement.removeChild(button);
  }
  if (options.stacked) {
    element.setAttribute('mdw-stacked', '');
  }
  if (options.autoHide !== false) {
    let timeInSeconds;
    if (options.autoHide === true) {
      timeInSeconds = 4;
    } else if (options.autoHide == null) {
      timeInSeconds = 4;
    } else {
      timeInSeconds = options.autoHide;
    }
    if (timeInSeconds > 0) {
      element.setAttribute('mdw-autohide', timeInSeconds.toString());
    }
  }
  if (options.autoDestroy !== false) {
    element.setAttribute('mdw-autodestroy', '');
  }
}

/**
 * Creates a Snackbar element if required and adds to show queue
 * @param {SnackbarCreateOptions} options
 * @return {HTMLElement}
 */
export function create(options) {
  let element;
  let newlyCreated = false;
  if (options.parent) {
    /** @type {HTMLElement} */
    element = (options.parent.getElementsByClassName('mdw-snackbar')[0]);
  }
  if (!element) {
    element = document.createElement('div');
    if (options.parent) {
      options.parent.appendChild(element);
    }
    newlyCreated = true;
  }
  const queue = new SnackbarQueueItem(element, options);
  if (options.skipQueue) {
    SNACKBAR_QUEUE.splice(0, 0, queue);
  } else {
    SNACKBAR_QUEUE.push(queue);
  }

  if (options.show !== false) {
    if (newlyCreated) {
      // Update after show to trigger a text change
      update(element, options);
      show(element);
      update(element, options);
    } else {
      show(element);
    }
  }
  return element;
}
