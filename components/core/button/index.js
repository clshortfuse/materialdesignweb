
// https://www.w3.org/TR/wai-aria-practices/#button

import { Ripple } from '../ripple/index';

class Button {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    this.element.setAttribute('mdw-js', '');
    if (!this.element.hasAttribute('mdw-icon')) {
      Ripple.attach(this.element);
    }
    if (this.element instanceof HTMLButtonElement === false
      && this.element instanceof HTMLAnchorElement === false
      && this.element instanceof HTMLInputElement === false) {
      this.element.addEventListener('keydown', Button.onKeyDown);
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    let el = event.target;
    while (el != null && !el.classList.contains('mdw-button')) {
      el = el.parentElement;
    }
    if (!el) {
      return;
    }
    if (event.key === 'Enter' || event.key === 'Spacebar' || (event.key === ' ')) {
      event.stopPropagation();
      event.preventDefault();
      el.click();
    }
  }
}

export {
  Button,
};
