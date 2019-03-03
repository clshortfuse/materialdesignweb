import { iterateArrayLike, getPassiveEventListenerOption } from '../common/dom';
import Throttler from '../../utils/throttler';

const MIN_SCROLL_DELTA = 24; // Avoid finger bounce

// Throttler will execute at earliest convenience
// Smoother than using requestAnimationFrame
const SCROLL_THROTTLE_TIME_MS = 20;

let lastScrollY = null;
let penultimateScrollY = null;
let isAppBarHidden = false;
let appBarElement = null;
let appContentElement = null;
let scrollThrottler = null;

export default class App {
  static attach() {
    if (document.documentElement.hasAttribute('mdw-appbar-autoprominent')
      || document.documentElement.hasAttribute('mdw-appbar-autoraise')
      || document.documentElement.hasAttribute('mdw-appbar-autohide')) {
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
    }
  }

  /** @return {Throttler} */
  static getScrollThrottler() {
    if (!scrollThrottler) {
      scrollThrottler = new Throttler(SCROLL_THROTTLE_TIME_MS);
    }
    return scrollThrottler;
  }

  static onScrimClick() {
    if (document.documentElement.hasAttribute('mdw-navdrawer-show')) {
      if (window.innerWidth < 840 || document.documentElement.getAttribute('mdw-navdrawer-style') === 'modal') {
        App.hideNavDrawer();
      }
    }
    if (document.documentElement.hasAttribute('mdw-sidesheet-show')) {
      if (window.innerWidth < 840 || document.documentElement.getAttribute('mdw-sidesheet-style') === 'modal') {
        App.hideSideSheet();
      }
    }
  }

  static showNavDrawer() {
    document.documentElement.setAttribute('mdw-navdrawer-show', '');
  }

  static hideNavDrawer() {
    document.documentElement.removeAttribute('mdw-navdrawer-show');
  }

  static toggleNavDrawer() {
    if (document.documentElement.hasAttribute('mdw-navdrawer-show')) {
      App.hideNavDrawer();
    } else {
      App.showNavDrawer();
    }
  }

  static showSideSheet() {
    document.documentElement.setAttribute('mdw-sidesheet-show', '');
  }

  static hideSideSheet() {
    document.documentElement.removeAttribute('mdw-sidesheet-show');
  }

  static toggleSideSheet() {
    if (document.documentElement.hasAttribute('mdw-sidesheet-show')) {
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
  }

  static onDocumentScroll() {
    // position:sticky scrolling
    App.getScrollThrottler().run(() => App.onScroll(true));
  }

  static isMobile() {
    const { height, width } = window.screen;
    if (height >= width) {
      return width < 600;
    }
    return height < 960;
  }

  static isTablet() {
    const { height, width } = window.screen;
    if (height >= width) {
      return window.innerWidth >= 600 && width < 960;
    }
    return window.innerWidth >= 960 && width < 1440;
  }

  static shouldAutoHide() {
    const autoHide = document.documentElement.getAttribute('mdw-appbar-autohide');
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

  static getContentElement() {
    if (!appContentElement) {
      appContentElement = document.getElementsByClassName('mdw-app__content')[0];
    }
    return appContentElement;
  }

  static resetScroll() {
    document.documentElement.removeAttribute('mdw-appbar-hide');
    document.documentElement.removeAttribute('mdw-scrolltop');
    document.documentElement.removeAttribute('mdw-scrollbottom');
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
    if (change < 0) {
      // Scrolled up
      let appBar;
      let autoRaise = null;
      if (currentScrollY <= 0) {
        // Scrolled to top
        autoRaise = document.documentElement.hasAttribute('mdw-appbar-autoraise');
        if (autoRaise) {
          document.documentElement.setAttribute('mdw-scrolltop', '');
        }
        if (document.documentElement.hasAttribute('mdw-appbar-autoprominent')) {
          appBar = App.getAppBarElement();
          const toolbar = appBar.getElementsByClassName('mdw-toolbar')[0];
          if (toolbar) {
            toolbar.setAttribute('mdw-prominent', '');
          }
        }
      }
      if (lastScrollY >= penultimateScrollY) {
        // Did not scroll up before
        document.documentElement.removeAttribute('mdw-appbar-hide');
        if (autoRaise == null) {
          autoRaise = document.documentElement.hasAttribute('mdw-appbar-autoraise');
        }
        if (autoRaise) {
          document.documentElement.removeAttribute('mdw-scrollbottom');
        }
        isAppBarHidden = false;
        if ((!isDocument) && App.shouldAutoHide()) {
          appBar = appBar || App.getAppBarElement();
          appBar.style.removeProperty('margin-top');
        }
      }
    } else if (change > 0) {
      let autoRaise = null;
      // Scrolled down
      if (lastScrollY <= penultimateScrollY) {
        // Did not scroll down before
        autoRaise = document.documentElement.hasAttribute('mdw-appbar-autoraise');
        if (autoRaise) {
          document.documentElement.removeAttribute('mdw-scrolltop');
        }
      }
      if (currentScrollY >= scrollContentBottom) {
        if (autoRaise == null) {
          autoRaise = document.documentElement.hasAttribute('mdw-appbar-autoraise');
        }
        if (autoRaise) {
          document.documentElement.setAttribute('mdw-scrollbottom', '');
        }
      }
      if (!isAppBarHidden) {
        const hasAutoProminent = document.documentElement.hasAttribute('mdw-appbar-autoprominent');
        const autoHide = App.shouldAutoHide();
        if (hasAutoProminent || autoHide) {
          const appBar = App.getAppBarElement();
          if (currentScrollY > appBar.clientHeight) {
            isAppBarHidden = true;
            document.documentElement.setAttribute('mdw-appbar-hide', '');
            if (autoHide && (!isDocument)) {
              appBar.style.setProperty('margin-top', `${-appBar.clientHeight}px`);
            }
            if (hasAutoProminent) {
              const toolbar = appBar.getElementsByClassName('mdw-toolbar')[0];
              if (toolbar) {
                toolbar.removeAttribute('mdw-prominent');
              }
            }
          }
        }
      }
    }
    penultimateScrollY = lastScrollY;
    lastScrollY = currentScrollY;
  }
}
