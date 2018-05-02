import { getChildElementByClass } from '../common/dom';

class Ripple {
  /**
   * @param {Element} element
   * @return {void}
   */
  static attach(element) {
    let ripple = getChildElementByClass(element, 'mdw-ripple');
    if (!ripple) {
      ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      if (element.firstChild) {
        element.insertBefore(ripple, element.firstChild);
      } else {
        element.appendChild(ripple);
      }
    }

    let rippleInner = getChildElementByClass(ripple, 'mdw-ripple__inner');
    if (!rippleInner) {
      rippleInner = document.createElement('div');
      rippleInner.classList.add('mdw-ripple__inner');
      ripple.appendChild(rippleInner);
    }
    element.setAttribute('mdw-ripple', '');
    ripple.addEventListener('click', Ripple.onClick);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onClick(event) {
    /** @type {HTMLElement} */
    const el = event.currentTarget;
    const rippleInner = getChildElementByClass(el, 'mdw-ripple__inner');
    if (!rippleInner) {
      return;
    }
    if (!event.pointerType && !event.detail) {
      // Ripple from center
      rippleInner.style.removeProperty('left');
      rippleInner.style.removeProperty('top');
      return;
    }
    rippleInner.style.setProperty('left', `${event.offsetX}px`);
    rippleInner.style.setProperty('top', `${event.offsetY}px`);
  }

  static detach(element) {
    const ripple = getChildElementByClass(element, 'mdw-ripple');
    if (ripple) {
      element.removeChild(ripple);
    }
    element.removeAttribute('mdw-ripple');
    element.removeEventListener('click', Ripple.onClick);
  }
}

export {
  Ripple,
};
