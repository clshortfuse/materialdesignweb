// https://www.w3.org/TR/wai-aria-practices/#dialog_modal

import {
  dispatchDomEvent,
  iterateArrayLike,
  iterateSomeOfArrayLike,
  findElementParentByClassName,
  getChildElementByClass,
  setTextNode,
} from '../../core/dom';

import * as Button from '../button/index';

class DialogStack {
  /**
   * @param {Element} element
   * @param {Element} previousFocus
   * @param {Object=} state
   * @param {Object=} previousState
   */
  constructor(element, previousFocus, state, previousState) {
    this.element = element;
    this.previousFocus = previousFocus;
    this.state = state;
    this.previousState = previousState;
  }
}

/** @type {DialogStack[]} */
const OPEN_DIALOGS = [];

export const CANCEL_EVENT = 'mdw:dialog-cancel';

export const CONFIRM_EVENT = 'mdw:dialog-confirm';

export const CUSTOM_EVENT = 'mdw:dialog-custom';

export const DISMISS_EVENT = 'mdw:dialog-dismiss';

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('mdw-js', '');

  let dialogCloser = getChildElementByClass(element, 'mdw-dialog__close');
  if (!dialogCloser) {
    dialogCloser = document.createElement('div');
    dialogCloser.classList.add('mdw-dialog__close');
    if (element.firstChild) {
      element.insertBefore(dialogCloser, element.firstChild);
    } else {
      element.appendChild(dialogCloser);
    }
  }
  dialogCloser.addEventListener('click', onCancelClick);
  const popup = getChildElementByClass(element, 'mdw-dialog__popup');
  popup.addEventListener('keydown', onKeyDown);
  const buttons = popup.querySelectorAll('.mdw-dialog__button-area .mdw-button');
  let foundConfirmButton = false;
  let foundCancelButton = false;
  iterateArrayLike(buttons, (button) => {
    Button.attach(button);
    if (button.hasAttribute('mdw-custom')) {
      button.addEventListener('click', onCustomButtonClick);
      return;
    }
    if (!foundConfirmButton) {
      button.addEventListener('click', onConfirmClick);
      foundConfirmButton = true;
      return;
    }
    if (!foundCancelButton) {
      button.addEventListener('click', onCancelClick);
      foundCancelButton = true;
      return;
    }
    button.addEventListener('click', onCustomButtonClick);
  });
  setupARIA(element);
}

/**
 * @param {Element} dialogElement
 * @return {void}
 */
export function setupARIA(dialogElement) {
  if (dialogElement.hasAttribute('mdw-no-aria')) {
    return;
  }
  dialogElement.setAttribute('role', 'dialog');
  dialogElement.setAttribute('aria-modal', 'true');
  if (!dialogElement.hasAttribute('aria-hidden')) {
    dialogElement.setAttribute('aria-hidden', 'true');
  }
  const popupElement = dialogElement.getElementsByClassName('mdw-dialog__popup')[0];
  if (!popupElement) {
    return;
  }

  if (!popupElement.hasAttribute('aria-label') && !popupElement.hasAttribute('aria-labelledby')) {
    const titleElement = dialogElement.getElementsByClassName('mdw-dialog__title')[0];
    if (titleElement) {
      // titleElement
    }
  }
}

/**
 * @param {Element} dialogElement
 * @return {void}
 */
