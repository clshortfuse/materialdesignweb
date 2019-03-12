
import { iterateArrayLike, getPassiveEventListenerOption } from '../common/dom';
import Throttler from '../../utils/throttler';

const MIN_SCROLL_DELTA = 24; // Avoid finger bounce

const EIGHT_COLUMN_BREAKPOINT = 600;
const TWELVE_COLUMN_BREAKPOINT = 840;

// Throttler will execute at earliest convenience
// Smoother than using requestAnimationFrame
const SCROLL_THROTTLE_TIME_MS = 20;

let lastScrollY = null;
let penultimateScrollY = null;
let scrolledPastAppBar = false;
let appBarElement = null;
let appContentElement = null;
let scrollThrottler = null;

export default class App {
  static attach() {
    const appBar = App.getAppBarElement();
    if (appBar) {
      // Initialize with scroll up
      document.addEventListener('scroll', App.onDocumentScroll, getPassiveEventListenerOption());
      const contentElement = App.getContentElement();
      if (contentElement) {
        contentElement.addEventListener('scroll', App.onContentScroll, getPassiveEventListenerOption());
      }
      App.resetScroll();
    }

    iterateArrayLike(document.getElementsByClassName('mdw-app__navdrawer-toggle'),
      el => el.addEventListener('click', App.toggleNavDrawer));
    iterateArrayLike(document.getElementsByClassName('mdw-app__navdrawer-show'),
      el => el.addEventListener('click', App.showNavDrawer));
    iterateArrayLike(document.getElementsByClassName('mdw-app__navdrawer-hide'),
      el => el.addEventListener('click', App.hideNavDrawer));
    iterateArrayLike(document.getElementsByClassName('mdw-app__sidesheet-toggle'),
      el => el.addEventListener('click', App.toggleSideSheet));
    iterateArrayLike(document.getElementsByClassName('mdw-app__sidesheet-show'),
      el => el.addEventListener('click', App.showSideSheet));
    iterateArrayLike(document.getElementsByClassName('mdw-app__sidesheet-hide'),
      el => el.addEventListener('click', App.hideSideSheet));
    const scrim = document.getElementsByClassName('mdw-app__scrim')[0];
    if (scrim) {
      scrim.addEventListener('click', App.onScrimClick);
      scrim.addEventListener('scroll', App.onScrimScroll);
      scrim.addEventListener('touchmove', App.onScrimScroll);
      scrim.addEventListener('wheel', App.onScrimScroll);
    }
  }

  /** @return {Throttler} */
  static getScrollThrottler() {
    if (!scrollThrottler) {
      scrollThrottler = new Throttler(SCROLL_THROTTLE_TIME_MS);
    }
    return scrollThrottler;
  }

