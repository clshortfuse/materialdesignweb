
// https://www.w3.org/TR/wai-aria-practices/#button

import { Ripple } from '../ripple/index';
import { findElementParentByClassName } from '../../common/dom';

class Button {
  /**
   * @param {Element} element
   * @param {boolean=} [attachRipple=true]
   * @return {void}
   */
  static attach(element, attachRipple) {
    element.setAttribute('mdw-js', '');
    if (attachRipple !== false && !element.hasAttribute('mdw-icon')) {
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
   * @param {boolean=} [detachRipple=true]
   * @return {void}
   */
  static detach(element, detachRipple) {
    element.removeEventListener('keydown', Button.onKeyDown);
    element.removeAttribute('mdw-js');
    if (detachRipple !== false) {
      Ripple.detach(element);
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== 'Spacebar' && event.key !== ' ') {
      return;
    }
    const buttonElement = findElementParentByClassName(event.target, 'mdw-button');
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
