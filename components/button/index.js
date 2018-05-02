
// https://www.w3.org/TR/wai-aria-practices/#button

import { Ripple } from '../ripple/index';

class Button {
  /**
   * @param {Element} element
   * @return {void}
   */
  static attach(element) {
    element.setAttribute('mdw-js', '');
    if (!element.hasAttribute('mdw-icon')) {
      Ripple.attach(element);
    }
    if (element instanceof HTMLButtonElement === false
      && element instanceof HTMLAnchorElement === false
      && element instanceof HTMLInputElement === false) {
      element.addEventListener('keydown', Button.onKeyDown);
    }
  }

  /**
   * @param {Element} element
   * @return {void}
   */
  static detach(element) {
    element.removeEventListener('keydown', Button.onKeyDown);
    element.removeAttribute('mdw-js');
    Ripple.detach(element);
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
      return;
    }
    const buttonElement = event.currentTarget;
    if (!buttonElement) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    buttonElement.click();
  }
}

export {
  Button,
};