  static onScrimScroll(event) {
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

  static onScrimClick() {
    const navdrawer = document.getElementsByClassName('mdw-app__navdrawer')[0];
    if (navdrawer && navdrawer.getAttribute('aria-hidden') === 'false') {
      if (window.innerWidth < 840 || document.documentElement.getAttribute('mdw-navdrawer-style') === 'modal') {
        App.hideNavDrawer();
      }
    }
    const sidesheet = document.getElementsByClassName('mdw-app__sidesheet')[0];
    if (sidesheet && sidesheet.getAttribute('aria-hidden') === 'false') {
      if (window.innerWidth < 840 || document.documentElement.getAttribute('mdw-sidesheet-style') === 'modal') {
        App.hideSideSheet();
      }
    }
  }

  static showNavDrawer() {
    document.getElementsByClassName('mdw-app__navdrawer')[0].setAttribute('aria-hidden', 'false');
  }

  static hideNavDrawer() {
    document.getElementsByClassName('mdw-app__navdrawer')[0].setAttribute('aria-hidden', 'true');
  }

  static toggleNavDrawer() {
    if (document.getElementsByClassName('mdw-app__navdrawer')[0].getAttribute('aria-hidden') === 'false') {
      App.hideNavDrawer();
    } else {
      App.showNavDrawer();
    }
  }

  static showSideSheet() {
    document.getElementsByClassName('mdw-app__sidesheet')[0].setAttribute('aria-hidden', 'false');
  }

  static hideSideSheet() {
    document.getElementsByClassName('mdw-app__sidesheet')[0].setAttribute('aria-hidden', 'true');
  }

  static toggleSideSheet() {
    if (document.getElementsByClassName('mdw-app__sidesheet')[0].getAttribute('aria-hidden') === 'false') {
      App.hideSideSheet();
    } else {
      App.showSideSheet();
    }
  }

  static detach() {
    document.removeEventListener('scroll', App.onDocumentScroll);
    const content = App.getContentElement();
    if (content) {
      content.removeEventListener('scroll', App.onContentScroll);
    }
    const scrim = document.getElementsByClassName('mdw-app__scrim')[0];
    if (scrim) {
      scrim.removeEventListener('click', App.onScrimClick);
      scrim.removeEventListener('scroll', App.onScrimScroll);
      scrim.removeEventListener('touchmove', App.onScrimScroll);
      scrim.removeEventListener('wheel', App.onScrimScroll);
    }
  }

  static onDocumentScroll() {
    // position:sticky scrolling
    App.getScrollThrottler().run(() => App.onScroll(true));
  }

  static isMobile() {
    return window.innerWidth < EIGHT_COLUMN_BREAKPOINT;
  }

  static isTablet() {
    return window.innerWidth >= EIGHT_COLUMN_BREAKPOINT
      && window.innerWidth < TWELVE_COLUMN_BREAKPOINT;
  }

  static shouldAutoHideAppBar() {
    const appBar = App.getAppBarElement();
    if (!appBar) {
      return false;
    }
    const autoHide = appBar.getAttribute('mdw-autohide');
    if (autoHide == null) {
      return false;
    }
    if (autoHide === '') {
      return true;
    }
    if (autoHide.indexOf('tablet') !== -1 && App.isTablet()) {
      return true;
    }
    if (autoHide.indexOf('mobile') !== -1 && App.isMobile()) {
      return true;
    }
    return false;
  }

  static onContentScroll() {
    App.getScrollThrottler().run(() => App.onScroll(false));
  }

  static getAppBarElement() {
    if (!appBarElement) {
      appBarElement = document.getElementsByClassName('mdw-app__appbar')[0];
    }
    return appBarElement;
  }

  /**
   * @param {boolean} [changeFabCut=true]
   * @return {void}
   */
  static showFab(changeFabCut) {
    const fabElement = document.getElementsByClassName('mdw-app__fab')[0];
    if (!fabElement) {
      return;
    }
    fabElement.setAttribute('aria-hidden', 'false');
    if (changeFabCut !== false) {
      App.openAppBarFabCut();
    }
  }

  static openAppBarFabCut() {
    const appBar = App.getAppBarElement();
    if (!appBar) {
      return;
    }
    const fabCutAttr = appBar.getAttribute('mdw-fab-cut');
    if (fabCutAttr == null) {
      return;
    }
    if (fabCutAttr.indexOf('open') === -1) {
      appBar.setAttribute('mdw-fab-cut', `open ${fabCutAttr}`.trim());
    }
  }

  static closeAppBarFabCut() {
    const appBar = App.getAppBarElement();
    if (!appBar) {
      return;
    }
    const fabCutAttr = appBar.getAttribute('mdw-fab-cut');
    if (!fabCutAttr) {
      return;
    }
    if (fabCutAttr.indexOf('open') !== -1) {
      appBar.setAttribute('mdw-fab-cut', fabCutAttr.replace('open', '').trim());
    }
  }

  /**
   * @param {boolean} [changeFabCut=true]
   * @return {void}
   */
  static hideFab(changeFabCut) {
    const fabElement = document.getElementsByClassName('mdw-app__fab')[0];
    if (!fabElement) {
      return;
    }
    fabElement.setAttribute('aria-hidden', 'true');
    if (changeFabCut !== false) {
      App.closeAppBarFabCut();
    }
  }

  static isFabShown() {
    const fabElement = document.getElementsByClassName('mdw-app__fab')[0];
    if (!fabElement) {
      return false;
    }
    return fabElement.getAttribute('aria-hidden') !== 'true';
  }

  static getContentElement() {
    if (!appContentElement) {
      appContentElement = document.getElementsByClassName('mdw-app__content')[0];
    }
    return appContentElement;
  }

  static resetScroll() {
    const appBar = App.getAppBarElement();
    if (appBar) {
      appBar.removeAttribute('mdw-hide');
      appBar.removeAttribute('mdw-raise');
    }
    scrolledPastAppBar = false;
    lastScrollY = 0 + MIN_SCROLL_DELTA;
    penultimateScrollY = lastScrollY;
    App.onScroll(true);
  }

  /**
   * @param {boolean} isDocument
   * @return {void}
   */
  static onScroll(isDocument) {
    const contentElement = App.getContentElement();
    if (isDocument && contentElement.scrollHeight !== contentElement.clientHeight) {
      // Ignore overscroll on contentElement
      return;
    }
    const scrollElement = isDocument ? document.documentElement : contentElement;
    const currentScrollY = scrollElement.scrollTop;
    const change = currentScrollY - lastScrollY;
    const delta = Math.abs(change);

    const scrollContentBottom = scrollElement.scrollHeight - scrollElement.clientHeight;
    const scrollTopChange = currentScrollY <= 0
      || lastScrollY <= 0;
    const scrollBottomChange = currentScrollY >= scrollContentBottom
      || lastScrollY >= scrollContentBottom;
    if (delta < MIN_SCROLL_DELTA && !scrollTopChange && !scrollBottomChange) {
      return;
    }

    const didScrollUp = (change < 0);
    const isAtScrollTop = didScrollUp && currentScrollY <= 0;
    const newScrollUp = didScrollUp && lastScrollY >= penultimateScrollY;
    const didScrollDown = (change > 0);
    const isAtScrollBottom = didScrollDown && (currentScrollY >= scrollContentBottom);
    const newScrollDown = didScrollDown && lastScrollY <= penultimateScrollY;

    penultimateScrollY = lastScrollY;
    lastScrollY = currentScrollY;

    // To avoid DOM read, abort if scrolling in same direction and has already past app bar
    if ((change === 0) || (!isAtScrollTop && !newScrollUp && !isAtScrollBottom && !newScrollDown
      && scrolledPastAppBar)) {
      return;
    }

    const appBar = App.getAppBarElement();
    if (!appBar) {
      return;
    }

    const bottomAppBar = appBar.hasAttribute('mdw-bottom');

    const scrolledAway = bottomAppBar ? didScrollUp : didScrollDown;
    const newScrollAway = scrolledAway && (bottomAppBar ? newScrollUp : newScrollDown);

    // For code readability
    const scrolledBack = !scrolledAway; // For code readability
    const newScrollBack = scrolledBack && (bottomAppBar ? newScrollDown : newScrollUp);

    const isAtRest = (bottomAppBar ? isAtScrollBottom : isAtScrollTop);

    if (scrolledBack) {
      // scrolledPastAppBar needs to be recalculated
      scrolledPastAppBar = false;
    }

    // Don't perform on each scroll back, only on first
    if (newScrollBack) {
      if (appBar.hasAttribute('mdw-autohide')) {
        appBar.removeAttribute('mdw-hide');
        appBar.style.removeProperty('margin-top');
      }
    }

    if (!scrolledPastAppBar) {
      if (bottomAppBar) {
        scrolledPastAppBar = currentScrollY <= scrollContentBottom - appBar.clientHeight;
      } else {
        scrolledPastAppBar = currentScrollY > appBar.clientHeight;
      }
    }

    if (isAtRest) {
      if (appBar.hasAttribute('mdw-autoprominent')) {
        const toolbar = appBar.getElementsByClassName('mdw-toolbar')[0];
        if (toolbar) {
          toolbar.setAttribute('mdw-prominent', '');
        }
      }
      if (appBar.hasAttribute('mdw-autoraise')) {
        appBar.removeAttribute('mdw-raise');
      }
      return;
    }

    // Not at rest
    if (scrolledAway && scrolledPastAppBar) {
      if (App.shouldAutoHideAppBar()) {
        appBar.setAttribute('mdw-hide', '');
        if (!isDocument) {
          appBar.style.setProperty('margin-top', `${-appBar.clientHeight}px`);
        }
      }
      if (appBar.hasAttribute('mdw-autoprominent')) {
        const toolbar = appBar.getElementsByClassName('mdw-toolbar')[0];
        if (toolbar) {
          toolbar.removeAttribute('mdw-prominent');
        }
      }
    }

    if (newScrollAway) {
      if (appBar.hasAttribute('mdw-autoraise')) {
        appBar.setAttribute('mdw-raise', '');
      }
    }
  }
}
