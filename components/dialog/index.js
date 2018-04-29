// https://www.w3.org/TR/wai-aria-practices/#dialog_modal

import { Button } from '../button/index';
import { getChildElementByClass, findElementParentByClassName } from '../common/dom';

class DialogStack {
  /**
   * @param {Element} element
   * @param {Element} previousFocus
   */
  constructor(element, previousFocus) {
    this.element = element;
    this.previousFocus = previousFocus;
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
    element.addEventListener('keydown', Dialog.onKeyDown);
  }

  static detach(dialogElement) {
    const dialogCloser = getChildElementByClass(dialogElement, 'mdw-dialog__close');
    if (dialogCloser) {
      dialogCloser.removeEventListener('click', Dialog.onCancelClick);
    }
    dialogElement.removeEventListener('keydown', Dialog.onKeyDown);
  }

  static onCancelClick(event) {
    const dialogElement = findElementParentByClassName(event.target, 'mdw-dialog');
    Dialog.cancel(dialogElement);
  }

  static onConfirmClick(event) {
    const dialogElement = findElementParentByClassName(event.target, 'mdw-dialog');
    Dialog.confirm(dialogElement);
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
    const dialogElement = findElementParentByClassName(event.target, 'mdw-dialog');
    Dialog.cancel(dialogElement);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    const lastOpenDialog = OPEN_DIALOGS[OPEN_DIALOGS.length - 1];
    if (lastOpenDialog) {
      Dialog.hide(lastOpenDialog.element);
    }
  }

  /**
   * @param {Element} dialogElement
   * @return {void}
   */
  static cancel(dialogElement) {
    Dialog.hide(dialogElement);
    Dialog.dispatchEvent(dialogElement, 'mdw:cancel');
  }

  /**
   * @param {Element} dialogElement
   * @return {void}
   */
  static confirm(dialogElement) {
    Dialog.hide(dialogElement);
    Dialog.dispatchEvent(dialogElement, 'mdw:confirm');
  }

