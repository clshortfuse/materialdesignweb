class Menu {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    let [menuCloser] = this.element.getElementsByClassName('mdw-menu__close');
    if (!menuCloser) {
      menuCloser = document.createElement('div');
      menuCloser.classList.add('mdw-menu__close');
      if (this.element.firstChild) {
        this.element.insertBefore(menuCloser, this.element.firstChild);
      } else {
        this.element.appendChild(menuCloser);
      }
    }
    this.menuCloser = menuCloser;
    this.menuCloser.addEventListener('click', () => {
      this.hide();
    });
  }

  detach() {
    this.element = null;
  }

  /**
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {void}
   */
  updateMenuPosition(event, alignTarget) {
    let top = 'auto';
    let left = 'auto';
    let right = 'auto';
    let bottom = 'auto';
    let transformOrigin = '';
    const useAlignTarget = (alignTarget !== false);
    const margin = useAlignTarget ? '0' : '';
    const mdwPosition = this.element.getAttribute('mdw-position') || '';
    let alignTop = mdwPosition.indexOf('top') !== -1;
    let alignBottom = mdwPosition.indexOf('bottom') !== -1;
    let alignLeft = mdwPosition.indexOf('right') !== -1;
    let alignRight = mdwPosition.indexOf('left') !== -1;
    const alignStart = mdwPosition.indexOf('start') !== -1;
    const alignEnd = mdwPosition.indexOf('end') !== -1;

    const offsetTop = (useAlignTarget ? event.offsetY : 0);
    const offsetBottom = (useAlignTarget ? event.target.clientHeight - event.offsetY : 0);
    if (!alignTop && !alignBottom) {
      // Dynamic vertical position
      if (this.element.clientHeight + (event.pageY - offsetTop) > window.innerHeight) {
        alignBottom = true;
      } else {
        alignTop = true;
      }
    }
    if (alignTop) {
      top = `${event.pageY - offsetTop}px`;
      transformOrigin = 'top';
    } else {
      bottom = `${window.innerHeight - (event.pageY + offsetBottom)}px`;
      transformOrigin = 'bottom';
    }

    const offsetLeft = (useAlignTarget ? event.offsetX : 0);
    const offsetRight = (useAlignTarget ? event.target.clientWidth - event.offsetX : 0);
    if (alignStart || alignEnd) {
      const isRtl = (document.documentElement.getAttribute('dir') === 'rtl');
      if (alignStart) {
        if (isRtl) {
          alignRight = true;
        } else {
          alignLeft = true;
        }
      } else if (isRtl) {
        alignLeft = true;
      } else {
        alignRight = true;
      }
    }
    if (!alignLeft && !alignRight) {
      // Dynamic horizontal position
      if (this.element.clientWidth + (event.pageX - offsetLeft) > window.innerWidth) {
        // Can't open to the right
        alignRight = true;
      } else {
        const isRtl = (document.documentElement.getAttribute('dir') === 'rtl');
        if (isRtl) {
          alignRight = true;
        } else {
          alignLeft = true;
        }
      }
    }
    if (alignLeft) {
      left = `${event.pageX - offsetLeft}px`;
      transformOrigin += ' left';
    } else if (alignRight) {
      right = `${window.innerWidth - (event.pageX + offsetRight)}px`;
      transformOrigin += ' right';
    }

    this.element.style.setProperty('top', top);
    this.element.style.setProperty('left', left);
    this.element.style.setProperty('right', right);
    this.element.style.setProperty('bottom', bottom);
    this.element.style.setProperty('margin', margin);
    this.element.style.setProperty('transform-origin', transformOrigin);
    this.element.style.setProperty('position', 'fixed');
  }

  /**
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {boolean} handled
   */
  show(event, alignTarget) {
    let changed = false;
    if (event) {
      this.updateMenuPosition(event, alignTarget);
    } else {
      this.element.style.removeProperty('top');
      this.element.style.removeProperty('left');
      this.element.style.removeProperty('right');
      this.element.style.removeProperty('bottom');
      this.element.style.removeProperty('margin');
      this.element.style.removeProperty('transform-origin');
      this.element.style.removeProperty('position');
    }
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
