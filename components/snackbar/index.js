// https://www.w3.org/TR/wai-aria-1.1/#alert
// https://www.w3.org/TR/wai-aria-practices/#alert

import { Button } from '../button/index';
import {
  dispatchDomEvent,
  findElementParentByClassName,
  nextTick,
  setTextNode,
} from '../common/dom';

/**
 * @typedef SnackbarCreateOptions
 * @property {!string} text
 * @property {!string=} buttonText
 * @property {string=} [buttonThemeColor='primary']
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
class Snackbar {
  static get HIDE_EVENT() {
    return 'mdw:snackbar-hide';
  }

  static get SHOW_EVENT() {
    return 'mdw:snackbar-show';
  }

  /**
   * @param {Element} snackbarElement
   * @return {void}
   */
  static attach(snackbarElement) {
    const button = snackbarElement.getElementsByClassName('mdw-button')[0];
    if (button) {
      Button.attach(button);
      button.addEventListener('click', Snackbar.onButtonClick);
    }
    snackbarElement.setAttribute('mdw-js', '');
    snackbarElement.addEventListener('animationend', Snackbar.onAnimationEnd);
    snackbarElement.addEventListener('keydown', Snackbar.onKeyDown);
    this.setupARIA(snackbarElement);
  }

  /**
   * @param {Element} snackbarElement
   * @return {void}
   */
  static setupARIA(snackbarElement) {
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
  static onKeyDown(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      // Allow users to close snackbar with escape, for accessibilty reasons
      event.stopPropagation();
      event.preventDefault();
      /** @type {Element} */
      const snackbarElement = (event.currentTarget);
      Snackbar.hide(snackbarElement);
    }
  }


  static detach(snackbarElement) {
    const button = snackbarElement.getElementsByClassName('mdw-button')[0];
    if (button) {
      Button.detach(button);
      button.removeEventListener('click', Snackbar.onButtonClick);
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

  static onButtonClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    const snackbarElement = findElementParentByClassName(event.currentTarget, 'mdw-snackbar');
    Snackbar.hide(snackbarElement);
  }

  /** @return {SnackbarQueueItem} */
  static getNextSnackbarQueueItem() {
    const nextSnackbar = SnackbarQueueItem[0];
    if (nextSnackbar && (!nextSnackbar.element || !nextSnackbar.element.parentElement)) {
      // Item was removed from DOM externally
      SNACKBAR_QUEUE.splice(0, 1);
      return this.getNextSnackbarQueueItem();
    }
    return nextSnackbar;
  }

  static findNextQueueItem(element) {
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
  static onAnimationEnd(event) {
    Snackbar.handleAnimationChange(/** @type {Element} */ (event.currentTarget));
  }

  /**
   * @param {Element} snackbarElement
   * @return {void}
   */
  static handleAnimationChange(snackbarElement) {
    const currentQueueItem = Snackbar.findNextQueueItem(snackbarElement);
    const showing = snackbarElement.getAttribute('aria-hidden') === 'false';
    if (showing) {
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
        Snackbar.hide(snackbarElement);
      }, timeInSeconds * 1000);
      if (currentQueueItem) {
        currentQueueItem.hideTimeout = timeout;
      }
      return;
    }
    if (currentQueueItem) {
      SNACKBAR_QUEUE.splice(SNACKBAR_QUEUE.indexOf(currentQueueItem), 1);
    }
    const nextQueueItem = Snackbar.findNextQueueItem(snackbarElement);
    if (nextQueueItem) {
      Snackbar.update(snackbarElement, nextQueueItem.options);
      Snackbar.show(snackbarElement);
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
  static hide(snackbarElement) {
    if (snackbarElement.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (!dispatchDomEvent(snackbarElement, Snackbar.HIDE_EVENT)) {
      return false;
    }
    snackbarElement.setAttribute('aria-hidden', 'true');
    if (window.getComputedStyle(snackbarElement).animationName === 'none') {
      nextTick(() => Snackbar.handleAnimationChange(snackbarElement));
    }
    return true;
  }

  /**
   * @param {?Element} snackbarElement
   * @return {boolean} changed
   */
  static show(snackbarElement) {
    if (snackbarElement.getAttribute('aria-hidden') === 'false') {
      return false;
    }
    if (!dispatchDomEvent(snackbarElement, Snackbar.SHOW_EVENT)) {
      return false;
    }
    snackbarElement.setAttribute('aria-hidden', 'false');
    Snackbar.attach(snackbarElement);
    if (window.getComputedStyle(snackbarElement).animationName === 'none') {
      nextTick(() => Snackbar.handleAnimationChange(snackbarElement));
    }
    return true;
  }

  /**
   * @param {Element} element
   * @param {SnackbarCreateOptions} options
   * @return {void}
   */
  static update(element, options) {
    element.classList.add('mdw-snackbar');
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
        button = document.createElement('button');
        element.appendChild(button);
      }
      setTextNode(button, options.buttonText);
      button.classList.add('mdw-button');
      if (typeof options.buttonThemeColor === 'undefined') {
        button.classList.add('mdw-theme');
        button.setAttribute('mdw-color', 'primary');
      } else if (typeof options.buttonThemeColor === 'string') {
        button.classList.add('mdw-theme');
        button.setAttribute('mdw-color', options.buttonThemeColor);
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
  static create(options) {
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
        Snackbar.update(element, options);
        Snackbar.show(element);
        Snackbar.update(element, options);
      } else {
        Snackbar.show(element);
      }
    }
    return element;
  }
}

export {
  Snackbar,
};
