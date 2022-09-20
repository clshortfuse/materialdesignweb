// https://www.w3.org/TR/wai-aria-practices/#menu

import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';
import MDWComponent from '../../core/component/MDWComponent.js';

import styles from './MDWMenu.css' assert { type: 'css' };
import MDWMenuItem from './MDWMenuItem.js';

/**
 * @typedef {Object} MenuStack
 * @prop {MDWMenu} element
 * @prop {Element} previousFocus
 * @prop {Object} [state]
 * @prop {Object} [previousState]
 * @prop {MouseEvent|PointerEvent} [originalEvent]
 * @prop {any} [pendingResizeOperation]
 */

export default class MDWMenu extends MDWComponent {
  static elementName = 'mdw-menu';

  static supportsHTMLDialogElement = typeof HTMLDialogElement !== 'undefined';

  /** @type {MenuStack[]} */
  static OPEN_MENUS = [];

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'open',
  ];

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'direction', 'position',
  ];

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <dialog id=dialog role=menu aria-hidden=true>
        <div id=scrim aria-hidden=true></div>
        <form id=form method=dialog role=none>
          <mdw-container id=container role=none>
            <slot id=body></slot>
          </mdw-container>
        </form>
      </dialog>
    `,
  ];

  constructor() {
    super();
    /** @type {HTMLDialogElement} */
    this.dialogElement = this.shadowRoot.getElementById('dialog');
    this.scrimElement = this.shadowRoot.getElementById('scrim');
    /** @type {MDWContainer} */
    this.containerElement = this.shadowRoot.getElementById('container');
    this.bodyElement = this.shadowRoot.getElementById('body');
    this.bodyElement.addEventListener('slotchange', MDWMenu.onSlotChanged, { passive: true });
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'open':
        // HTMLDialogElement Spec states attribute manipulation does not invoke events
        if (newValue == null) {
          this.dialogElement.setAttribute('aria-hidden', 'true');
        } else {
          this.dialogElement.setAttribute('aria-hidden', 'false');
        }
        break;
      default:
    }
  }

  /**
   * @return {boolean} handled
   */
  close() {
    if (!this.open) return false;
    if (this.isNativeModal) {
      this.isNativeModal = false;
    } else {
      const main = document.querySelector('main');
      if (main) {
        main.removeAttribute('aria-hidden');
      }
    }
    // if (this.dialogElement.getAttribute('aria-hidden') === 'true') return false;
    if (MDWMenu.supportsHTMLDialogElement && this.dialogElement.open) {
    // Force close native dialog
      this.dialogElement.close();
    }

    // Will invoke observed attribute change: ('aria-hidden', 'true');

    this.open = false;
    this.dispatchEvent(new Event('close'));

    let stackIndex = -1;
    MDWMenu.OPEN_MENUS.some((stack, index) => {
      if (stack.element === this) {
        stackIndex = index;
        return true;
      }
      return false;
    });
    if (stackIndex !== -1) {
      const stack = MDWMenu.OPEN_MENUS[stackIndex];
      if (stack.previousFocus && stack.previousFocus instanceof HTMLElement) {
        stack.previousFocus.focus();
      }
      MDWMenu.OPEN_MENUS.splice(stackIndex, 1);
      if (stack.state && window.history && window.history.state // IE11 returns a cloned state object, not the original
      && stack.state.hash === window.history.state.hash) {
        window.history.back();
      }
    }
    if (!MDWMenu.OPEN_MENUS.length) {
      window.removeEventListener('popstate', MDWMenu.onPopState);
      window.removeEventListener('resize', MDWMenu.onWindowResize);
    }
    return true;
  }

  // for (const el of menuElement.getElementsByClassName('mdw-divider')) {
  //   el.setAttribute('role', 'separator');
  // }

  /** @return {NodeListOf<MDWMenuItem>} */
  get childMenuItems() {
    return this.querySelectorAll(MDWMenuItem.elementName);
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChanged(event) {
    /** @type {{host:MDWMenu}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    RovingTabIndex.setupTabIndexes(host.childMenuItems, true);
  }

  /**
   * @param {Event} event
   * @this {MDWMenu}
   * @return {void}
   */
  static onMenuScroll(event) {
  // JS needed for Safari
    if (event.target === event.currentTarget) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.type !== 'scroll') {
      return;
    }
    const element = /** @type {HTMLElement} */ (event.currentTarget);
    if (element.scrollTop !== 0) {
      element.scrollTop = 0;
    }
    if (element.scrollLeft !== 0) {
      element.scrollLeft = 0;
    }
  }

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {MDWMenu}
   * @return {void}
   */
  static onMenuClick(event) {
    if (this !== event.target) return;
    // Clicked self (scrim-like)
    event.stopPropagation();
    this.close();
  }

  /**
   * @param {MouseEvent|PointerEvent|HTMLElement} source
   * @return {void}
   */
  updateMenuPosition(source) {
    console.log('updateMenuPosition', source);
    let top = 'auto';
    let left = 'auto';
    let transformOrigin = '';
    const event = source instanceof HTMLElement ? null : source;
    const margin = event ? '0' : '';
    const mdwPosition = this.position || '';
    const mdwDirection = this.direction || '';
    let alignTop = mdwPosition.includes('top');
    let alignBottom = mdwPosition.includes('bottom');
    let alignVCenter = mdwPosition.includes('vcenter');

    const alignStart = mdwPosition.includes('start');
    const alignEnd = mdwPosition.includes('end');
    let alignLeft = mdwPosition.includes('left');
    let alignRight = mdwPosition.includes('right');
    let alignHCenter = mdwPosition.includes('hcenter');

    let openUp = mdwDirection.includes('up');
    let openDown = mdwDirection.includes('down');
    const openNormal = mdwDirection.includes('normal');
    const openReverse = mdwDirection.includes('reverse');
    let openVCenter = mdwDirection.includes('vcenter');
    let openHCenter = mdwDirection.includes('hcenter');
    let openLtr = mdwDirection.includes('ltr');
    let openRtl = mdwDirection.includes('rtl');

    /** @type {HTMLElement} */
    const target = event ? event.currentTarget || event.target : source;

    let isPageRTL = null;
    if (alignStart || alignEnd || openNormal || openReverse) {
    // Using page-direction based values
      isPageRTL = (getComputedStyle(this).direction === 'rtl');
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
    const offsetTop = event ? -event.offsetY : 0;
    const offsetBottom = event ? event.offsetY : target.clientHeight;
    const offsetLeft = event ? -event.offsetX : 0;
    const offsetRight = event ? event.offsetX : target.clientWidth;
    const rect = target.getBoundingClientRect();
    const pageX = rect.left;
    const pageY = rect.top;

    /* Automatic Positioning
    *
    * Positions:
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
    * Directions:
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

    const popupElement = this.containerElement;
    popupElement.style.setProperty('max-height', 'none');
    popupElement.style.setProperty('width', 'auto');
    const newSize = Math.ceil(popupElement.clientWidth / 56);
    popupElement.style.removeProperty('width');
    popupElement.style.setProperty('--mdw-menu__size', newSize);
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
    }).filter((value) => value !== 0);
    if (candidates.length) {
      let candidateNumber;
      if (isPageRTL === null) {
        isPageRTL = (getComputedStyle(target).direction === 'rtl');
      }
      if (isPageRTL) {
        candidateNumber = [2, 1, 4, 3, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 15]
          .find((number) => candidates.includes(number));
      } else {
        candidateNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
          .find((number) => candidates.includes(number));
      }
      if (candidateNumber == null) {
        candidateNumber = isPageRTL ? 2 : 1;
      }
      switch (candidateNumber) {
      // Position
        default:
        case 1: case 8: case 11:
          alignBottom = true; alignLeft = true;
          break;
        case 2: case 7: case 12:
          alignBottom = true; alignRight = true;
          break;
        case 3: case 6: case 9:
          alignTop = true; alignLeft = true;
          break;
        case 4: case 5: case 10:
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
        case 1: case 5: case 9:
          openDown = true; openLtr = true;
          break;
        case 2: case 6: case 10:
          openDown = true; openRtl = true;
          break;
        case 3: case 7: case 11:
          openUp = true; openLtr = true;
          break;
        case 4: case 8: case 12:
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
    // Keeps on screen when resizing with showModal
    popupElement.scrollIntoView();
  }

  /**
   * @return {void}
   */
  static onWindowResize() {
    console.log('onWindowResize');
    const lastOpenMenu = MDWMenu.OPEN_MENUS.at(-1);
    if (!lastOpenMenu || !lastOpenMenu.originalEvent) {
      return;
    }
    if (lastOpenMenu.pendingResizeOperation) {
      cancelAnimationFrame(lastOpenMenu.pendingResizeOperation);
    }
    lastOpenMenu.pendingResizeOperation = requestAnimationFrame(() => {
      lastOpenMenu.element.updateMenuPosition(lastOpenMenu.originalEvent);
      lastOpenMenu.pendingResizeOperation = null;
    });
  }

  /**
   * @param {PopStateEvent} event
   * @return {void}
   */
  static onPopState(event) {
    if (!event.state) return;
    const lastOpenMenu = MDWMenu.OPEN_MENUS.at(-1);
    if (!lastOpenMenu || !lastOpenMenu.previousState) {
      return;
    }
    if ((lastOpenMenu.previousState === event.state) || Object.keys(event.state)
      .every((key) => event.state[key] === lastOpenMenu.previousState[key])) {
      lastOpenMenu.element.close();
    }
  }

  /**
   * @param {boolean} [backwards=false]
   * @return {void}
   */
  selectNextMenuItem(backwards) {
    const menuItems = this.childMenuItems;
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
    for (const el of menuItems) {
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
        continue;
      }
      if (backwards) {
        if (focusable) {
          candidate = el;
        }
        continue;
      }
      if (foundTarget) {
        if (focusable) {
          candidate = el;
          break;
        }
        continue;
      }
    }
    if (!candidate) {
      candidate = backwards ? lastFocusableElement : firstFocusableItem;
    }
    if (candidate && document.activeElement !== candidate) {
      candidate.focus();
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @this {MDWMenu}
   * @return {void}
   */
  static onMenuKeyDown(event) {
    if (!this || !this.open || this.getAttribute('aria-hidden') === 'true') {
      return;
    }

    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      event.stopPropagation();
      event.preventDefault();
      this.ariaActiveDescendantElement = RovingTabIndex.selectNext(this.childMenuItems);
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      event.stopPropagation();
      event.preventDefault();
      this.ariaActiveDescendantElement = RovingTabIndex.selectPrevious(this.childMenuItems);
      return;
    }
    if (event.key === 'Tab') {
    // Hide menu allowing focus to revert to calling element
    // To then allow browser default Tab interaction
    // Unless menu hiding is cancelled
      if (!this.close()) {
        event.stopPropagation();
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.stopPropagation();
      event.preventDefault();
      this.close();
    }
  }

  
  /**
   * @param {Event} event
   * @this {MDWMenu}
   * @return {void}
   */
   static onTabIndexZeroed(event) {
    event.stopPropagation();
    const currentItem = /** @type {HTMLElement} */ (event.target);
    RovingTabIndex.removeTabIndex(this.childMenuItems, [currentItem]);
  }

  connectedCallback() {
    this.addEventListener('click', MDWMenu.onMenuClick);
    this.addEventListener('scroll', MDWMenu.onMenuScroll);
    this.addEventListener('touchmove', MDWMenu.onMenuScroll);
    this.addEventListener('wheel', MDWMenu.onMenuScroll);
    this.addEventListener('keydown', MDWMenu.onMenuKeyDown);
    this.addEventListener(RovingTabIndex.TABINDEX_ZEROED, MDWMenu.onTabIndexZeroed);
  }

  /**
   * @param {MouseEvent|PointerEvent|HTMLElement} [source]
   * @return {boolean} handled
   */
  showModal(source) {
    if (this.open) return false;
    if (MDWMenu.supportsHTMLDialogElement) {
      console.log('showing modal');
      this.dialogElement.showModal();
      console.log('modal shown?');
      this.isNativeModal = true;
    }
    return this.show(source);
  }

  /**
   * @param {MouseEvent|PointerEvent|HTMLElement} [source]
   * @return {boolean} handled
   */
  show(source) {
    if (this.open) return false;
    this.open = true;

    if (source) {
      this.updateMenuPosition(source);
    } else {
      const popupElement = this.containerElement;
      popupElement.style.removeProperty('inset');
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
    if (MDWMenu.supportsHTMLDialogElement && !this.dialogElement.open) {
      this.dialogElement.show();
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('aria-hidden', 'true');
      }
    }

    const previousFocus = document.activeElement;
    const newState = { hash: Math.random().toString(36).slice(2, 18) };
    let previousState = null;
    if (window.history && window.history.pushState) {
      if (!window.history.state) {
        // Create new previous state
        window.history.replaceState({
          hash: Math.random().toString(36).slice(2, 18),
        }, document.title);
      }
      previousState = window.history.state;
      window.history.pushState(newState, document.title);
      window.addEventListener('popstate', MDWMenu.onPopState);
      window.addEventListener('resize', MDWMenu.onWindowResize);
    }
    /** @type {MenuStack} */
    const menuStack = { element: this, previousFocus, state: newState, previousState, originalEvent: source };
    MDWMenu.OPEN_MENUS.push(menuStack);
    // this.refreshMenuItems();

    const [firstItem] = this.childMenuItems;
    try {
      firstItem.focus();
      if (firstItem !== document.activeElement) {
        throw new Error('focus failed');
      }
    } catch {
      RovingTabIndex.selectNext(this.childMenuItems, firstItem);
    }

    return true;
  }
}