  /**
   * @param {Element} dialogElement
   * @return {boolean} handled
   */
  static hide(dialogElement) {
    if (!dialogElement.hasAttribute('mdw-hide')) {
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
          stack.previousFocus.focus();
        }
        OPEN_DIALOGS.splice(stackIndex, 1);
      }
      if (!OPEN_DIALOGS.length) {
        window.removeEventListener('popstate', Dialog.onPopState);
      }
      Dialog.dispatchEvent(dialogElement, 'mdw:dismiss');
      return true;
    }
    return false;
  }

  /**
   * @param {Element} dialogElement
   * @param {string} type
   * @return {void}
   */
  static dispatchEvent(dialogElement, type) {
    const event = document.createEvent('Event');
    event.initEvent(type, true, true);
    dialogElement.dispatchEvent(event);
  }

  /**
   * @param {Element} dialogElement
   * @param {MouseEvent=} event
   * @return {boolean} handled
   */
  static show(dialogElement, event) {
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
      if (window.history && window.history.pushState) {
        let title = 'Dialog';
        const titleElement = dialogElement.getElementsByClassName('mdw-dialog__title')[0];
        if (titleElement) {
          title = titleElement.textContent;
        } else {
          const bodyElement = dialogElement.getElementsByClassName('mdw-dialog__body')[0];
          title = bodyElement.textContent;
        }
        window.history.pushState({}, title, '');
        window.addEventListener('popstate', Dialog.onPopState);
      }
      const dialogStack = new DialogStack(dialogElement, previousFocus);
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
    const dialogElement = findElementParentByClassName(event.target, 'mdw-dialog');
    const focusableElements = dialogElement.querySelectorAll([
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
   * @param {string=} text
   * @return {void}
   */
  static updateTitle(dialogElement, text) {
    let title = dialogElement.getElementsByClassName('mdw-dialog__title')[0];
    if (!text) {
      if (!title) {
        // Nothing to be done
        return;
      }
      title.parentElement.removeChild(title);
      return;
    }
    if (!title) {
      const content = dialogElement.getElementsByClassName('mdw-dialog__content')[0];
      title = document.createElement('div');
      title.classList.add('mdw-dialog__title');
      content.appendChild(title);
    }
    title.textContent = text;
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
   * @param {string=} text
   * @return {void}
   */
  static updateBody(dialogElement, text) {
    let body = dialogElement.getElementsByClassName('mdw-dialog__body')[0];
    if (!text) {
      if (!body) {
        // Nothing to be done
        return;
      }
      body.parentElement.removeChild(body);
      return;
    }
    if (!body) {
      const content = dialogElement.getElementsByClassName('mdw-dialog__content')[0];
      body = document.createElement('div');
      body.classList.add('mdw-dialog__body');
      content.appendChild(body);
    }
    body.textContent = text;
  }

  /**
   * @param {Object} options
   * @param {string=} options.title
   * @param {string=} options.body
   * @param {string[]=} options.buttons
   * @param {boolean=} options.stacked
   * @param {Element=} options.parent
   * @param {("confirm"|"alert"|"custom")=} [options.type="custom"]
   * @param {(string|number)=} [options.autofocus=0] Autofocus button index or text
   * @return {Element}
   */
  static create(options) {
    const element = document.createElement('div');
    element.classList.add('mdw-dialog');

    const popup = document.createElement('div');
    popup.classList.add('mdw-dialog__popup');
    element.appendChild(popup);

    const content = document.createElement('div');
    content.classList.add('mdw-dialog__content');
    popup.appendChild(content);

    if (options.title) {
      const title = document.createElement('div');
      title.classList.add('mdw-dialog__title');
      title.textContent = options.title;
      content.appendChild(title);
    }
    if (options.body) {
      const body = document.createElement('div');
      body.classList.add('mdw-dialog__body');
      body.textContent = options.body;
      content.appendChild(body);
    }
    if (options.buttons) {
      const buttonArea = document.createElement('div');
      buttonArea.classList.add('mdw-dialog__button-area');
      let index = 0;
      options.buttons.forEach((buttonText) => {
        const button = document.createElement('div');
        button.classList.add('mdw-button');
        button.setAttribute('tabindex', '0');
        button.setAttribute('mdw-theme-color', 'accent');
        button.textContent = buttonText;
        document.createElement('div');
        buttonArea.appendChild(button);
        if ((options.autofocus == null && index === 0)
          || options.autofocus === index || options.autofocus === buttonText) {
          button.setAttribute('mdw-autofocus', '');
        }
        Button.attach(button);
        index += 1;
      });
      if (options.stacked) {
        buttonArea.setAttribute('mdw-stacked', '');
      }
      popup.appendChild(buttonArea);
    }
    if (options.parent) {
      options.parent.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
    const buttons = element.querySelectorAll('.mdw-dialog__button-area .mdw-button');
    const confirmButton = buttons[0];
    const cancelButton = buttons[1];
    if (options.type === 'alert' || options.type === 'confirm') {
      if (confirmButton) {
        confirmButton.addEventListener('click', Dialog.onConfirmClick);
      }
    }
    if (options.type === 'confirm') {
      if (cancelButton) {
        cancelButton.addEventListener('click', Dialog.onCancelClick);
      }
    }
    Dialog.attach(element);
    return element;
  }
  /**
   * @param {Element} dialogElement
   * @param {MouseEvent=} event
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
      popupPageX += element.offsetLeft;
      popupPageY += element.offsetTop;
      element = element.offsetParent;
    }
    let { pageX, pageY } = event;
    if (!pageX && !pageY) {
      const rect = event.target.getBoundingClientRect();
      pageX = rect.x + (rect.width / 2);
      pageY = rect.y + (rect.height / 2);
    }
    const transformOriginX = `${pageX - popupPageX}px`;
    const transformOriginY = `${pageY - popupPageY}px`;
    popup.style.setProperty('transform-origin', `${transformOriginX} ${transformOriginY}`);
  }
}

export {
  Dialog,
};
