import { getChildElementByClass, findElementParentByClassName } from '../../common/dom';
import { Ripple } from '../ripple/index';

// https://www.w3.org/TR/wai-aria-practices/#menu

class MenuItem {
  /**
   * @param {Element} element
   * @param {boolean=} [attachRipple=true]
   * @return {void}
   */
  static attach(element, attachRipple) {
    element.setAttribute('mdw-js', '');
    if (attachRipple !== false) {
      Ripple.attach(element);
    }
    // If mouseover is used, an item can still lose focus via keyboard navigation.
    // An extra event listener would need to be created to catch blur but the cursor
    // would still remain over the element, thus needing another mousemove event.
    // Prioritization is given to less event listeners rather than operations per second.
    element.addEventListener('mousemove', MenuItem.onMouseMove);
  }

  static onMouseMove(event) {
    const el = findElementParentByClassName(event.target, 'mdw-menu__item');
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
   * @param {boolean=} [detachRipple=true]
   * @return {void}
   */
  static detach(element, detachRipple) {
    element.removeEventListener('mousemove', MenuItem.onMouseMove);
    element.removeAttribute('mdw-js');
    if (detachRipple !== false) {
      Ripple.detach(element);
    }
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
    let menuCloser = getChildElementByClass(menuElement, 'mdw-menu__close');
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
    const closer = findElementParentByClassName(event.target, 'mdw-menu__close');
    if (!closer) {
      return;
    }
    const menu = findElementParentByClassName(closer, 'mdw-menu');
    if (!menu) {
      return;
    }
    Menu.hide(menu);
  }

  static onPopState(event) {
    const lastOpenMenu = OPEN_MENUS[OPEN_MENUS.length - 1];
    if (lastOpenMenu) {
      Menu.hide(lastOpenMenu.element);
    }
  }

  static onKeyDown(event) {
    const menuElement = findElementParentByClassName(event.target, 'mdw-menu');
    if (!menuElement) {
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
    const menuCloser = getChildElementByClass(menuElement, 'mdw-menu__close');
    if (menuCloser) {
      menuCloser.removeEventListener('click', Menu.onMenuCloserClick);
    }
    menuElement.addEventListener('keydown', Menu.onKeyDown);
    menuElement.removeAttribute('mdw-js');
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
   * @param {Element} menuElement,
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {void}
   */
  static updateMenuPosition(menuElement, event, alignTarget) {
    let top = 'auto';
    let left = 'auto';
    let transformOrigin = '';
    const useAlignTarget = (alignTarget !== false);
    const margin = useAlignTarget ? '0' : '';
    const mdwPosition = menuElement.getAttribute('mdw-position') || '';
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
      if (menuElement.clientHeight + (pageY - offsetTop) > window.innerHeight) {
        alignBottom = true;
      } else {
        alignTop = true;
      }
    }
    if (alignTop) {
      top = `${pageY - offsetTop}px`;
      transformOrigin = 'top';
    } else {
      top = `${(pageY + offsetBottom) - menuElement.clientHeight}px`;
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
      if (menuElement.clientWidth + (pageX - offsetLeft) > window.innerWidth) {
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
      left = `${(pageX + offsetRight) - menuElement.clientWidth}px`;
      transformOrigin += ' right';
    }

    menuElement.style.setProperty('top', top);
    menuElement.style.setProperty('left', left);
    menuElement.style.setProperty('right', 'auto');
    menuElement.style.setProperty('bottom', 'auto');
    menuElement.style.setProperty('margin', margin);
    menuElement.style.setProperty('transform-origin', transformOrigin);
    menuElement.style.setProperty('position', 'fixed');
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
    menuElement.setAttribute('tabindex', '-1');
  }

  /**
   * @param {Element} menuElement
   * @param {MouseEvent=} event
   * @param {boolean=} [alignTarget=true]
   * @return {boolean} handled
   */
  static show(menuElement, event, alignTarget) {
    let changed = false;
    if (event) {
      Menu.updateMenuPosition(menuElement, event, alignTarget);
    } else {
      menuElement.style.removeProperty('top');
      menuElement.style.removeProperty('left');
      menuElement.style.removeProperty('right');
      menuElement.style.removeProperty('bottom');
      menuElement.style.removeProperty('margin');
      menuElement.style.removeProperty('transform-origin');
      menuElement.style.removeProperty('position');
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
        window.history.pushState({}, title, '');
        window.addEventListener('popstate', Menu.onPopState);
      }
      const menuStack = new MenuStack(menuElement, previousFocus);
      OPEN_MENUS.push(menuStack);
      Menu.refreshMenuItems(menuElement);
      if (event && !event.pointerType && !event.detail) {
        // Triggered with keyboard event
        Menu.selectNextMenuItem(menuElement);
      } else {
        menuElement.focus();
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
      const menuStackIndex = OPEN_MENUS.findIndex(openMenu => openMenu.element === menuElement);
      if (menuStackIndex !== -1) {
        const menuStack = OPEN_MENUS[menuStackIndex];
        if (menuStack.previousFocus) {
          menuStack.previousFocus.focus();
        }
        OPEN_MENUS.splice(menuStackIndex, 1);
      }
      if (!OPEN_MENUS.length) {
        window.removeEventListener('popstate', this.onPopState);
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
