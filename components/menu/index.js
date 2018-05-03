import { Ripple } from '../ripple/index';

// https://www.w3.org/TR/wai-aria-practices/#menu

class MenuItem {
  /**
   * @param {Element} element
   * @return {void}
   */
  static attach(element) {
    element.setAttribute('mdw-js', '');
    Ripple.attach(element);
    // If mouseover is used, an item can still lose focus via keyboard navigation.
    // An extra event listener would need to be created to catch blur but the cursor
    // would still remain over the element, thus needing another mousemove event.
    // Prioritization is given to less event listeners rather than operations per second.
    element.addEventListener('mousemove', MenuItem.onMouseMove);
  }

  static onMouseMove(event) {
    const el = event.currentTarget;
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
  }

  /**
   * @param {Element} element
   * @return {void}
   */
  static detach(element) {
    element.removeEventListener('mousemove', MenuItem.onMouseMove);
    element.removeAttribute('mdw-js');
    Ripple.detach(element);
  }
}

class MenuStack {
  /**
   * @param {Element} element
   * @param {Element} previousFocus
   */
  constructor(element, previousFocus) {
    this.element = element;
    this.previousFocus = previousFocus;
    if (window.history) {
      this.historyState = window.history.state;
    }
  }
}

/** @type {MenuStack[]} */
const OPEN_MENUS = [];
class Menu {
  /**
   * @param {Element} menuElement
   * @return {void}
   */
  static attach(menuElement) {
    menuElement.setAttribute('mdw-js', '');
    let menuCloser = menuElement.getElementsByClassName('mdw-menu__close')[0];
    if (!menuCloser) {
      menuCloser = document.createElement('div');
      menuCloser.classList.add('mdw-menu__close');
      if (menuElement.firstChild) {
        menuElement.insertBefore(menuCloser, menuElement.firstChild);
      } else {
        menuElement.appendChild(menuCloser);
      }
    }
    menuCloser.addEventListener('click', Menu.onMenuCloserClick);
    menuElement.addEventListener('keydown', Menu.onKeyDown);
  }

  static onMenuCloserClick(event) {
    const closer = event.currentTarget;
    if (!closer) {
      return;
    }
    const menu = closer.parentElement;
    if (!menu) {
      return;
    }
    if (closer instanceof HTMLAnchorElement) {
      event.preventDefault();
    }
    Menu.hide(menu);
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    const lastOpenMenu = OPEN_MENUS[OPEN_MENUS.length - 1];
    if (lastOpenMenu) {
      Menu.hide(lastOpenMenu.element);
    }
  }

