// https://www.w3.org/TR/wai-aria-practices/#dialog_modal

import { Button } from '../button/index';
import { getChildElementByClass, findElementParentByClassName, dispatchDomEvent } from '../common/dom';

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
class Dialog {
  /**
   * @param {Element} element
   * @return {void}
   */
  static attach(element) {
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
    dialogCloser.addEventListener('click', Dialog.onCancelClick);
    const popup = getChildElementByClass(element, 'mdw-dialog__popup');
    popup.addEventListener('keydown', Dialog.onKeyDown);
    const buttons = popup.querySelectorAll('.mdw-dialog__button-area .mdw-button');
    let foundConfirmButton = false;
    let foundCancelButton = false;
    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons.item(i);
      Button.attach(button);
      if (button.hasAttribute('mdw-custom')) {
        button.addEventListener('click', Dialog.onCustomButtonClick);
      } else if (!foundConfirmButton) {
        button.addEventListener('click', Dialog.onConfirmClick);
        foundConfirmButton = true;
      } else if (!foundCancelButton) {
        button.addEventListener('click', Dialog.onCancelClick);
        foundCancelButton = true;
      } else {
        button.addEventListener('click', Dialog.onCustomButtonClick);
      }
    }
  }

  static detach(dialogElement) {
    const dialogCloser = getChildElementByClass(dialogElement, 'mdw-dialog__close');
    if (dialogCloser) {
      dialogCloser.removeEventListener('click', Dialog.onCancelClick);
    }
    dialogElement.removeAttribute('mdw-js');
    dialogElement.removeAttribute('mdw-show');
    dialogElement.removeAttribute('mdw-hide');
    const popupElement = dialogElement.getElementsByClassName('mdw-dialog__popup')[0];
    if (popupElement) {
      popupElement.removeEventListener('keydown', Dialog.onKeyDown);
      popupElement.style.removeProperty('transform-origin');
      if (popupElement.hasAttribute('style') && !popupElement.getAttribute('style')) {
        popupElement.removeAttribute('style');
      }
    }
    const buttons = popupElement.querySelectorAll('.mdw-dialog__button-area .mdw-button');
    for (let i = 0; i < buttons.length; i += 1) {
      const button = buttons.item(i);
      Button.detach(button);
      button.removeEventListener('click', Dialog.onConfirmClick);
      button.removeEventListener('click', Dialog.onCancelClick);
      button.removeEventListener('click', Dialog.onCustomButtonClick);
    }
  }

  static onCancelClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    if (dispatchDomEvent(event.currentTarget, 'mdw:cancel')) {
      const dialogElement = findElementParentByClassName(event.currentTarget, 'mdw-dialog');
      Dialog.hide(dialogElement);
    }
  }

  static onConfirmClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    if (dispatchDomEvent(event.currentTarget, 'mdw:confirm')) {
      const dialogElement = findElementParentByClassName(event.currentTarget, 'mdw-dialog');
      Dialog.hide(dialogElement);
    }
  }

  static onCustomButtonClick(event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    if (dispatchDomEvent(event.currentTarget, 'mdw:custom')) {
      const dialogElement = findElementParentByClassName(event.currentTarget, 'mdw-dialog');
      Dialog.hide(dialogElement);
    }
  }

  static onKeyDown(event) {
    if (event.key === 'Tab') {
      Dialog.handleTabKeyPress(event);
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      Dialog.onEscapeKeyDown(event);
    }
  }

  static onEscapeKeyDown(event) {
    event.stopPropagation();
    event.preventDefault();
    const dialogElement = findElementParentByClassName(event.currentTarget, 'mdw-dialog');
    Dialog.cancel(dialogElement);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    if (!event.state) {
      return;
    }
    const lastOpenDialog = OPEN_DIALOGS[OPEN_DIALOGS.length - 1];
    if (!lastOpenDialog || !lastOpenDialog.previousState) {
      return;
    }
    if ((lastOpenDialog.previousState === event.state) || Object.keys(event.state)
      .every(key => event.state[key] === lastOpenDialog.previousState[key])) {
      Dialog.hide(lastOpenDialog.element);
    }
  }

  /**
   * @param {Element} dialogElement
   * @return {void}
   */
  static cancel(dialogElement) {
    if (dispatchDomEvent(dialogElement, 'mdw:cancel')) {
      Dialog.hide(dialogElement);
    }
  }

  /**
   * @param {Element} dialogElement
   * @return {void}
   */
  static confirm(dialogElement) {
    if (dispatchDomEvent(dialogElement, 'mdw:confirm')) {
      Dialog.hide(dialogElement);
    }
  }

  /**
   * @param {Element} dialogElement
   * @return {boolean} handled
   */
  static hide(dialogElement) {
    if (dialogElement.hasAttribute('mdw-hide')) {
      return false;
    }
    if (!dispatchDomEvent(dialogElement, 'mdw:dismiss')) {
      return false;
    }
    dialogElement.setAttribute('mdw-hide', '');
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
          stack.previousFocus.focus();
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
      window.removeEventListener('popstate', Dialog.onPopState);
    }
    return true;
  }

  /**
   * @param {Element} dialogElement
   * @param {(MouseEvent|KeyboardEvent|PointerEvent)=} event
   * @return {boolean} handled
   */
  static show(dialogElement, event) {
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
      // Prevent anchor link
      event.preventDefault();
    }
    let changed = false;

    Dialog.updateTransformOrigin(dialogElement, event);
    if (dialogElement.hasAttribute('mdw-hide')) {
      dialogElement.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!dialogElement.hasAttribute('mdw-show')) {
      dialogElement.setAttribute('mdw-show', '');
      changed = true;
    }
    if (changed) {
      Dialog.attach(dialogElement);
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
        window.history.pushState(newState, title);
        window.addEventListener('popstate', Dialog.onPopState);
      }
      const dialogStack = new DialogStack(dialogElement, previousFocus, newState, previousState);
      OPEN_DIALOGS.push(dialogStack);
      const focusElement = dialogElement.querySelector('[mdw-autofocus]');
      if (focusElement) {
        focusElement.focus();
      } else {
        dialogElement.focus();
      }
    }
    return changed;
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static handleTabKeyPress(event) {
    const popupElement = event.currentTarget;
    const focusableElements = popupElement.querySelectorAll([
      'button:not(:disabled):not([tabindex="-1"])',
      '[href]:not(:disabled):not([tabindex="-1"])',
      'input:not(:disabled):not([tabindex="-1"])',
      'select:not(:disabled):not([tabindex="-1"])',
      'textarea:not(:disabled):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])'].join(', '));
    let foundTarget = false;
    let candidate = null;
    for (let i = 0; i < focusableElements.length; i += 1) {
      const el = focusableElements.item(i);
      if (el === event.target) {
        foundTarget = true;
        if (event.shiftKey) {
          break;
        }
      } else if (event.shiftKey) {
        candidate = el;
      } else if (foundTarget) {
        candidate = el;
        break;
      }
    }
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
      candidate.focus();
    }
  }

  /**
   * @param {Element} dialogElement
   * @param {(DocumentFragment|string)=} content
   * @return {void}
   */
  static updateTitle(dialogElement, content) {
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
  static updateButtonText(dialogElement, texts) {
    const buttonElements = dialogElement.querySelectorAll('.mdw-dialog__button-area .mdw-button');
    for (let i = 0; i < buttonElements.length; i += 1) {
      const button = buttonElements.item(i);
      button.textContent = texts[i];
    }
  }

  /**
   * @param {Element} dialogElement
   * @param {(DocumentFragment|string)=} content
   * @return {void}
   */
  static updateBody(dialogElement, content) {
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
  static create(options) {
    const element = document.createElement('div');
    element.classList.add('mdw-dialog');

    const popup = document.createElement('div');
    popup.classList.add('mdw-dialog__popup');
    element.appendChild(popup);

    Dialog.updateTitle(element, options.title);
    Dialog.updateBody(element, options.body);

    if (options.buttons) {
      const buttonArea = document.createElement('div');
      buttonArea.classList.add('mdw-dialog__button-area');
      let index = 0;
      options.buttons.forEach((buttonText) => {
        const button = document.createElement('div');
        button.classList.add('mdw-button');
        button.setAttribute('tabindex', '0');
        button.setAttribute('mdw-theme-color', 'accent');
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
    Dialog.attach(element);
    return element;
  }
  /**
   * @param {Element} dialogElement
   * @param {(MouseEvent|KeyboardEvent|PointerEvent)=} event
   * @return {void}
   */
  static updateTransformOrigin(dialogElement, event) {
    /** @type {HTMLElement} */
    const popup = getChildElementByClass(dialogElement, 'mdw-dialog__popup');
    popup.style.removeProperty('transform-origin');
    if (!event) {
      return;
    }
    let popupPageX = 0;
    let popupPageY = 0;
    let element = popup;
    while (element != null) {
      popupPageX += element.offsetLeft - element.scrollLeft;
      popupPageY += element.offsetTop - element.scrollTop;
      element = element.offsetParent;
    }
    let { pageX, pageY } = event;
    if (!pageX && !pageY) {
      const target = event.currentTarget || event.target;
      const rect = target.getBoundingClientRect();
      if (!rect.width && !rect.width && !rect.x && !rect.y) {
        return;
      }
      pageX = rect.x + (rect.width / 2);
      pageY = rect.y + (rect.height / 2);
    }
    const transformOriginX = `${pageX - popupPageX}px`;
    const transformOriginY = `${pageY - popupPageY}px`;
    popup.style.setProperty('transform-origin', `${transformOriginX} ${transformOriginY}`);
  }
}

// Aliases
Dialog.dismiss = Dialog.hide;

export {
  Dialog,
};
