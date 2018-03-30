class Menu {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    let [menuCloser] = this.element.getElementsByClassName('mdw-menu__close');
    if (!menuCloser) {
      menuCloser = document.createElement('div');
      menuCloser.classList.add('mdw-menu__close');
      this.element.appendChild(menuCloser);
    }
    this.menuCloser = menuCloser;
    this.menuCloser.addEventListener('click', () => {
      this.hide();
    });
  }

  detach() {
    this.element = null;
  }

  /** @return {boolean} handled */
  show() {
    let changed = false;
    if (this.element.hasAttribute('mdw-hide')) {
      this.element.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!this.element.hasAttribute('mdw-show')) {
      this.element.setAttribute('mdw-show', '');
      changed = true;
    }
    return changed;
  }

  /** @return {boolean} handled */
  hide() {
    if (!this.element.hasAttribute('mdw-hide')) {
      this.element.setAttribute('mdw-hide', '');
      return true;
    }
    return false;
  }

  /**
   * Clear and detach all children
   * @param {WeakMap=} elementMap
   * @return {void}
   */
  clear(elementMap) {
    const el = this.element;
    if (!el) {
      return;
    }
    while (el.firstChild) {
      if (elementMap && elementMap.has(el.firstChild)) {
        elementMap.get(el.firstChild).detach();
        elementMap.delete(el.firstChild);
      }
      el.removeChild(el.firstChild);
    }
  }
}

class MenuItem {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    const rippleElements = element.getElementsByClassName('mdw-ripple');
    this.ripple = rippleElements && rippleElements[0];
    if (!this.ripple) {
      const ripple = document.createElement('div');
      ripple.classList.add('mdw-ripple');
      this.element.insertBefore(ripple, this.element.firstChild);
      this.ripple = ripple;
    }
    const innerRippleElements = this.ripple.getElementsByClassName('mdw-ripple__inner');
    this.rippleInner = innerRippleElements && innerRippleElements[0];
    if (!this.rippleInner) {
      const rippleInner = document.createElement('div');
      rippleInner.classList.add('mdw-ripple__inner');
      this.ripple.appendChild(rippleInner);
      this.rippleInner = rippleInner;
    }
    this.element.setAttribute('mdw-ripple', '');
    this.element.addEventListener('click', (event) => {
      this.updateRipplePosition(event);
    });
  }

  /**
   * @param {MouseEvent|PointerEvent} event
   * @return {void}
   */
  updateRipplePosition(event) {
    if (event.target !== this.element && event.target !== this.ripple) {
      return;
    }
    if (!event.pointerType && !event.detail) {
      // Ripple from center
      this.rippleInner.style.removeProperty('left');
      this.rippleInner.style.removeProperty('top');
      return;
    }
    const x = event.offsetX;
    const y = event.offsetY;
    this.rippleInner.style.setProperty('left', `${x}px`);
    this.rippleInner.style.setProperty('top', `${y}px`);
  }

  /**
   * Destroys all HTMLElement references for garbage collection
   * @return {void}
   */
  detach() {
    this.ripple = null;
    this.element = null;
  }
}

export {
  Menu,
  MenuItem,
};
