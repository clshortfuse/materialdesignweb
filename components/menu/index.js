// https://www.w3.org/TR/wai-aria-practices/#menu

import {
  dispatchDomEvent,
  isRtl,
  iterateArrayLike,
  iterateSomeOfArrayLike,
  nextTick,
  cancelTick,
} from '../../core/dom';

import * as MenuItem from './item';

class MenuStack {
  /**
   * @param {Element} element
   * @param {Element} previousFocus
   * @param {Object} [state]
   * @param {Object} [previousState]
   * @param {MouseEvent|PointerEvent} [originalEvent]
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

export const HIDE_EVENT = 'mdw:menu-hide';

/**
 * @param {Element} menuElement
 * @return {void}
 */
export function attach(menuElement) {
  menuElement.setAttribute('mdw-menu-js', '');
  menuElement.addEventListener('click', onMenuClick);
  menuElement.addEventListener('scroll', onMenuScroll);
  menuElement.addEventListener('touchmove', onMenuScroll);
  menuElement.addEventListener('wheel', onMenuScroll);
  menuElement.addEventListener('keydown', onKeyDown);
  setupARIA(menuElement);
}

/**
 * @param {Element} menuElement
 * @return {void}
 */
export function setupARIA(menuElement) {
  if (menuElement.hasAttribute('mdw-no-aria')) {
    return;
  }
  if (!menuElement.hasAttribute('aria-hidden')) {
    menuElement.setAttribute('aria-hidden', 'true');
  }
  iterateArrayLike(menuElement.getElementsByClassName('mdw-divider'),
    el => el.setAttribute('role', 'separator'));
  menuElement.setAttribute('role', 'menu');
  const popupElement = menuElement.getElementsByClassName('mdw-menu__popup')[0];
  if (popupElement) {
    popupElement.setAttribute('role', 'none');
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onMenuScroll(event) {
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

/**
 * @param {MouseEvent|PointerEvent} event
 * @return {void}
 */
export function onMenuClick(event) {
  if (event.currentTarget === event.target && event.target instanceof HTMLElement) {
    event.stopPropagation();
    hide(event.target);
  }
}

/**
 * @return {void}
 */
export function onWindowResize() {
  const lastOpenMenu = OPEN_MENUS[OPEN_MENUS.length - 1];
  if (!lastOpenMenu || !lastOpenMenu.originalEvent) {
    return;
  }
  if (lastOpenMenu.pendingResizeOperation) {
    cancelTick(lastOpenMenu.pendingResizeOperation);
  }
  lastOpenMenu.pendingResizeOperation = nextTick(() => {
    updateMenuPosition(
      lastOpenMenu.element,
      /** @type {HTMLElement} */ (lastOpenMenu.element.getElementsByClassName('mdw-menu__popup')[0]),
      lastOpenMenu.originalEvent
    );
    lastOpenMenu.pendingResizeOperation = null;
  });
}

/**
 * @param {PopStateEvent} event
 * @return {void}
 */
export function onPopState(event) {
  if (!event.state) {
    return;
  }
  const lastOpenMenu = OPEN_MENUS[OPEN_MENUS.length - 1];
  if (!lastOpenMenu || !lastOpenMenu.previousState) {
    return;
  }
  if ((lastOpenMenu.previousState === event.state) || Object.keys(event.state)
    .every(key => event.state[key] === lastOpenMenu.previousState[key])) {
    hide(lastOpenMenu.element);
  }
}

/**
 * @param {KeyboardEvent} event
 * @return {void}
 */
export function onKeyDown(event) {
  /** @type {HTMLElement} */
  const menuElement = (event.currentTarget);
  if (!menuElement || menuElement.getAttribute('aria-hidden') === 'true') {
    return;
  }

  if (event.key === 'ArrowDown' || (event.key === 'Down')) {
    event.stopPropagation();
    event.preventDefault();
    selectNextMenuItem(menuElement, false);
    return;
  }
  if (event.key === 'ArrowUp' || (event.key === 'Up')) {
    event.stopPropagation();
    event.preventDefault();
    selectNextMenuItem(menuElement, true);
    return;
  }
  if (event.key === 'Tab') {
    // Hide menu allowing focus to revert to calling element
    // To then allow browser default Tab interaction
    // Unless menu hiding is cancelled
    if (!hide(menuElement)) {
      event.stopPropagation();
      event.preventDefault();
    }
    return;
  }
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.stopPropagation();
    event.preventDefault();
    hide(menuElement);
  }
}

/**
 * @param {Element} menuElement
 * @return {void}
 */
export function detach(menuElement) {
  hide(menuElement);
  menuElement.removeEventListener('click', onMenuClick);
  menuElement.removeEventListener('scroll', onMenuScroll);
  menuElement.removeEventListener('touchmove', onMenuScroll);
  menuElement.removeEventListener('wheel', onMenuScroll);
  menuElement.addEventListener('keydown', onKeyDown);
  menuElement.removeAttribute('mdw-menu-js');
  /** @type {HTMLElement} */
  const popupElement = (menuElement.getElementsByClassName('mdw-menu__popup')[0]);
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

/**
 * @param {Element} menu
 * @param {boolean} [backwards=false]
 * @return {void}
 */
export function selectNextMenuItem(menu, backwards) {
  /** @type {HTMLCollectionOf<HTMLElement>} */
  const menuItems = (menu.getElementsByClassName('mdw-menu__item'));
  let foundTarget = false;
  /** @type {HTMLElement} */
  let candidate = null;
  /** @type {HTMLElement} */
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
 * @param {HTMLElement} popupElement
 * @param {MouseEvent|PointerEvent} [event]
 * @param {boolean} [alignTarget=true]
 * @return {void}
 */
export function updateMenuPosition(menuElement, popupElement, event, alignTarget) {
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
export function refreshMenuItems(menuElement) {
  iterateArrayLike(menuElement.getElementsByClassName('mdw-menu__item'), (menuItem) => {
    menuItem.setAttribute('tabindex', '-1');
    MenuItem.attach(menuItem);
  });
  const popupElement = menuElement.getElementsByClassName('mdw-menu__popup')[0];
  popupElement.setAttribute('tabindex', '-1');
}

/**
 * @param {Element} menuElement
 * @param {MouseEvent|PointerEvent} [event]
 * @param {boolean} [alignTarget=true]
 * @return {boolean} handled
 */
export function show(menuElement, event, alignTarget) {
  if (event && event.currentTarget instanceof HTMLAnchorElement) {
    // Prevent anchor link
    event.preventDefault();
  }
  /** @type {HTMLElement} */
  const popupElement = (menuElement.getElementsByClassName('mdw-menu__popup')[0]);
  let changed = false;
  if (event) {
    updateMenuPosition(menuElement, popupElement, event, alignTarget);
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
    attach(menuElement);
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
      window.addEventListener('popstate', onPopState);
      window.addEventListener('resize', onWindowResize);
    }
    const menuStack = new MenuStack(menuElement, previousFocus, newState, previousState, event);
    OPEN_MENUS.push(menuStack);
    refreshMenuItems(menuElement);
    if (event && !event.detail && ('pointerType' in event) && !event.pointerType) {
      // Triggered with keyboard event
      selectNextMenuItem(menuElement);
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
export function hide(menuElement) {
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
    if (menuStack.previousFocus && menuStack.previousFocus instanceof HTMLElement) {
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
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('resize', onWindowResize);
  }
  dispatchDomEvent(menuElement, HIDE_EVENT);
  return true;
}
