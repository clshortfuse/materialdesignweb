import { getChildElementByClass, nextTick } from '../common/dom';

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
    let targetElement = ripple;
    if (element instanceof HTMLButtonElement) {
      // Firefox doesn't support listening on HTMLButtonElement children
      targetElement = element;
    }
    targetElement.addEventListener('click', Ripple.onClick);
    targetElement.addEventListener('mousedown', Ripple.onMouseEvent);
    targetElement.addEventListener('mouseup', Ripple.onMouseEvent);
    targetElement.addEventListener('mouseout', Ripple.onMouseEvent);
    targetElement.addEventListener('touchstart', Ripple.onTouchEvent);
    targetElement.addEventListener('touchend', Ripple.onTouchEvent);
    targetElement.addEventListener('touchcancel', Ripple.onTouchEvent);
    element.addEventListener('keydown', Ripple.onKeyEvent);
    element.addEventListener('keyup', Ripple.onKeyEvent);
    rippleInner.addEventListener('animationend', Ripple.onAnimationEnd);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onMouseEvent(event) {
    /** @type {HTMLElement} */
    let ripple = (event.currentTarget);
    if (!ripple.classList.contains('mdw-ripple')) {
      /** @type {HTMLElement} */
      ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
    }
    if (!ripple) {
      return;
    }
    /** @type {HTMLElement} */
    const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
    if (!rippleInner) {
      return;
    }
    if (event.type === 'mousedown') {
      if (!event.pointerType && !event.detail) {
        return;
      }
      if (rippleInner.hasAttribute('mdw-touchstart')) {
        return;
      }
      rippleInner.setAttribute('mdw-mousedown', '');
      rippleInner.removeAttribute('mdw-mouseout');
      const rect = ripple.getBoundingClientRect();
      const x = event.pageX - rect.left - window.pageXOffset;
      const y = event.pageY - rect.top - window.pageYOffset;
      Ripple.updateRipplePosition(rippleInner, x, y);
      Ripple.drawRipple(rippleInner);
    } else if (event.type === 'mouseup') {
      if (rippleInner.hasAttribute('mdw-mousedown')) {
        rippleInner.setAttribute('mdw-mouseup', '');
        Ripple.clearRipple(rippleInner);
        rippleInner.removeAttribute('mdw-mousedown');
        rippleInner.removeAttribute('mdw-mouseup');
      }
    } else if (event.type === 'mouseout') {
      if (rippleInner.hasAttribute('mdw-mousedown')) {
        rippleInner.removeAttribute('mdw-mousedown');
        rippleInner.setAttribute('mdw-mouseout', '');
      }
    }
  }

  /**
   * @param {TouchEvent} event
   * @return {void}
   */
  static onTouchEvent(event) {
    /** @type {HTMLElement} */
    let ripple = (event.currentTarget);
    if (!ripple.classList.contains('mdw-ripple')) {
      /** @type {HTMLElement} */
      ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
    }
    if (!ripple) {
      return;
    }
    /** @type {HTMLElement} */
    const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
    if (!rippleInner) {
      return;
    }
    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }
    if (event.type === 'touchstart') {
      rippleInner.setAttribute('mdw-touchstart', '');
      rippleInner.removeAttribute('mdw-touchcancel');
      rippleInner.removeAttribute('mdw-mouseout');
      const rect = ripple.getBoundingClientRect();
      const x = touch.pageX - rect.left - window.pageXOffset;
      const y = touch.pageY - rect.top - window.pageYOffset;
      Ripple.updateRipplePosition(rippleInner, x, y);
      Ripple.drawRipple(rippleInner);
    } else if (event.type === 'touchend') {
      rippleInner.setAttribute('mdw-touchend', '');
      Ripple.clearRipple(rippleInner);
      rippleInner.removeAttribute('mdw-touchend');
      nextTick(() => {
        rippleInner.removeAttribute('mdw-touchstart');
      });
    } else if (event.type === 'touchcancel') {
      rippleInner.setAttribute('mdw-touchcancel', '');
      nextTick(() => {
        rippleInner.removeAttribute('mdw-touchstart');
      });
    }
  }

  /**
   * @param {TouchEvent} event
   * @return {void}
   */
  static onKeyEvent(event) {
    /** @type {HTMLElement} */
    let ripple = (event.currentTarget);
    if (!ripple.classList.contains('mdw-ripple')) {
      /** @type {HTMLElement} */
      ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
    }
    if (!ripple) {
      return;
    }
    /** @type {HTMLElement} */
    const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
    if (!rippleInner) {
      return;
    }

    nextTick(() => {
      if (Ripple.isActive(ripple.parentElement)) {
        if (rippleInner.hasAttribute('mdw-keydown')) {
          return;
        }
        rippleInner.setAttribute('mdw-keydown', '');
        rippleInner.removeAttribute('mdw-mouseout');
        Ripple.updateRipplePosition(rippleInner);
        Ripple.drawRipple(rippleInner);
      } else if (rippleInner.hasAttribute('mdw-keydown')) {
        rippleInner.setAttribute('mdw-keyup', '');
        Ripple.clearRipple(rippleInner);
        rippleInner.removeAttribute('mdw-keydown');
        rippleInner.removeAttribute('mdw-keyup');
      }
    });
  }

  /**
   * @param {Element} element
   * @return {boolean}
   */
  static isActive(element) {
    if (element.matches) {
      return element.matches(':active');
    }
    if (element.msMatchesSelector) {
      element.msMatchesSelector(':active');
    }
    return false;
  }

  /**
   * @param {HTMLElement} rippleInner
   * @param {number=} x
   * @param {number=} y
   * @return {void}
   */
  static updateRipplePosition(rippleInner, x, y) {
    let width;
    let height;
    let xPos = x;
    let yPos = y;
    if (x == null) {
      xPos = rippleInner.parentElement.clientWidth / 2;
      width = xPos;
    } else if (x >= rippleInner.parentElement.clientWidth / 2) {
      width = x;
      // furthest horizontal side is left
    } else {
      width = rippleInner.parentElement.clientWidth - x;
      // furthest horizontal side is right
    }
    if (y == null) {
      yPos = rippleInner.parentElement.clientHeight / 2;
      height = yPos;
    } else if (y >= rippleInner.parentElement.clientHeight / 2) {
      height = y;
      // furthest vertical side is bottom
    } else {
      height = rippleInner.parentElement.clientHeight - y;
      // furthest vertical side is top
    }
    const hypotenuse = Math.sqrt((width * width) + (height * height));
    rippleInner.style.setProperty('height', `${hypotenuse}px`);
    rippleInner.style.setProperty('width', `${hypotenuse}px`);
    rippleInner.style.setProperty('left', `${xPos - (hypotenuse / 2)}px`);
    rippleInner.style.setProperty('top', `${yPos - (hypotenuse / 2)}px`);
  }

  static drawRipple(rippleInner) {
    rippleInner.setAttribute('mdw-fade-in', '');
    rippleInner.removeAttribute('mdw-fade-in-complete');
    rippleInner.removeAttribute('mdw-fade-out');
    rippleInner.removeAttribute('mdw-fade-out-ready');
    rippleInner.removeAttribute('mdw-fade-in-out');
  }

  static onAnimationEnd(event) {
    /** @type {HTMLElement} */
    const rippleInner = (event.currentTarget);
    if (rippleInner.hasAttribute('mdw-fade-in')) {
      rippleInner.setAttribute('mdw-fade-in-complete', '');
    }
    if (rippleInner.hasAttribute('mdw-fade-out-ready')) {
      Ripple.clearRipple(rippleInner);
      return;
    }
    if (rippleInner.hasAttribute('mdw-fade-out')) {
      rippleInner.removeAttribute('mdw-fade-out');
    }
  }

  static clearRipple(rippleInner) {
    const hasFadeOutReady = rippleInner.hasAttribute('mdw-fade-out-ready');
    if (!hasFadeOutReady) {
      if (!rippleInner.hasAttribute('mdw-fade-in')) {
        return;
      }
      if (rippleInner.hasAttribute('mdw-keydown') && !rippleInner.hasAttribute('mdw-keyup')) {
        return;
      }
      if (rippleInner.hasAttribute('mdw-mousedown') && !rippleInner.hasAttribute('mdw-mouseup')) {
        return;
      }
      if (rippleInner.hasAttribute('mdw-touchstart') && !rippleInner.hasAttribute('mdw-touchend')) {
        return;
      }
      if (!rippleInner.hasAttribute('mdw-fade-in-complete')) {
        rippleInner.setAttribute('mdw-fade-out-ready', '');
        return;
      }
    }
    rippleInner.removeAttribute('mdw-fade-in');
    rippleInner.removeAttribute('mdw-fade-in-complete');
    rippleInner.removeAttribute('mdw-fade-out-ready', '');
    rippleInner.setAttribute('mdw-fade-out', '');
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onClick(event) {
    /** @type {HTMLElement} */
    let ripple = (event.currentTarget);
    if (!ripple.classList.contains('mdw-ripple')) {
      /** @type {HTMLElement} */
      ripple = (getChildElementByClass(ripple, 'mdw-ripple'));
    }
    if (!ripple) {
      return;
    }
    /** @type {HTMLElement} */
    const rippleInner = (getChildElementByClass(ripple, 'mdw-ripple__inner'));
    if (!rippleInner) {
      return;
    }
    if (event.pointerType || event.detail) {
      return;
    }
    if (rippleInner.hasAttribute('mdw-keydown')) {
      // Already handled by keydown
      return;
    }
    Ripple.updateRipplePosition(rippleInner);
    Ripple.drawRipple(rippleInner);
    nextTick(() => {
      Ripple.clearRipple(rippleInner);
    });
  }

  static detach(element) {
    const ripple = getChildElementByClass(element, 'mdw-ripple');
    if (ripple) {
      element.removeChild(ripple);
    }
    element.removeAttribute('mdw-ripple');
    element.removeEventListener('click', Ripple.onClick);
    element.removeEventListener('mousedown', Ripple.onMouseEvent);
    element.removeEventListener('mouseup', Ripple.onMouseEvent);
    element.removeEventListener('mouseout', Ripple.onMouseEvent);
    element.removeEventListener('touchstart', Ripple.onTouchEvent);
    element.removeEventListener('touchend', Ripple.onTouchEvent);
    element.removeEventListener('touchcancel', Ripple.onTouchEvent);
    element.removeEventListener('keydown', Ripple.onKeyEvent);
    element.removeEventListener('keyup', Ripple.onKeyEvent);
  }
}

export {
  Ripple,
};