export function detach(dialogElement) {
  dialogElement.removeAttribute('mdw-js');
  const dialogCloser = getChildElementByClass(dialogElement, 'mdw-dialog__close');
  if (dialogCloser) {
    dialogCloser.removeEventListener('click', onCancelClick);
  }
  /** @type {HTMLElement} */
  const popupElement = (dialogElement.getElementsByClassName('mdw-dialog__popup')[0]);
  if (popupElement) {
    popupElement.removeEventListener('keydown', onKeyDown);
    popupElement.style.removeProperty('transform-origin');
    if (popupElement.hasAttribute('style') && !popupElement.getAttribute('style')) {
      popupElement.removeAttribute('style');
    }
  }
  const buttons = popupElement.querySelectorAll('.mdw-dialog__button-area .mdw-button');
  iterateArrayLike(buttons, (button) => {
    Button.detach(button);
    button.removeEventListener('click', onConfirmClick);
    button.removeEventListener('click', onCancelClick);
    button.removeEventListener('click', onCustomButtonClick);
  });
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onCancelClick(event) {
  if (event && event.currentTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
  /** @type {HTMLElement} */
  const cancelElement = (event.currentTarget);
  if (dispatchDomEvent(cancelElement, CANCEL_EVENT)) {
    const dialogElement = findElementParentByClassName(cancelElement, 'mdw-dialog');
    hide(dialogElement);
  }
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onConfirmClick(event) {
  if (event && event.currentTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
  /** @type {HTMLElement} */
  const button = (event.currentTarget);
  if (dispatchDomEvent(button, CONFIRM_EVENT)) {
    const dialogElement = findElementParentByClassName(button, 'mdw-dialog');
    hide(dialogElement);
  }
}

/**
 * @param {MouseEvent} event
 * @return {void}
 */
export function onCustomButtonClick(event) {
  if (event && event.currentTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
  }
  /** @type {HTMLElement} */
  const button = (event.currentTarget);
  if (dispatchDomEvent(button, CUSTOM_EVENT)) {
    const dialogElement = findElementParentByClassName(button, 'mdw-dialog');
    hide(dialogElement);
  }
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  if (event.key === 'Tab') {
    handleTabKeyPress(event);
    return;
  }
  if (event.key === 'Escape' || event.key === 'Esc') {
    onEscapeKeyDown(event);
  }
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onEscapeKeyDown(event) {
  event.stopPropagation();
  event.preventDefault();
  /** @type {HTMLElement} */
  const popupElement = (event.currentTarget);
  const dialogElement = findElementParentByClassName(popupElement, 'mdw-dialog');
  cancel(dialogElement);
}

/**
 * @param {PopStateEvent} event
 * @return {void}
 */
export function onPopState(event) {
  if (!event.state) {
    return;
  }
  const lastOpenDialog = OPEN_DIALOGS[OPEN_DIALOGS.length - 1];
  if (!lastOpenDialog || !lastOpenDialog.previousState) {
    return;
  }
  if ((lastOpenDialog.previousState === event.state) || Object.keys(event.state)
    .every(key => event.state[key] === lastOpenDialog.previousState[key])) {
    if (dispatchDomEvent(lastOpenDialog.element, CANCEL_EVENT)) {
      hide(lastOpenDialog.element);
    } else {
      // Revert pop state by pushing state again
      const title = getTitleText(lastOpenDialog.element);
      window.history.pushState(lastOpenDialog.state, title);
    }
  }
}

/**
 * @param {Element} dialogElement
 * @return {void}
 */
export function cancel(dialogElement) {
  if (dispatchDomEvent(dialogElement, CANCEL_EVENT)) {
    hide(dialogElement);
  }
}

/**
 * @param {Element} dialogElement
 * @return {void}
 */
export function confirm(dialogElement) {
  if (dispatchDomEvent(dialogElement, CONFIRM_EVENT)) {
    hide(dialogElement);
  }
}

/**
 * @param {Element} dialogElement
 * @return {string}
 */
export function getTitleText(dialogElement) {
  let title = 'Dialog';
  const titleElement = dialogElement.getElementsByClassName('mdw-dialog__title')[0];
  if (titleElement) {
    title = titleElement.textContent;
  } else {
    const bodyElement = dialogElement.getElementsByClassName('mdw-dialog__body')[0];
    if (bodyElement) {
      title = bodyElement.textContent;
    }
  }
  return title;
}

/**
 * @param {Element} dialogElement
 * @return {boolean} handled
 */
export function hide(dialogElement) {
  if (dialogElement.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  if (!dispatchDomEvent(dialogElement, DISMISS_EVENT)) {
    return false;
  }
  dialogElement.setAttribute('aria-hidden', 'true');
  let stackIndex = -1;
  OPEN_DIALOGS.some((stack, index) => {
    if (stack.element === dialogElement) {
      stackIndex = index;
      return true;
    }
    return false;
  });
  if (stackIndex !== -1) {
    const stack = OPEN_DIALOGS[stackIndex];
    if (stack.previousFocus) {
      if (findElementParentByClassName(document.activeElement, 'mdw-dialog') === dialogElement) {
        // Only pop focus back when hiding a dialog with focus within itself.
        try {
          stack.previousFocus.focus();
        } catch (e) {
          // Failed to focus
        }
      }
    }
    OPEN_DIALOGS.splice(stackIndex, 1);
    if (stack.state && window.history && window.history.state) {
      // IE11 returns a cloned state object, not the original
      if (stack.state.hash === window.history.state.hash) {
        window.history.back();
      }
    }
  }
  if (!OPEN_DIALOGS.length) {
    window.removeEventListener('popstate', onPopState);
  }
  return true;
}

/**
 * @param {Element} dialogElement
 * @param {(MouseEvent|KeyboardEvent|PointerEvent)=} event
 * @return {boolean} handled
 */
export function show(dialogElement, event) {
  if (event && event.currentTarget instanceof HTMLAnchorElement) {
    // Prevent anchor link
    event.preventDefault();
  }
  let changed = false;

  updateTransformOrigin(dialogElement, event);
  if (dialogElement.getAttribute('aria-hidden') !== 'false') {
    dialogElement.setAttribute('aria-hidden', 'false');
    changed = true;
  }
  if (changed) {
    attach(dialogElement);
    const previousFocus = document.activeElement;
    const newState = { hash: Math.random().toString(36).substr(2, 16) };
    let previousState = null;
    if (window.history && window.history.pushState) {
      if (!window.history.state) {
        // Create new previous state
        window.history.replaceState({
          hash: Math.random().toString(36).substr(2, 16),
        }, document.title);
      }
      previousState = window.history.state;
      const title = getTitleText(dialogElement);
      window.history.pushState(newState, title);
      window.addEventListener('popstate', onPopState);
    }
    const dialogStack = new DialogStack(dialogElement, previousFocus, newState, previousState);
    OPEN_DIALOGS.push(dialogStack);
    const focusElement = dialogElement.querySelector('[mdw-autofocus]');
    try {
      if (focusElement) {
        if (event && event.target instanceof Element) {
          const callerOverlayTouch = event.target.getAttribute('mdw-overlay-touch');
          if (callerOverlayTouch != null) {
            focusElement.setAttribute('mdw-overlay-touch', callerOverlayTouch);
          }
        }
        focusElement.focus();
      } else {
        dialogElement.focus();
      }
    } catch (e) {
      console.error(e);
      // Failed to focus
    }
  }
  return changed;
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function handleTabKeyPress(event) {
  /** @type {Element} */
  const popupElement = (event.currentTarget);
  const focusableElements = popupElement.querySelectorAll([
    'button:not(:disabled):not([tabindex="-1"])',
    '[href]:not(:disabled):not([tabindex="-1"])',
    'input:not(:disabled):not([tabindex="-1"])',
    'select:not(:disabled):not([tabindex="-1"])',
    'textarea:not(:disabled):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])'].join(', '));
  let foundTarget = false;
  let candidate = null;
  iterateSomeOfArrayLike(focusableElements, (el) => {
    if (el === event.target) {
      foundTarget = true;
      if (event.shiftKey) {
        return true;
      }
    } else if (event.shiftKey) {
      candidate = el;
    } else if (foundTarget) {
      candidate = el;
      return true;
    }
    return false;
  });
  if (!candidate) {
    if (event.shiftKey) {
      // Select last item
      candidate = focusableElements[focusableElements.length - 1];
    } else {
      // Select first item
      candidate = focusableElements[0];
    }
  }
  event.stopPropagation();
  event.preventDefault();
  if (candidate) {
    try {
      candidate.focus();
    } catch (e) {
      // Failed to focus
    }
  }
}

/**
 * @param {Element} dialogElement
 * @param {(DocumentFragment|string)=} content
 * @return {void}
 */
export function updateTitle(dialogElement, content) {
  let title = dialogElement.getElementsByClassName('mdw-dialog__title')[0];
  if (!content) {
    if (!title) {
      // Nothing to be done
      return;
    }
    title.parentElement.removeChild(title);
    return;
  }
  if (!title) {
    title = document.createElement('div');
    title.classList.add('mdw-dialog__title');
    const popup = dialogElement.getElementsByClassName('mdw-dialog__popup')[0];
    popup.insertBefore(title, popup.firstChild);
  }
  if (content instanceof DocumentFragment) {
    while (title.lastChild) {
      title.removeChild(title.lastChild);
    }
    title.appendChild(content);
  } else {
    title.textContent = content;
  }
}


/**
 * @param {Element} dialogElement
 * @param {string[]} texts
 * @return {void}
 */
export function updateButtonText(dialogElement, texts) {
  const buttons = dialogElement.querySelectorAll('.mdw-dialog__button-area .mdw-button');
  iterateArrayLike(buttons, (button, index) => {
    setTextNode(button, texts[index]);
  });
}

/**
 * @param {Element} dialogElement
 * @param {(DocumentFragment|string)=} content
 * @return {void}
 */
export function updateBody(dialogElement, content) {
  let body = dialogElement.getElementsByClassName('mdw-dialog__body')[0];
  if (!content) {
    if (!body) {
      // Nothing to be done
      return;
    }
    body.parentElement.removeChild(body);
    return;
  }
  if (!body) {
    body = document.createElement('div');
    body.classList.add('mdw-dialog__body');
    const title = dialogElement.getElementsByClassName('mdw-dialog__title')[0];
    if (title) {
      title.insertAdjacentElement('afterend', body);
    } else {
      const popup = dialogElement.getElementsByClassName('mdw-dialog__popup')[0];
      popup.insertBefore(body, popup.firstChild);
    }
  }
  if (content instanceof DocumentFragment) {
    while (body.lastChild) {
      body.removeChild(body.lastChild);
    }
    body.appendChild(content);
  } else {
    body.textContent = content;
  }
}

/**
 * @param {Object} options
 * @param {(DocumentFragment|string)=} options.title
 * @param {(DocumentFragment|string)=} options.body
 * @param {string[]=} options.buttons
 * @param {boolean=} options.stacked
 * @param {Element=} options.parent
 * @param {boolean} [options.custom=false] Use custom button events
 * @param {(string|number)=} [options.autofocus=0] Autofocus button by index or text
 * @return {Element}
 */
export function create(options) {
  const element = document.createElement('div');
  element.classList.add('mdw-dialog');

  const popup = document.createElement('div');
  popup.classList.add('mdw-dialog__popup');
  element.appendChild(popup);

  updateTitle(element, options.title);
  updateBody(element, options.body);

  if (options.buttons) {
    const buttonArea = document.createElement('div');
    buttonArea.classList.add('mdw-dialog__button-area');
    let index = 0;
    options.buttons.forEach((buttonText) => {
      const button = document.createElement('div');
      button.classList.add('mdw-button');
      button.classList.add('mdw-theme');
      button.setAttribute('tabindex', '0');
      button.setAttribute('mdw-color', 'accent');
      if (options.custom) {
        button.setAttribute('mdw-custom', '');
      }
      button.textContent = buttonText;
      buttonArea.appendChild(button);
      if ((options.autofocus == null && index === 0)
        || options.autofocus === index || options.autofocus === buttonText) {
        button.setAttribute('mdw-autofocus', '');
      }
      index += 1;
    });
    if (options.stacked) {
      buttonArea.setAttribute('mdw-stacked', '');
    }
    popup.appendChild(buttonArea);
  }
  if (options.parent) {
    options.parent.appendChild(element);
  }
  attach(element);
  return element;
}

/**
 * @param {Element} dialogElement
 * @param {(MouseEvent|KeyboardEvent|PointerEvent)=} event
 * @return {void}
 */
export function updateTransformOrigin(dialogElement, event) {
  /** @type {HTMLElement} */
  const popup = (dialogElement.getElementsByClassName('mdw-dialog__popup')[0]);
  popup.style.removeProperty('transform-origin');
  if (!event) {
    return;
  }
  let pageX;
  let pageY;
  const dialogRect = dialogElement.getBoundingClientRect();
  if ('pageX' in event && 'pageY' in event) {
    ({ pageX, pageY } = event);
    pageX -= window.pageXOffset;
    pageY -= window.pageYOffset;
  } else {
    /** @type {Element} */
    const target = (event.currentTarget || event.target);
    const rect = target.getBoundingClientRect();
    if (!rect.width && !rect.width && !rect.left && !rect.top) {
      return;
    }
    pageX = rect.left + (rect.width / 2);
    pageY = rect.top + (rect.height / 2);
  }
  const transformOriginX = pageX - dialogRect.left - popup.offsetLeft;
  const transformOriginY = pageY - dialogRect.top - popup.offsetTop;
  popup.style.setProperty('transform-origin', `${transformOriginX}px ${transformOriginY}px`);
}

// Aliases
export const dismiss = hide;
