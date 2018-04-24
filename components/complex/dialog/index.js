// https://www.w3.org/TR/wai-aria-practices/#dialog_modal

import { Button } from '../../index';

class Dialog {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    let [dialogCloser] = this.element.getElementsByClassName('mdw-dialog__close');
    if (!dialogCloser) {
      dialogCloser = document.createElement('div');
      dialogCloser.classList.add('mdw-dialog__close');
      if (this.element.firstChild) {
        this.element.insertBefore(dialogCloser, this.element.firstChild);
      } else {
        this.element.appendChild(dialogCloser);
      }
    }
    const [popup] = this.element.getElementsByClassName('mdw-dialog__popup');
    this.popup = popup;
    this.dialogCloser = dialogCloser;
    this.dialogCloser.addEventListener('click', (event) => {
      this.cancel(event);
    });
    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.handleTabKeyPress(event);
      }
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.handleEscapeKeyPress(event);
      }
    });
    /** @type {Button[]} */
    this.buttons = [];
    const buttonElements = this.element.getElementsByClassName('mdw-button');
    for (let i = 0; i < buttonElements.length; i += 1) {
      const button = buttonElements.item(i);
      this.buttons.push(new Button(button));
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  handleEscapeKeyPress(event) {
    event.stopPropagation();
    event.preventDefault();
    this.cancel(event);
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  handleTabKeyPress(event) {
    const focusableElements = this.element.querySelectorAll([
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
   * @param {string=} text
   * @return {void}
   */
  updateTitle(text) {
    let [title] = this.element.getElementsByClassName('mdw-dialog__title');
    if (!text) {
      if (!title) {
        // Nothing to be done
        return;
      }
      title.parentElement.removeChild(title);
      return;
    }
    if (!title) {
      const [content] = this.element.getElementsByClassName('mdw-dialog__content');
      title = document.createElement('div');
      title.classList.add('mdw-dialog__title');
      content.appendChild(title);
    }
    title.textContent = text;
  }


  /**
   * @param {string[]} texts
   * @return {void}
   */
  updateButtonText(texts) {
    for (let i = 0; i < this.buttons.length; i += 1) {
      this.buttons[i].element.textContent = texts[i];
    }
  }

  /**
   * @param {string=} text
   * @return {void}
   */
  updateBody(text) {
    let [body] = this.element.getElementsByClassName('mdw-dialog__body');
    if (!text) {
      if (!body) {
        // Nothing to be done
        return;
      }
      body.parentElement.removeChild(body);
      return;
    }
    if (!body) {
      const [content] = this.element.getElementsByClassName('mdw-dialog__content');
      body = document.createElement('div');
      body.classList.add('mdw-dialog__body');
      content.appendChild(body);
    }
    body.textContent = text;
  }

  /**
   * @abstract
   * @param {MouseEvent|PointerEvent|PopStateEvent} event
   * @return {any}
   */
  onDismissListener(event) {}

  /**
   * @abstract
   * @param {MouseEvent|PointerEvent|PopStateEvent} event
   * @return {any}
   */
  onConfirmListener(event) {}

  /**
   * @abstract
   * @param {MouseEvent|PointerEvent|PopStateEvent} event
   * @return {any}
   */
  onCancelListener(event) {}

  detach() {
    this.element = null;
  }

  /**
   * @param {Object} options
   * @param {string=} options.title
   * @param {string=} options.body
   * @param {string[]=} options.buttons
   * @param {boolean=} options.stacked
   * @param {HTMLElement=} options.parent
   * @param {("confirm"|"alert"|"custom")=} [options.type="custom"]
   * @param {(string|number)=} [options.autofocus=0] Autofocus button index or text
   * @return {Dialog}
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
        const button = document.createElement('button');
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
    const dialog = new Dialog(element);
    const [confirmButton, cancelButton] = dialog.buttons;
    if (options.type === 'alert' || options.type === 'confirm') {
      if (confirmButton) {
        confirmButton.element.addEventListener('click', (event) => {
          dialog.confirm(event);
        });
      }
    }
    if (options.type === 'confirm') {
      if (cancelButton) {
        cancelButton.element.addEventListener('click', (event) => {
          dialog.cancel(event);
        });
      }
    }
    return dialog;
  }
  /**
   * @param {MouseEvent=} event
   * @return {void}
   */
  updateTransformOrigin(event) {
    this.popup.style.removeProperty('transform-origin');
    let popupPageX = 0;
    let popupPageY = 0;
    let element = this.popup;
    while (element != null) {
      popupPageX += element.offsetLeft;
      popupPageY += element.offsetTop;
      element = element.offsetParent;
    }
    console.log(popupPageY);
    const transformOriginX = `${event.pageX - popupPageX}px`;
    const transformOriginY = `${event.pageY - popupPageY}px`;
    this.popup.style.setProperty('transform-origin', `${transformOriginX} ${transformOriginY}`);
    
  }

  /**
   * @param {MouseEvent=} event
   * @return {boolean} handled
   */
  show(event) {
    let changed = false;
    this.popup.style.removeProperty('transform-origin');
    if (event) {
      this.updateTransformOrigin(event);
    }
    if (this.element.hasAttribute('mdw-hide')) {
      this.element.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!this.element.hasAttribute('mdw-show')) {
      this.element.setAttribute('mdw-show', '');
      changed = true;
    }
    if (changed) {
      this.previousFocus = document.activeElement;
      const focusElement = this.element.querySelector('[mdw-autofocus]');
      if (focusElement) {
        focusElement.focus();
      }
      if (window.history && window.history.pushState) {
        let title = 'Dialog';
        const [titleElement] = this.element.getElementsByClassName('mdw-dialog__title');
        if (titleElement) {
          title = titleElement.textContent;
        } else {
          const [bodyElement] = this.element.getElementsByClassName('mdw-dialog__body');
          title = bodyElement.textContent;
        }
        this.onPopState = (event) => {
          this.cancel(event);
        };
        window.history.pushState({}, title, '');
        window.addEventListener('popstate', this.onPopState);
      }
    }
    return changed;
  }

  /**
   * @param {MouseEvent|PointerEvent|PopStateEvent|KeyboardEvent} event
   * @return {void}
   */
  cancel(event) {
    this.hide(event);
    if (this.onCancelListener) {
      this.onCancelListener(event);
    }
  }

  /**
   * @param {MouseEvent|PointerEvent|PopStateEvent} event
   * @return {void}
   */
  confirm(event) {
    this.hide(event);
    if (this.onConfirmListener) {
      this.onConfirmListener(event);
    }
  }

  /**
   * @param {MouseEvent|PointerEvent|PopStateEvent|KeyboardEvent} event
   * @return {boolean} handled
   */
  hide(event) {
    if (!this.element.hasAttribute('mdw-hide')) {
      this.element.setAttribute('mdw-hide', '');
      if (this.previousFocus) {
        this.previousFocus.focus();
      }
      if (this.onPopState) {
        window.removeEventListener('popstate', this.onPopState);
      }
      if (this.onDismissListener) {
        this.onDismissListener(event);
      }
      return true;
    }
    return false;
  }
}

export {
  Dialog,
};
