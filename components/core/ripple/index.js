class Ripple {
  /**
   * @param {HTMLElement} element
   * @return {void}
   */
  static setup(element) {
    const rippleElements = element.getElementsByClassName('mdw-ripple');
    let ripple = rippleElements && rippleElements[0];
    if (!ripple) {
      ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      if (element.firstChild) {
        element.insertBefore(ripple, element.firstChild);
      } else {
        element.appendChild(ripple);
      }
    }
    const innerRippleElements = ripple.getElementsByClassName('mdw-ripple__inner');
    let rippleInner = innerRippleElements && innerRippleElements[0];
    if (!rippleInner) {
      rippleInner = document.createElement('div');
      rippleInner.classList.add('mdw-ripple__inner');
      ripple.appendChild(rippleInner);
    }
    element.setAttribute('mdw-ripple', '');
    element.addEventListener('click', Ripple.onClick);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  static onClick(event) {
    let rippleInner = null;
    /** @type {HTMLElement} */
    let el = event.target;
    while (el != null) {
      if (el.classList.contains('mdw-ripple__inner')) {
        rippleInner = el;
      } else {
        for (let i = 0; i < el.children.length; i += 1) {
          const child = el.children.item(i);
          if (child.classList.contains('mdw-ripple__inner')) {
            rippleInner = child;
            break;
          }
        }
      }
      if (rippleInner) {
        break;
      }
      el = el.parentElement;
    }
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
}

export {
  Ripple,
};
