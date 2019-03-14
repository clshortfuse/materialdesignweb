// https://www.w3.org/TR/wai-aria-practices/#menu

import { Ripple } from '../ripple/index';
import {
  dispatchDomEvent,
  isRtl,
  iterateArrayLike,
  iterateSomeOfArrayLike,
  iterateElementSiblings,
  nextTick,
  cancelTick,
} from '../common/dom';


class MenuItem {
  static get ACTIVATE_EVENT() {
    return 'mdw:menuitem-activate';
  }

  static get CHECK_EVENT() {
    return 'mdw:menuitem-check';
  }

  static get UNCHECK_EVENT() {
    return 'mdw:menuitem-uncheck';
  }

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
    element.addEventListener('keydown', MenuItem.onKeyDown);
    MenuItem.setupARIA(element);
  }

  /**
   * @param {Element} element
   * @return {void}
   */
  static setupARIA(element) {
    if (element.hasAttribute('mdw-no-aria')) {
      return;
    }
    const role = element.getAttribute('role');
    let useAriaChecked = false;
    if (role === 'menuitemcheckbox' || role === 'menuitemradio') {
      useAriaChecked = true;
    } else if (role !== 'menuitem') {
      if (element.getElementsByClassName('mdw-menu__check').length) {
        useAriaChecked = true;
        element.setAttribute('role', 'menuitemcheckbox');
      } else if (element.getElementsByClassName('mdw-menu__radio').length) {
        useAriaChecked = true;
        element.setAttribute('role', 'menuitemradio');
      } else {
        element.setAttribute('role', 'menuitem');
      }
    }
    if (useAriaChecked && !element.hasAttribute('aria-checked')) {
      element.setAttribute('aria-checked', 'false');
    }
    iterateArrayLike(element.getElementsByClassName('mdw-menu__icon'),
      el => el.setAttribute('aria-hidden', 'true'));
    iterateArrayLike(element.getElementsByClassName('mdw-menu__text'),
      el => el.setAttribute('role', 'text'));
    iterateArrayLike(element.getElementsByClassName('mdw-menu__check'),
      el => el.setAttribute('aria-hidden', 'true'));
    iterateArrayLike(element.getElementsByClassName('mdw-menu__info'),
      el => el.setAttribute('role', 'note'));
  }

  /**
   * @param {MouseEvent|KeyboardEvent|PointerEvent} event
   * @return {void}
   */
  static onClick(event) {
    event.stopPropagation();

    /** @type {HTMLElement} */
    const menuItemElement = (event.currentTarget);
    if (menuItemElement.getAttribute('aria-disabled') === 'true') {
      return;
    }
    const role = menuItemElement.getAttribute('role');
    if (role === 'menuitemcheckbox') {
      MenuItem.toggleChecked(menuItemElement);
    } else if (role === 'menuitemradio') {
      MenuItem.setChecked(menuItemElement, true);
    }
    dispatchDomEvent(menuItemElement, MenuItem.ACTIVATE_EVENT);
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

  static onKeyDown(event) {
    /** @type {HTMLElement} */
    const menuItemElement = (event.currentTarget);
    if (MenuItem.isDisabled(menuItemElement)) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      MenuItem.onClick(event);
      return;
    }

    if (event.key === 'Spacebar' || (event.key === ' ')) {
      event.stopPropagation();
      event.preventDefault();
      const role = menuItemElement.getAttribute('role');
      if (role === 'menuitemcheckbox') {
        MenuItem.toggleChecked(menuItemElement);
      } else if (role === 'menuitemradio') {
        MenuItem.setChecked(menuItemElement, true);
      } else {
        dispatchDomEvent(menuItemElement, MenuItem.ACTIVATE_EVENT);
      }
    }
  }

  /**
   * @param {Element} element
   * @return {boolean}
   */
  static isChecked(element) {
    return (element.getAttribute('aria-checked') === 'true');
  }

  /**
   * @param {Element} element
   * @return {boolean}
   */
  static isDisabled(element) {
    return (element.getAttribute('aria-disabled') === 'true');
  }

  /**
   * @param {Element} element
   * @param {boolean} checked
   * @return {boolean} uiChanged
   */
  static setChecked(element, checked) {
    const role = element.getAttribute('role');
    let isCheckable = false;
    if (role === 'menuitemcheckbox') {
      isCheckable = true;
      if (!dispatchDomEvent(element, checked ? MenuItem.CHECK_EVENT : MenuItem.UNCHECK_EVENT)) {
        return false;
      }
    }
    if (role === 'menuitemradio') {
      isCheckable = true;
      if (checked) {
        if (!dispatchDomEvent(element, MenuItem.CHECK_EVENT)) {
          return false;
        }
        iterateElementSiblings(element, (sibling) => {
          if (sibling.getAttribute('role') === 'menuitemradio') {
            sibling.setAttribute('aria-checked', 'false');
          }
        });
      }
    }
    if (!isCheckable) {
      return false;
    }
    element.setAttribute('aria-checked', checked ? 'true' : 'false');
    return true;
  }

  static toggleChecked(element) {
    const checked = !MenuItem.isChecked(element);
    return MenuItem.setChecked(element, checked);
  }

  /**
   * @param {Element} element
   * @return {boolean} handled
   */

  static openSubMenu(element) {
    const hasPopup = element.getAttribute('aria-haspopup');
    if (hasPopup !== 'menu' && hasPopup !== 'true') {
      return false;
    }

    // TODO: Open new menu
    return false;
  }

  /**
   * @param {Element} element
   * @return {void}
   */
  static detach(element) {
    element.removeEventListener('click', MenuItem.onClick);
    element.removeEventListener('mousemove', MenuItem.onMouseMove);
    element.removeEventListener('keydown', MenuItem.onKeyDown);
    element.removeAttribute('mdw-js');
    Ripple.detach(element);
  }
}

