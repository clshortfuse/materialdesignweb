// https://www.w3.org/TR/wai-aria-1.1/#alert
// https://www.w3.org/TR/wai-aria-practices/#alert

import {
  dispatchDomEvent,
  setTextNode,
} from '../../core/dom.js';
import * as Button from '../button/index.js';

/**
 * @typedef SnackbarCreateOptions
 * @prop {!string} text
 * @prop {!string} [buttonText]
 * @prop {string} [buttonInk='primary']
 * @prop {boolean} [stacked=false]
 * @prop {number|boolean} [autoHide=4] Auto hide time in seconds
 * @prop {boolean} [autoDestroy=true] Destroy element after hide
 * @prop {Element} [parent] Parent element to which to append
 * @prop {boolean} [show=true] Show element after creation
 * @prop {boolean} [skipQueue=false] Skip queue
 */

class SnackbarQueueItem {
  /**
   * @param {Element} element
   * @param {SnackbarCreateOptions} [options]
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
export function setupARIA(snackbarElement) {
  if (snackbarElement.hasAttribute('mdw-no-aria')) {
    return;
  }
  snackbarElement.setAttribute('role', 'alert');
  snackbarElement.setAttribute('tabindex', '-1');
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
    const timeInSeconds = Number.parseFloat(autoHideString) || 4;
    if (timeInSeconds < 0) {
      return;
    }
    const timeout = setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      hide(snackbarElement);
    }, timeInSeconds * 1000);
    if (currentQueueItem) {
      currentQueueItem.hideTimeout = timeout;
    }
    return;
  }

  const nextQueueItem = findNextQueueItem(snackbarElement);
  if (nextQueueItem) {
    // eslint-disable-next-line no-use-before-define
    update(snackbarElement, nextQueueItem.options);
    // eslint-disable-next-line no-use-before-define
    show(snackbarElement);
    return;
  }
  if (snackbarElement.hasAttribute('mdw-autodestroy') && snackbarElement.parentElement) {
    snackbarElement.remove();
  }
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
    requestAnimationFrame(() => handleAnimationChange(snackbarElement));
  }
  return true;
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
    const snackbarElement = /** @type {Element} */ (event.currentTarget);
    hide(snackbarElement);
  }
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onButtonClick(event) {
  const buttonElement = /** @type {HTMLElement} */ (event.currentTarget);
  if (buttonElement instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
  const snackbarElement = buttonElement.closest('.mdw-snackbar');
  hide(snackbarElement);
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
    // Calculated against white, opaque value is #212121 (Gray-900)
    element.classList.add('mdw-theme');
    element.setAttribute('mdw-surface', 'background 900');
    element.setAttribute('mdw-dark', '');
  }
  let span = element.getElementsByTagName('span')[0];
  if (span) {
    // To trigger screen readers, we destroy and create a new span and textnode
    span.remove();
  }
  span = document.createElement('span');
  if (element.firstChild) {
    element.prepend(span);
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
    button.remove();
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
export function detach(snackbarElement) {
  const button = snackbarElement.getElementsByClassName('mdw-button')[0];
  if (button) {
    Button.detach(button);
    button.removeEventListener('click', onButtonClick);
  }
  // Remove timeouts and stacks
  for (let i = SNACKBAR_QUEUE.length - 1; i >= 0; i--) {
    const queue = SNACKBAR_QUEUE[i];
    if (queue.element === snackbarElement) {
      queue.clearHideTimeout();
      SNACKBAR_QUEUE.splice(i, 1);
    }
  }
  snackbarElement.removeAttribute('mdw-js');
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
    requestAnimationFrame(() => handleAnimationChange(snackbarElement));
  }
  return true;
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
