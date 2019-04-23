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
   * @param {Object} [state]
   * @param {Object} [previousState]
   */
  constructor(element, previousFocus, state, previousState) {
    this.element = (element);
    this.previousFocus = (previousFocus);
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
  element.setAttribute('mdw-dialog-js', '');
  element.addEventListener('transitionend', onTransitionEnd);

  let dialogCloser = getChildElementByClass(element, 'mdw-dialog__close');
  if (!dialogCloser) {
    dialogCloser = document.createElement('div');
    dialogCloser.className = 'mdw-dialog__close';
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
 * @param {TransitionEvent} event
 * @return {void}
 */
export function onTransitionEnd(event) {
  if (event.propertyName !== 'opacity') {
    return;
  }
  /** @type {HTMLElement} */
  const dialogElement = (event.currentTarget);
  if (dialogElement.getAttribute('aria-hidden') !== 'true') {
    return;
  }
  /** @type {HTMLElement} */
  const popupElement = (dialogElement.getElementsByClassName('mdw-dialog__popup')[0]);
  if (!popupElement) {
    return;
  }
  popupElement.style.removeProperty('display');
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
  dialogElement.removeEventListener('transitionend', onTransitionEnd);
  dialogElement.removeAttribute('mdw-dialog-js');
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
  const dialogElement = findElementParentByClassName(cancelElement, 'mdw-dialog');
  cancel(dialogElement);
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
  const dialogElement = findElementParentByClassName(button, 'mdw-dialog');
  confirm(dialogElement);
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
  const dialogElement = findElementParentByClassName(button, 'mdw-dialog');
  if (dispatchDomEvent(dialogElement, CUSTOM_EVENT)) {
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
  // .mdw-dialog__popup hidden by transitionEnd event
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
    if (stack.previousFocus && stack.previousFocus instanceof HTMLElement) {
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
 * @param {Event} [event]
 * @return {boolean} handled
 */
export function show(dialogElement, event) {
  if (event && event.type === 'click' && event.currentTarget instanceof HTMLAnchorElement) {
    // Prevent anchor link
    event.preventDefault();
  }
  let changed = false;

  if (dialogElement.getAttribute('aria-hidden') !== 'false') {
    dialogElement.setAttribute('aria-hidden', 'false');
    /** @type {HTMLElement} */
    const popupElement = (dialogElement.getElementsByClassName('mdw-dialog__popup')[0]);
    popupElement.style.setProperty('display', 'flex');
    changed = true;
  }

  updateTransformOrigin(dialogElement, event);

  if (!changed) {
    return false;
  }
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
    if (focusElement && focusElement instanceof HTMLElement) {
      if (focusElement.scrollIntoView) {
        focusElement.scrollIntoView();
      }
      focusElement.focus();
    } else if (dialogElement instanceof HTMLElement) {
      dialogElement.focus();
    }
  } catch (e) {
    // Failed to focus
  }
  return true;
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
  if (candidate && candidate instanceof HTMLElement) {
    try {
      candidate.focus();
    } catch (e) {
      // Failed to focus
    }
  }
}

/**
 * @param {Element} dialogElement
 * @param {(DocumentFragment|string)} [content]
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
    title.className = 'mdw-dialog__title';
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
 * @param {(DocumentFragment|string)} [content]
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
    body.className = 'mdw-dialog__body mdw-theme';
    body.setAttribute('mdw-ink', 'medium');
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
 * @param {(DocumentFragment|string)} [options.title]
 * @param {(DocumentFragment|string)} [options.body]
 * @param {string[]} [options.buttons]
 * @param {boolean} [options.stacked=false]
 * @param {Element} [options.parent]
 * @param {boolean} [options.custom=false] Use custom button events
 * @param {(string|number)} [options.autofocus=0] Autofocus button by index or text
 * @return {Element}
 */
export function create(options) {
  const element = document.createElement('div');
  element.className = 'mdw-dialog';

  const popup = document.createElement('div');
  popup.className = 'mdw-dialog__popup mdw-theme';
  popup.setAttribute('mdw-surface', 'card');
  element.appendChild(popup);

  updateTitle(element, options.title);
  updateBody(element, options.body);

  if (options.buttons) {
    const buttonArea = document.createElement('div');
    buttonArea.className = 'mdw-dialog__button-area';
    let index = 0;
    options.buttons.forEach((buttonText) => {
      const button = document.createElement('div');
      button.className = 'mdw-button mdw-theme';
      button.setAttribute('tabindex', '0');
      button.setAttribute('mdw-ink', 'secondary');
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
 * @param {Event} [event]
 * @return {void}
 */
export function updateTransformOrigin(dialogElement, event) {
  /** @type {HTMLElement} */
  const popup = (dialogElement.getElementsByClassName('mdw-dialog__popup')[0]);
  popup.style.removeProperty('transform-origin');
  if (!event) {
    return;
  }
  const hadLayer = popup.style.getPropertyValue('display') != null;
  if (!hadLayer) {
    popup.style.setProperty('display', 'flex');
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
    const target = (event.target || event.currentTarget);
    if (target instanceof Element === false) {
      return;
    }
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
  if (!hadLayer) {
    popup.style.removeProperty('display');
  }
}

// Aliases
export const dismiss = hide;