class MenuStack {
  /**
   * @param {Element} element
   * @param {Element} previousFocus
   * @param {Object=} state
   * @param {Object=} previousState
   * @param {MouseEvent=} originalEvent
   */
  constructor(element, previousFocus, state, previousState, originalEvent) {
    this.element = element;
    this.previousFocus = previousFocus;
    this.state = state;
    this.previousState = previousState;
    this.originalEvent = originalEvent;
    this.pendingResizeOperation = null;
  }
}

/** @type {MenuStack[]} */
const OPEN_MENUS = [];
class Menu {
  static get HIDE_EVENT() {
    return 'mdw:menu-hide';
  }

  /**
   * @param {Element} menuElement
   * @return {void}
   */
  static attach(menuElement) {
    menuElement.setAttribute('mdw-js', '');
    menuElement.addEventListener('click', Menu.onMenuClick);
    menuElement.addEventListener('scroll', Menu.onMenuScroll);
    menuElement.addEventListener('touchmove', Menu.onMenuScroll);
    menuElement.addEventListener('wheel', Menu.onMenuScroll);
    menuElement.addEventListener('keydown', Menu.onKeyDown);
    Menu.setupARIA(menuElement);
  }

  /**
   * @param {Element} menuElement
   * @return {void}
   */
  static setupARIA(menuElement) {
    if (menuElement.hasAttribute('mdw-no-aria')) {
      return;
    }
    if (!menuElement.hasAttribute('aria-hidden')) {
      menuElement.setAttribute('aria-hidden', 'true');
    }
    iterateArrayLike(menuElement.getElementsByClassName('mdw-menu__divider'),
      el => el.setAttribute('role', 'separator'));
    menuElement.setAttribute('role', 'menu');
    const popupElement = menuElement.getElementsByClassName('mdw-menu__popup')[0];
    if (popupElement) {
      popupElement.setAttribute('role', 'none');
    }
  }

  static onMenuScroll(event) {
    // JS needed for Safari
    event.preventDefault();
    event.stopPropagation();
    if (event.type !== 'scroll') {
      return;
    }
    /** @type {HTMLElement} */
    const element = (event.currentTarget);
    if (element.scrollTop !== element.scrollHeight / 4) {
      element.scrollTop = element.scrollHeight / 4;
    }
    if (element.scrollLeft !== element.scrollWidth / 4) {
      element.scrollLeft = element.scrollWidth / 4;
    }
  }

  static onMenuClick(event) {
    if (event.currentTarget === event.target) {
      event.stopPropagation();
      Menu.hide(event.currentTarget);
    }
  }

