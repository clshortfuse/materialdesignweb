// https://www.w3.org/TR/wai-aria-practices/#alert

import { Button } from '../button/index';
import { findElementParentByClassName, dispatchDomEvent } from '../common/dom';

// Time to wait until hide animation finishes before destroying element
const SNACKBAR_DESTROY_TIMEOUT_MS = 1000;

class SnackbarStack {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
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

/** @type {SnackbarStack[]} */
const OPEN_SNACKBARS = [];
class Snackbar {
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
  }

  static detach(snackbarElement) {
    const button = snackbarElement.getElementsByClassName('mdw-button')[0];
    if (button) {
      Button.detach(button);
      button.removeEventListener('click', Snackbar.onButtonClick);
    }
    // Remove timeouts and stacks
    OPEN_SNACKBARS.slice().reverse().forEach((stack, reverseIndex, array) => {
      if (stack.element === snackbarElement) {
        stack.clearHideTimeout();
        const index = array.length - reverseIndex - 1;
        OPEN_SNACKBARS.splice(index, 1);
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

  /** @return {SnackbarStack} */
  static getNextSnackbarStack() {
    const nextSnackbar = OPEN_SNACKBARS[0];
    if (nextSnackbar && (!nextSnackbar.element || !nextSnackbar.element.parentElement)) {
      // Item was removed from DOM externally
      OPEN_SNACKBARS.splice(0, 1);
      return this.getNextSnackbarStack();
    }
    return nextSnackbar;
  }

  /**
   * @param {Element} snackbarElement
   * @return {boolean} handled
   */
  static hide(snackbarElement) {
    if (snackbarElement.hasAttribute('mdw-hide')) {
      return false;
    }
    if (!dispatchDomEvent(snackbarElement, 'mdw:hide')) {
      return false;
    }
    snackbarElement.setAttribute('mdw-hide', '');
    let stackIndex = -1;
    OPEN_SNACKBARS.some((stack, index) => {
      if (stack.element === snackbarElement) {
        stackIndex = index;
        stack.clearHideTimeout();
        return true;
      }
      return false;
    });
    if (stackIndex !== -1) {
      OPEN_SNACKBARS.splice(stackIndex, 1);
    }
    if (snackbarElement.hasAttribute('mdw-autodestroy')) {
      setTimeout(() => {
        if (!snackbarElement.parentElement) {
          return;
        }
        if (!dispatchDomEvent(snackbarElement, 'mdw:destroy')) {
          return;
        }
        snackbarElement.parentElement.removeChild(snackbarElement);
      }, SNACKBAR_DESTROY_TIMEOUT_MS);
    }
    const nextSnackbar = Snackbar.getNextSnackbarStack();
    if (nextSnackbar) {
      nextSnackbar.element.setAttribute('mdw-consecutive', '');
      Snackbar.show(nextSnackbar.element);
    }
    return true;
  }

  /**
   * @param {Element} snackbarElement
   * @return {boolean} handled
   */
  static show(snackbarElement) {
    if (!snackbarElement.hasAttribute('mdw-hide') && snackbarElement.hasAttribute('mdw-show')) {
      // Already shown
      return false;
    }
    if (!dispatchDomEvent(snackbarElement, 'mdw:show')) {
      // Event was canceled
      return false;
    }
    let snackbarStackIndex = -1;
    let snackbarStack;
    OPEN_SNACKBARS.some((stack, index) => {
      if (stack.element === snackbarElement) {
        snackbarStack = stack;
        snackbarStackIndex = index;
        return true;
      }
      return false;
    });
    if (snackbarStackIndex > 0) {
      // Stacked for later
      return true;
    }
    if (!snackbarStack) {
      snackbarStack = new SnackbarStack(snackbarElement);
      OPEN_SNACKBARS.push(snackbarStack);
      if (OPEN_SNACKBARS.length !== 1) {
        // Not first, show later
        return true;
      }
    }
    snackbarElement.removeAttribute('mdw-hide');
    snackbarElement.setAttribute('mdw-show', '');
    Snackbar.attach(snackbarElement);
    snackbarStack.clearHideTimeout();
    if (snackbarElement.hasAttribute('mdw-autohide')) {
      const timeInSeconds = parseInt(snackbarElement.getAttribute('mdw-autohide'), 10) || 4;
      if (timeInSeconds > 0) {
        snackbarStack.hideTimeout = setTimeout(() => {
          Snackbar.hide(snackbarElement);
        }, timeInSeconds * 1000);
      }
    }
    return true;
  }

  /**
   * @param {Object} options
   * @param {!string} options.text
   * @param {!string=} options.buttonText
   * @param {string=} [options.buttonThemeColor='primary']
   * @param {boolean} [options.stacked=false]
   * @param {number|boolean} [options.autoHide=4] Auto hide time in seconds
   * @param {boolean} [options.autoDestroy=true] Destroy element after hide
   * @param {HTMLElement=} options.parent Parent element to which to append
   * @param {boolean=} options.show Show element after creation
   * @return {HTMLElement}
   */
  static create(options) {
    const element = document.createElement('div');
    element.classList.add('mdw-snackbar');
    element.setAttribute('role', 'alert');
    element.setAttribute('mdw-hide', '');

    const span = document.createElement('span');
    span.textContent = options.text;
    element.appendChild(span);

    if (options.buttonText) {
      const button = document.createElement('button');
      button.classList.add('mdw-button');
      if (typeof options.buttonThemeColor === 'undefined') {
        button.setAttribute('mdw-theme-color', 'primary');
      } else if (typeof options.buttonThemeColor === 'string') {
        button.setAttribute('mdw-theme-color', options.buttonThemeColor);
      } else {
        // Don't set attribute if null is passed
      }
      element.appendChild(button);
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
    if (options.parent) {
      options.parent.appendChild(element);
      if (options.show) {
        // Wait two frames before calling for, allowing animation to occur
        const onDrawCallback = () => {
          Snackbar.show(element);
        };
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(onDrawCallback);
          });
        } else {
          setTimeout(onDrawCallback, 2 / 60);
        }
      }
    }
    return element;
  }
}

export {
  Snackbar,
};
