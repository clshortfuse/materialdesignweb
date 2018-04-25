// https://www.w3.org/TR/wai-aria-practices/#menu

class Menu {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    this.element.setAttribute('mdw-js', '');
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
    this.element.addEventListener('keydown', (event) => {
      this.handleKeyEvent(event);
    });
    this.onMenuItemMouseMove = (event) => {
      let el = event.target;
      while (el != null && !el.classList.contains('mdw-menu__item')) {
        el = el.parentElement;
      }
      if (!el) {
        return;
      }
      const previousFocus = document.activeElement;
      if (previousFocus === el) {
        // Already focused
        return;
      }
      el.focus();
      if (document.activeElement !== el) {
        if (previousFocus && document.activeElement !== previousFocus) {
          previousFocus.focus();
        }
      }
    };
  }

  handleKeyEvent(event) {
    if (event.key === 'Tab') {
      this.previousFocus = null;
      this.hide();
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.stopPropagation();
      event.preventDefault();
      this.hide();
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      event.stopPropagation();
      event.preventDefault();
      this.selectNextMenuItem(true);
      return;
    }
    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      event.stopPropagation();
      event.preventDefault();
      this.selectNextMenuItem();
    }
    if (!document.activeElement) {
      return;
    }
    if (document.activeElement === this.element) {
      return;
    }
    if (document.activeElement.parentElement !== this.element) {
      return;
    }
    if (document.activeElement.hasAttribute('disabled')) {
      return;
    }
    if (event.key === 'Spacebar' || (event.key === ' ')) {
      event.stopPropagation();
      event.preventDefault();
      if (document.activeElement.hasAttribute('mdw-checked')) {
        document.activeElement.removeAttribute('mdw-checked');
      } else {
        document.activeElement.setAttribute('mdw-checked', '');
      }
      return;
    }
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
      document.activeElement.click();
    }
  }

  detach() {
    this.element = null;
  }

  selectNextMenuItem(backwards) {
    const menuItems = this.element.getElementsByClassName('mdw-menu__item');
    let foundTarget = false;
    let candidate = null;
    let firstFocusableItem = null;
    let lastFocusableElement = null;
    const target = document.activeElement;

    // Hidden elements cannot be focused
    // Disabled elements cannot be focused on IE11
    // Skip elements that fail to receive focus
    for (let i = 0; i < menuItems.length; i += 1) {
      const el = menuItems.item(i);
      el.focus();
      const focusable = (document.activeElement === el);
      if (focusable) {
        if (!firstFocusableItem) {
          firstFocusableItem = el;
        }
        lastFocusableElement = el;
      }
      if (el === target) {
        foundTarget = true;
        if (backwards && candidate) {
          break;
        }
      } else if (backwards) {
        if (focusable) {
          candidate = el;
        }
      } else if (foundTarget) {
        if (focusable) {
          candidate = el;
          break;
        }
      }
    }
    if (!candidate) {
      if (backwards) {
        candidate = lastFocusableElement;
      } else {
        candidate = firstFocusableItem;
      }
    }
    if (candidate && document.activeElement !== candidate) {
      candidate.focus();
    }
  }

  /**
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {void}
   */
  updateMenuPosition(event, alignTarget) {
    let top = 'auto';
    let left = 'auto';
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
    let { pageX, pageY } = event;
    if (!pageX && !pageY) {
      const rect = event.target.getBoundingClientRect();
      pageX = rect.x;
      pageY = rect.y;
    }
    if (!alignTop && !alignBottom) {
      // Dynamic vertical position
      if (this.element.clientHeight + (pageY - offsetTop) > window.innerHeight) {
        alignBottom = true;
      } else {
        alignTop = true;
      }
    }
    if (alignTop) {
      top = `${pageY - offsetTop}px`;
      transformOrigin = 'top';
    } else {
      top = `${(pageY + offsetBottom) - this.element.clientHeight}px`;
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
      if (this.element.clientWidth + (pageX - offsetLeft) > window.innerWidth) {
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
      left = `${pageX - offsetLeft}px`;
      transformOrigin += ' left';
    } else if (alignRight) {
      left = `${(pageX + offsetRight) - this.element.clientWidth}px`;
      transformOrigin += ' right';
    }

    this.element.style.setProperty('top', top);
    this.element.style.setProperty('left', left);
    this.element.style.setProperty('right', 'auto');
    this.element.style.setProperty('bottom', 'auto');
    this.element.style.setProperty('margin', margin);
    this.element.style.setProperty('transform-origin', transformOrigin);
    this.element.style.setProperty('position', 'fixed');
  }

  refreshMenuItems() {
    const menuItems = this.element.getElementsByClassName('mdw-menu__item');
    for (let i = 0; i < menuItems.length; i += 1) {
      const menuItem = menuItems.item(i);
      menuItem.setAttribute('tabindex', '-1');
      // If mouseover is used, an item can still lose focus via keyboard navigation.
      // An extra event listener would need to be created to catch blur but the cursor
      // would still remain over the element, thus needing another mousemove event.
      // Prioritization is given to less event listeners rather than operations per second.
      menuItem.addEventListener('mousemove', this.onMenuItemMouseMove);
    }
    this.element.setAttribute('tabindex', '-1');
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
    if (changed) {
      this.previousFocus = document.activeElement;
      if (window.history && window.history.pushState) {
        const title = 'Menu';
        this.onPopState = (event) => {
          this.hide(event);
        };
        window.history.pushState({}, title, '');
        window.addEventListener('popstate', this.onPopState);
      }
      this.refreshMenuItems();
      if (event && !event.pointerType && !event.detail) {
        // Triggered with keyboard event
        this.selectNextMenuItem();
      } else {
        this.element.focus();
      }
    }
    return changed;
  }

  /** @return {boolean} handled */
  hide() {
    if (!this.element.hasAttribute('mdw-hide')) {
      this.element.setAttribute('mdw-hide', '');
      if (this.previousFocus) {
        this.previousFocus.focus();
      }
      this.element.removeAttribute('tabindex');
      if (this.onPopState) {
        window.removeEventListener('popstate', this.onPopState);
      }
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