  /**
   * @return {void}
   */
  static onWindowResize() {
    const lastOpenMenu = OPEN_MENUS[OPEN_MENUS.length - 1];
    if (!lastOpenMenu || !lastOpenMenu.originalEvent) {
      return;
    }
    if (lastOpenMenu.pendingResizeOperation) {
      cancelTick(lastOpenMenu.pendingResizeOperation);
    }
    lastOpenMenu.pendingResizeOperation = nextTick(() => {
      Menu.updateMenuPosition(
        lastOpenMenu.element,
        lastOpenMenu.element.getElementsByClassName('mdw-menu__popup')[0],
        lastOpenMenu.originalEvent
      );
      lastOpenMenu.pendingResizeOperation = null;
    });
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    if (!event.state) {
      return;
    }
    const lastOpenMenu = OPEN_MENUS[OPEN_MENUS.length - 1];
    if (!lastOpenMenu || !lastOpenMenu.previousState) {
      return;
    }
    if ((lastOpenMenu.previousState === event.state) || Object.keys(event.state)
      .every(key => event.state[key] === lastOpenMenu.previousState[key])) {
      Menu.hide(lastOpenMenu.element);
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    /** @type {HTMLElement} */
    const menuElement = (event.currentTarget);
    if (!menuElement || menuElement.getAttribute('aria-hidden') === 'true') {
      return;
    }

    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      event.stopPropagation();
      event.preventDefault();
      Menu.selectNextMenuItem(menuElement, false);
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      event.stopPropagation();
      event.preventDefault();
      Menu.selectNextMenuItem(menuElement, true);
      return;
    }
    if (event.key === 'Tab') {
      // Hide menu allowing focus to revert to calling element
      // To then allow browser default Tab interaction
      // Unless menu hiding is cancelled
      if (!Menu.hide(menuElement)) {
        event.stopPropagation();
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.stopPropagation();
      event.preventDefault();
      Menu.hide(menuElement);
    }
  }

  static detach(menuElement) {
    Menu.hide(menuElement);
    menuElement.removeEventListener('click', Menu.onMenuClick);
    menuElement.removeEventListener('scroll', Menu.onMenuScroll);
    menuElement.removeEventListener('touchmove', Menu.onMenuScroll);
    menuElement.removeEventListener('wheel', Menu.onMenuScroll);
    menuElement.addEventListener('keydown', Menu.onKeyDown);
    menuElement.removeAttribute('mdw-js');
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
    iterateArrayLike(menuElement.getElementsByClassName('mdw-menu__item'), MenuItem.detach);
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
    iterateSomeOfArrayLike(menuItems, (el) => {
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
          return true;
        }
        return false;
      }
      if (backwards) {
        if (focusable) {
          candidate = el;
        }
        return false;
      }
      if (foundTarget) {
        if (focusable) {
          candidate = el;
          return true;
        }
        return false;
      }
      return false;
    });
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

