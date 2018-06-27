import { Ripple } from '../ripple/index';
import { dispatchDomEvent, isRtl } from '../common/dom';

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
    element.addEventListener('click', MenuItem.onClick);
  }

  /**
   * @param {MouseEvent|KeyboardEvent|PointerEvent} event
   * @return {void}
   */
  static onClick(event) {
    const el = event.currentTarget;
    dispatchDomEvent(el, 'mdw:itemactivated');
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
    element.removeEventListener('click', MenuItem.onClick);
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

  /** @return {void} */
  static onPopState() {
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
    if (document.activeElement.hasAttribute('disabled')) {
      return;
    }
    if (event.key === 'Spacebar' || (event.key === ' ')) {
      event.stopPropagation();
      event.preventDefault();
      /**
       * if (document.activeElement.hasAttribute('mdw-checked')) {
       *   document.activeElement.removeAttribute('mdw-checked');
       * } else {
       *   document.activeElement.setAttribute('mdw-checked', '');
       * }
       */
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
    const mdwDirection = menuElement.getAttribute('mdw-direction') || '';
    let alignTop = mdwPosition.indexOf('top') !== -1;
    let alignBottom = mdwPosition.indexOf('bottom') !== -1;
    let alignVCenter = mdwPosition.indexOf('vcenter') !== -1;

    const alignStart = mdwPosition.indexOf('start') !== -1;
    const alignEnd = mdwPosition.indexOf('end') !== -1;
    let alignLeft = mdwPosition.indexOf('left') !== -1;
    let alignRight = mdwPosition.indexOf('right') !== -1;
    let alignHCenter = mdwPosition.indexOf('hcenter') !== -1;

    let openUp = mdwDirection.indexOf('up') !== -1;
    let openDown = mdwDirection.indexOf('down') !== -1;
    const openNormal = mdwDirection.indexOf('normal') !== -1;
    const openReverse = mdwDirection.indexOf('reverse') !== -1;
    let openVCenter = mdwDirection.indexOf('vcenter') !== -1;
    let openHCenter = mdwDirection.indexOf('hcenter') !== -1;
    let openLtr = mdwDirection.indexOf('ltr') !== -1;
    let openRtl = mdwDirection.indexOf('rtl') !== -1;

    const target = event.currentTarget || event.target;

    let isPageRTL = null;
    if (alignStart || alignEnd || openNormal || openReverse) {
      // Using page-direction based values
      isPageRTL = isRtl();
      if (alignStart || alignEnd) {
        if (alignStart) {
          if (isPageRTL) {
            alignRight = true;
          } else {
            alignLeft = true;
          }
        } else if (isPageRTL) {
          alignLeft = true;
        } else {
          alignRight = true;
        }
      }
      if (openNormal || openReverse) {
        if (openNormal) {
          if (isPageRTL) {
            openRtl = true;
          } else {
            openLtr = true;
          }
        } else if (isPageRTL) {
          openLtr = true;
        } else {
          openRtl = true;
        }
      }
    }
    const offsetTop = (useAlignTarget ? -event.offsetY : 0);
    const offsetBottom = (useAlignTarget ? target.clientHeight - event.offsetY : 0);
    const offsetLeft = (useAlignTarget ? -event.offsetX : 0);
    const offsetRight = (useAlignTarget ? target.clientWidth - event.offsetX : 0);
    let { pageX, pageY } = event;
    if (!pageX && !pageY) {
      const rect = target.getBoundingClientRect();
      pageX = rect.x;
      pageY = rect.y;
    }

    /* Automatic Positioning
     *
     * 9 Positions
     *   3      7      4
     *     ┌─────────┐
     *     │         │
     *   5 │    9    │ 6
     *     │         │
     *     └─────────┘
     *   1      8      2
     *
     * 1: Bottom Left
     * 2: Bottom Right
     * 3: Top Left
     * 4: Top Right
     * 5: VCenter Left
     * 6: VCenter Right
     * 7: HCenter Top
     * 8: HCenter Bottom
     * 9: VCenter HCenter
     *
     * 9 Directions:
     * a - Down LTR
     * b - Down RTL
     * c - Up LTR
     * d - Up RTL
     * e - LTR
     * f - RTL
     * g - Down
     * h - Up
     * i - Center
     *
     *
     * 16 total combos
     * 1a 1b 1c 1d  └↘ └↙ └↗ └↖
     * 2a 2b 2c 2d  ┘↘ ┘↙ ┘↗ ┘↖
     * 3a 3b 3c 3d  ┌↘ ┌↙ ┌↗ ┌↖
     * 4a 4b 4c 4d  ┐↘ ┐↙ ┐↗ ┐↖
     *
     * Avoid using opposite angle
     *
     * 1a XX 1c 1d  └↘ ██ └↗ └↖
     * XX 2b 2c 2d  ██ ┘↙ ┘↗ ┘↖
     * 1a 3b 3c XX  ┌↘ ┌↙ ┌↗ ██
     * 4a 4b XX 4d  ┐↘ ┐↙ ██ ┐↖
     *
     *
     * Preference Order:
     * - Flow from corner           1a 2b 3c 4d    └↘ ┘↙ ┌↗ ┐↖
     * - Open adjacent to target    4a 3b 2c 1d    ┐↘ ┌↙ ┘↗ └↖
     * - Overlay target             3a 4b 1c 2d    ┌↘ ┐↙ └↗ ┘↖
     * - Open from horizontal side  5e 6f          │→ │←
     * - Open from center           9i             █·
     */

    popupElement.style.setProperty('max-height', 'none');
    const popupElementHeight = popupElement.clientHeight;
    const canOpenDownwardsFromBottom = !alignTop && !alignVCenter
      && !openUp && !openVCenter
      && popupElementHeight + (pageY + offsetBottom) <= window.innerHeight;
    const canOpenDownwardsFromTop = !alignBottom && !alignVCenter
      && !openUp && !openVCenter
      && popupElementHeight + (pageY + offsetTop) <= window.innerHeight;
    const canOpenUpwardsFromTop = !alignBottom && !alignVCenter && !openDown
      && !openVCenter
      && pageY + offsetTop >= popupElementHeight;
    const canOpenUpwardsFromBottom = !alignTop && !alignVCenter && !openDown
      && !openVCenter
      && pageY + offsetBottom >= popupElementHeight;
    const canOpenRightwardsFromLeft = !alignRight && !alignHCenter
      && !openRtl && !openHCenter
      && popupElement.clientWidth + (pageX + offsetLeft) <= window.innerWidth;
    const canOpenRightwardsFromRight = !alignLeft && !alignHCenter
      && !openRtl && !openHCenter
      && popupElement.clientWidth + (pageX + offsetRight) <= window.innerWidth;
    const canOpenLeftwardsFromRight = !alignLeft && !alignHCenter
      && !openLtr && !openHCenter
      && pageX + offsetRight >= popupElement.clientWidth;
    const canOpenLeftwardsFromLeft = !alignRight && !alignHCenter
      && !openLtr && !openHCenter
      && pageX + offsetLeft >= popupElement.clientWidth;
    const canOpenFromCenter = !alignLeft && !alignRight && !alignTop && !alignBottom
      && !openUp && !openDown
      && ((pageX + offsetLeft) / 2) >= (popupElement.clientWidth / 2)
      && (popupElement.clientWidth / 2) + ((pageX + offsetLeft) / 2) <= window.innerWidth;
    popupElement.style.removeProperty('max-height');
    const candidates = [
      canOpenDownwardsFromBottom && canOpenRightwardsFromLeft,  // 1a └↘
      canOpenDownwardsFromBottom && canOpenLeftwardsFromRight,  // 2b ┘↙
      canOpenUpwardsFromTop && canOpenRightwardsFromLeft,       // 3c ┌↗
      canOpenUpwardsFromTop && canOpenLeftwardsFromLeft,        // 4d ┐↖
      canOpenDownwardsFromTop && canOpenRightwardsFromRight,    // 4a ┐↘
      canOpenDownwardsFromTop && canOpenLeftwardsFromLeft,      // 3b ┌↙
      canOpenUpwardsFromBottom && canOpenRightwardsFromRight,   // 2c ┘↗
      canOpenUpwardsFromBottom && canOpenLeftwardsFromLeft,     // 1d └↖
      canOpenDownwardsFromTop && canOpenRightwardsFromLeft,     // 3a ┌↘
      canOpenDownwardsFromTop && canOpenLeftwardsFromRight,     // 4b ┐↙
      canOpenUpwardsFromBottom && canOpenRightwardsFromLeft,    // 1c └↗
      canOpenUpwardsFromBottom && canOpenRightwardsFromRight,   // 2d ┘↖
      canOpenRightwardsFromLeft,                                // 5e │→
      canOpenLeftwardsFromRight,                                // 6f │←
      canOpenFromCenter,                                        // 9i █·
    ].map((value, index) => {
      if (value) {
        return index + 1;
      }
      return 0;
    }).filter(value => value !== 0);
    if (candidates.length) {
      let candidateNumber;
      if (isPageRTL === null) {
        isPageRTL = isRtl();
      }
      if (isPageRTL) {
        candidateNumber = [2, 1, 4, 3, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 15]
          .filter(number => candidates.indexOf(number) !== -1)[0];
      } else {
        candidateNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          .filter(number => candidates.indexOf(number) !== -1)[0];
      }
      if (candidateNumber == null) {
        candidateNumber = isPageRTL ? 2 : 1;
      }
      switch (candidateNumber) {
        // Position
        default:
        case 1:
        case 8:
        case 11:
          alignBottom = true; alignLeft = true;
          break;
        case 2:
        case 7:
        case 12:
          alignBottom = true; alignRight = true;
          break;
        case 3:
        case 6:
        case 9:
          alignTop = true; alignLeft = true;
          break;
        case 4:
        case 5:
        case 10:
          alignTop = true; alignRight = true;
          break;
        case 13:
          alignVCenter = true; alignLeft = true;
          break;
        case 14:
          alignVCenter = true; alignRight = true;
          break;
        case 15:
          alignVCenter = true; alignHCenter = true;
      }
      switch (candidateNumber) {
        // Direction
        default:
        case 1:
        case 5:
        case 9:
          openDown = true; openLtr = true;
          break;
        case 2:
        case 6:
        case 10:
          openDown = true; openRtl = true;
          break;
        case 3:
        case 7:
        case 11:
          openUp = true; openLtr = true;
          break;
        case 4:
        case 8:
        case 12:
          openUp = true; openRtl = true;
          break;
        case 13:
          openLtr = true; openVCenter = true;
          break;
        case 14:
          openRtl = true; openVCenter = true;
          break;
        case 15:
          openHCenter = true; openVCenter = true;
          break;
      }
    }

    if (openLtr) {
      if (alignRight) {
        left = `${pageX + offsetRight}px`;
      } else if (alignHCenter) {
        left = `${pageX + ((offsetLeft + offsetRight) / 2)}px`;
      } else {
        left = `${pageX + offsetLeft}px`;
      }
      transformOrigin = 'left';
    } else if (openHCenter) {
      if (alignLeft) {
        left = `${(pageX + offsetLeft) - (popupElement.clientWidth / 2)}px`;
      } else if (alignRight) {
        left = `${(pageX + offsetRight) - (popupElement.clientWidth / 2)}px`;
      } else {
        left = `${(pageX + ((offsetLeft + offsetRight) / 2)) - (popupElement.clientWidth / 2)}px`;
      }
      transformOrigin = 'center';
    } else {
      if (alignLeft) {
        left = `${(pageX + offsetLeft) - popupElement.clientWidth}px`;
      } else if (alignHCenter) {
        left = `${(pageX + ((offsetLeft + offsetRight) / 2)) - popupElement.clientWidth}px`;
      } else {
        left = `${(pageX + offsetRight) - popupElement.clientWidth}px`;
      }
      transformOrigin = 'right';
    }

    if (openUp) {
      if (alignBottom) {
        top = `${(pageY + offsetBottom) - popupElement.clientHeight}px`;
      } else if (alignVCenter) {
        top = `${(pageY + ((offsetTop + offsetBottom) / 2)) - popupElement.clientHeight}px`;
      } else {
        top = `${(pageY + offsetTop) - popupElement.clientHeight}px`;
      }
      transformOrigin += ' bottom';
    } else if (openVCenter) {
      if (alignBottom) {
        top = `${(pageY + offsetBottom) - (popupElement.clientHeight / 2)}px`;
      } else if (alignTop) {
        top = `${(pageY + offsetTop) - (popupElement.clientHeight / 2)}px`;
      } else {
        top = `${(pageY + ((offsetTop + offsetBottom) / 2)) - (popupElement.clientHeight / 2)}px`;
      }
      transformOrigin += ' center';
    } else {
      if (alignTop) {
        top = `${pageY + offsetTop}px`;
      } else if (alignVCenter) {
        top = `${pageY + ((offsetTop + offsetBottom) / 2)}px`;
      } else {
        top = `${pageY + offsetBottom}px`;
      }
      transformOrigin += ' top';
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
    if (event && event.currentTarget instanceof HTMLAnchorElement) {
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
      dispatchDomEvent(menuElement, 'mdw:dismiss');
      return true;
    }
    return false;
  }
}

export {
  Menu,
  MenuItem,
};