  static onKeyDown(event) {
    const menuElement = event.currentTarget;
    if (!menuElement || menuElement.hasAttribute('mdw-hide') || !menuElement.hasAttribute('mdw-show')) {
      return;
    }
    if (event.key === 'Tab') {
      this.previousFocus = null;
      Menu.hide(menuElement);
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.stopPropagation();
      event.preventDefault();
      Menu.hide(menuElement);
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      event.stopPropagation();
      event.preventDefault();
      Menu.selectNextMenuItem(menuElement, true);
      return;
    }
    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      event.stopPropagation();
      event.preventDefault();
      Menu.selectNextMenuItem(menuElement, false);
    }
    if (!document.activeElement) {
      return;
    }
    if (document.activeElement === menuElement) {
      return;
    }
    if (document.activeElement.parentElement !== menuElement) {
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

  static detach(menuElement) {
    Menu.hide(menuElement);
    const menuCloser = menuElement.getElementsByClassName('mdw-menu__close')[0];
    if (menuCloser) {
      menuCloser.removeEventListener('click', Menu.onMenuCloserClick);
    }
    menuElement.addEventListener('keydown', Menu.onKeyDown);
    menuElement.removeAttribute('mdw-js');
    menuElement.removeAttribute('mdw-show');
    menuElement.removeAttribute('mdw-hide');
    const popupElement = menuElement.getElementsByClassName('mdw-menu__popup')[0];
    if (popupElement) {
      popupElement.style.removeProperty('top');
      popupElement.style.removeProperty('left');
      popupElement.style.removeProperty('right');
      popupElement.style.removeProperty('bottom');
      popupElement.style.removeProperty('margin');
      popupElement.style.removeProperty('transform-origin');
      popupElement.style.removeProperty('position');
      if (popupElement.hasAttribute('style') && !popupElement.getAttribute('style')) {
        popupElement.removeAttribute('style');
      }
    }
    const menuItems = menuElement.getElementsByClassName('mdw-menu__item');
    for (let i = 0; i < menuItems.length; i += 1) {
      MenuItem.detach(menuItems.item(i));
    }
  }

  static selectNextMenuItem(menu, backwards) {
    const menuItems = menu.getElementsByClassName('mdw-menu__item');
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
   * @param {Element} menuElement
   * @param {Element} popupElement
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {void}
   */
  static updateMenuPosition(menuElement, popupElement, event, alignTarget) {
    let top = 'auto';
    let left = 'auto';
    let transformOrigin = '';
    const useAlignTarget = (alignTarget !== false);
    const margin = useAlignTarget ? '0' : '';
    const mdwPosition = menuElement.getAttribute('mdw-position') || '';
    let alignTop = mdwPosition.indexOf('top') !== -1;
    let alignBottom = mdwPosition.indexOf('bottom') !== -1;
    let alignLeft = mdwPosition.indexOf('lef') !== -1;
    let alignRight = mdwPosition.indexOf('right') !== -1;
    const alignEnd = mdwPosition.indexOf('end') !== -1;
    const alignStart = !alignLeft && !alignRight && !alignEnd;
    const target = event.currentTarget || event.target;

    const offsetTop = (useAlignTarget ? event.offsetY : 0);
    const offsetBottom = (useAlignTarget ? target.clientHeight - event.offsetY : 0);
    let { pageX, pageY } = event;
    if (!pageX && !pageY) {
      const rect = target.getBoundingClientRect();
      pageX = rect.x;
      pageY = rect.y;
    }
    if (!alignTop && !alignBottom) {
      // Dynamic vertical position
      if (popupElement.clientHeight + (pageY - offsetTop) > window.innerHeight) {
        alignBottom = true;
      } else {
        alignTop = true;
      }
    }
    if (alignTop) {
      top = `${pageY - offsetTop}px`;
      transformOrigin = 'top';
    } else {
      top = `${(pageY + offsetBottom) - popupElement.clientHeight}px`;
      transformOrigin = 'bottom';
    }

    const offsetLeft = (useAlignTarget ? event.offsetX : 0);
    const offsetRight = (useAlignTarget ? target.clientWidth - event.offsetX : 0);
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
      if (popupElement.clientWidth + (pageX - offsetLeft) > window.innerWidth) {
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
      left = `${(pageX + offsetRight) - popupElement.clientWidth}px`;
      transformOrigin += ' right';
    }

    popupElement.style.setProperty('top', top);
    popupElement.style.setProperty('left', left);
    popupElement.style.setProperty('right', 'auto');
    popupElement.style.setProperty('bottom', 'auto');
    popupElement.style.setProperty('margin', margin);
    popupElement.style.setProperty('transform-origin', transformOrigin);
    popupElement.style.setProperty('position', 'fixed');
  }

  /**
   * @param {Element} menuElement 
   * @return {void}
   */
  static refreshMenuItems(menuElement) {
    const menuItems = menuElement.getElementsByClassName('mdw-menu__item');
    for (let i = 0; i < menuItems.length; i += 1) {
      const menuItem = menuItems.item(i);
      menuItem.setAttribute('tabindex', '-1');
      MenuItem.attach(menuItem);
    }
    const popupElement = menuElement.getElementsByClassName('mdw-menu__popup')[0];
    popupElement.setAttribute('tabindex', '-1');
  }

  /**
   * @param {Element} menuElement
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {boolean} handled
   */
  static show(menuElement, event, alignTarget) {
    if (event.currentTarget instanceof HTMLAnchorElement) {
      // Prevent anchor link
      event.preventDefault();
    }
    const popupElement = menuElement.getElementsByClassName('mdw-menu__popup')[0];
    let changed = false;
    if (event) {
      Menu.updateMenuPosition(menuElement, popupElement, event, alignTarget);
    } else {
      popupElement.style.removeProperty('top');
      popupElement.style.removeProperty('left');
      popupElement.style.removeProperty('right');
      popupElement.style.removeProperty('bottom');
      popupElement.style.removeProperty('margin');
      popupElement.style.removeProperty('transform-origin');
      popupElement.style.removeProperty('position');
      if (popupElement.hasAttribute('style') && !popupElement.getAttribute('style')) {
        popupElement.removeAttribute('style');
      }
    }
    if (menuElement.hasAttribute('mdw-hide')) {
      menuElement.removeAttribute('mdw-hide');
      changed = true;
    }
    if (!menuElement.hasAttribute('mdw-show')) {
      menuElement.setAttribute('mdw-show', '');
      changed = true;
    }
    if (changed) {
      Menu.attach(menuElement);
      const previousFocus = document.activeElement;
      if (window.history && window.history.pushState) {
        const title = 'Menu';
        window.history.pushState({ menuOpenTime: Date.now() }, title, '');
        window.addEventListener('popstate', Menu.onPopState);
      }
      const menuStack = new MenuStack(menuElement, previousFocus);
      OPEN_MENUS.push(menuStack);
      Menu.refreshMenuItems(menuElement);
      if (event && !event.pointerType && !event.detail) {
        // Triggered with keyboard event
        Menu.selectNextMenuItem(menuElement);
      } else {
        popupElement.focus();
      }
    }
    return changed;
  }

  /**
   * @param {Element} menuElement
   * @return {boolean} handled
   */
  static hide(menuElement) {
    if (!menuElement.hasAttribute('mdw-hide')) {
      menuElement.setAttribute('mdw-hide', '');
      let stackIndex = -1;
      OPEN_MENUS.some((stack, index) => {
        if (stack.element === menuElement) {
          stackIndex = index;
          return true;
        }
        return false;
      });
      if (stackIndex !== -1) {
        const menuStack = OPEN_MENUS[stackIndex];
        if (menuStack.previousFocus) {
          menuStack.previousFocus.focus();
        }
        OPEN_MENUS.splice(stackIndex, 1);
        if (menuStack.historyState && window.history && window.history.state) {
          // IE11 returns a cloned state object, not the original
          if (menuStack.historyState.menuOpenTime === window.history.state.menuOpenTime) {
            window.history.back();
          }
        }
      }
      if (!OPEN_MENUS.length) {
        window.removeEventListener('popstate', Menu.onPopState);
      }
      return true;
    }
    return false;
  }
}

export {
  Menu,
  MenuItem,
};