    /** @type {HTMLElement} */
    const target = (event.currentTarget || event.target);

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
    const offsetTop = useAlignTarget ? 0 : -event.offsetY;
    const offsetBottom = useAlignTarget ? target.clientHeight : event.offsetY;
    const offsetLeft = useAlignTarget ? 0 : -event.offsetX;
    const offsetRight = useAlignTarget ? target.clientWidth : event.offsetX;
    const rect = target.getBoundingClientRect();
    const pageX = rect.left;
    const pageY = rect.top;

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
    const popupElementWidth = popupElement.clientWidth;
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
      && popupElementWidth + (pageX + offsetLeft) <= window.innerWidth;
    const canOpenRightwardsFromRight = !alignLeft && !alignHCenter
      && !openRtl && !openHCenter
      && popupElementWidth + (pageX + offsetRight) <= window.innerWidth;
    const canOpenLeftwardsFromRight = !alignLeft && !alignHCenter
      && !openLtr && !openHCenter
      && pageX + offsetRight >= popupElementWidth;
    const canOpenLeftwardsFromLeft = !alignRight && !alignHCenter
      && !openLtr && !openHCenter
      && pageX + offsetLeft >= popupElementWidth;
    const canOpenFromCenter = !alignLeft && !alignRight && !alignTop && !alignBottom
      && !openUp && !openDown
      && ((pageX + offsetLeft) / 2) >= (popupElementWidth / 2)
      && (popupElementWidth / 2) + ((pageX + offsetLeft) / 2) <= window.innerWidth;
    popupElement.style.removeProperty('max-height');
    const candidates = [
      canOpenDownwardsFromBottom && canOpenRightwardsFromLeft, // 1a └↘
      canOpenDownwardsFromBottom && canOpenLeftwardsFromRight, // 2b ┘↙
      canOpenUpwardsFromTop && canOpenRightwardsFromLeft, // 3c ┌↗
      canOpenUpwardsFromTop && canOpenLeftwardsFromLeft, // 4d ┐↖
      canOpenDownwardsFromTop && canOpenRightwardsFromRight, // 4a ┐↘
      canOpenDownwardsFromTop && canOpenLeftwardsFromLeft, // 3b ┌↙
      canOpenUpwardsFromBottom && canOpenRightwardsFromRight, // 2c ┘↗
      canOpenUpwardsFromBottom && canOpenLeftwardsFromLeft, // 1d └↖
      canOpenDownwardsFromTop && canOpenRightwardsFromLeft, // 3a ┌↘
      canOpenDownwardsFromTop && canOpenLeftwardsFromRight, // 4b ┐↙
      canOpenUpwardsFromBottom && canOpenRightwardsFromLeft, // 1c └↗
      canOpenUpwardsFromBottom && canOpenRightwardsFromRight, // 2d ┘↖
      canOpenRightwardsFromLeft, // 5e │→
      canOpenLeftwardsFromRight, // 6f │←
      canOpenFromCenter, // 9i █·
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
        left = `${(pageX + offsetLeft) - (popupElementWidth / 2)}px`;
      } else if (alignRight) {
        left = `${(pageX + offsetRight) - (popupElementWidth / 2)}px`;
      } else {
        left = `${(pageX + ((offsetLeft + offsetRight) / 2)) - (popupElementWidth / 2)}px`;
      }
      transformOrigin = 'center';
    } else {
      if (alignLeft) {
        left = `${(pageX + offsetLeft) - popupElementWidth}px`;
      } else if (alignHCenter) {
        left = `${(pageX + ((offsetLeft + offsetRight) / 2)) - popupElementWidth}px`;
      } else {
        left = `${(pageX + offsetRight) - popupElementWidth}px`;
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
  }

  /**
   * @param {Element} menuElement
   * @return {void}
   */
  static refreshMenuItems(menuElement) {
    iterateArrayLike(menuElement.getElementsByClassName('mdw-menu__item'), (menuItem) => {
      menuItem.setAttribute('tabindex', '-1');
      MenuItem.attach(menuItem);
    });
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
    if (menuElement.getAttribute('aria-hidden') !== 'false') {
      menuElement.setAttribute('aria-hidden', 'false');
      changed = true;
    }
    if (changed) {
      Menu.attach(menuElement);
      const previousFocus = document.activeElement;
      const newState = { hash: Math.random().toString(36).substr(2, 16) };
      let previousState = null;
      if (window.history && window.history.pushState) {
        if (!window.history.state) {
          // Create new previous state
          window.history.replaceState({
            hash: Math.random().toString(36).substr(2, 16),
          }, document.title);
        }
        previousState = window.history.state;
        window.history.pushState(newState, document.title);
        window.addEventListener('popstate', Menu.onPopState);
        window.addEventListener('resize', Menu.onWindowResize);
      }
      const menuStack = new MenuStack(menuElement, previousFocus, newState, previousState, event);
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
    if (menuElement.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    menuElement.setAttribute('aria-hidden', 'true');
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
      if (menuStack.state && window.history && window.history.state) {
        // IE11 returns a cloned state object, not the original
        if (menuStack.state.hash === window.history.state.hash) {
          window.history.back();
        }
      }
    }
    if (!OPEN_MENUS.length) {
      window.removeEventListener('popstate', Menu.onPopState);
      window.removeEventListener('resize', Menu.onWindowResize);
    }
    dispatchDomEvent(menuElement, Menu.HIDE_EVENT);
    return true;
  }
}

export {
  Menu,
  MenuItem,
};
