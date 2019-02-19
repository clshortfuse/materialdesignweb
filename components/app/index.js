import { nextTick, cancelTick, iterateArrayLike } from '../common/dom';

const MIN_SCROLL_DELTA = 24; // Avoid finger bounce
let lastScrollY = null;
let penultimateScrollY = null;
let isTopHidden = false;
let currentScheduledTick = null;

export default class App {
  static attach() {
    const appTop = App.getAppTop();
    if (appTop) {
      // Initialize with scroll up
      lastScrollY = 0 + MIN_SCROLL_DELTA;
      penultimateScrollY = lastScrollY;
      document.addEventListener('scroll', App.onDocumentScrollThrottler);
      const content = document.getElementsByClassName('mdw-app__content')[0];
      if (content) {
        content.addEventListener('scroll', App.onContentScrollThrottler);
      }
      App.onDocumentScrollThrottler();
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

  static onScrimClick() {
    if (document.documentElement.hasAttribute('mdw-navdrawer-show')) {
      if (window.innerWidth < 600 || document.documentElement.getAttribute('mdw-navdrawer-style') === 'modal') {
        App.hideNavDrawer();
      }
    }
    if (document.documentElement.hasAttribute('mdw-sidesheet-show')) {
      if (window.innerWidth < 600 || document.documentElement.getAttribute('mdw-sidesheet-style') === 'modal') {
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
    document.removeEventListener('scroll', App.onDocumentScrollThrottler);
    const content = document.getElementsByClassName('mdw-app__content')[0];
    if (content) {
      content.removeEventListener('scroll', App.onContentScrollThrottler);
    }
  }

  static onDocumentScrollThrottler() {
    // position:sticky scrolling
    if (currentScheduledTick) {
      cancelTick(currentScheduledTick);
    }
    currentScheduledTick = nextTick(() => App.onScroll(true));
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
    const autoHide = document.documentElement.getAttribute('mdw-top-autohide');
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

  static onContentScrollThrottler() {
    if (currentScheduledTick) {
      cancelTick(currentScheduledTick);
    }
    currentScheduledTick = nextTick(() => App.onScroll(false));
  }

  static getAppTop() {
    return document.getElementsByClassName('mdw-app__top')[0];
  }

  /**
   * @param {boolean} isDocument
   * @return {void}
   */
  static onScroll(isDocument) {
    const currentScrollY = isDocument
      ? document.documentElement.scrollTop
      : document.getElementsByClassName('mdw-app__content')[0].scrollTop;
    const change = currentScrollY - lastScrollY;
    const delta = Math.abs(change);
    const scrollTopChange = currentScrollY <= 0 || lastScrollY <= 0;
    if (delta < MIN_SCROLL_DELTA && !scrollTopChange) {
      return;
    }
    if (change < 0) {
      // Scrolled up
      let appTop;
      if (currentScrollY <= 0) {
        document.documentElement.setAttribute('mdw-scrolltop', '');
        if (document.documentElement.hasAttribute('mdw-top-autoprominent')) {
          appTop = App.getAppTop();
          const toolbar = appTop.getElementsByClassName('mdw-toolbar')[0];
          if (toolbar) {
            toolbar.setAttribute('mdw-prominent', '');
          }
        }
      }
      if (lastScrollY >= penultimateScrollY) {
        document.documentElement.removeAttribute('mdw-scrolldown');
        document.documentElement.removeAttribute('mdw-top-hide');
        isTopHidden = false;
        if (!isDocument && App.shouldAutoHide()) {
          appTop = appTop || App.getAppTop();
          appTop.style.removeProperty('margin-top');
        }
      }
    } else if (change > 0) {
      // Scrolled down
      if (lastScrollY <= penultimateScrollY) {
        // Did not scroll down before
        document.documentElement.setAttribute('mdw-scrolldown', '');
        document.documentElement.removeAttribute('mdw-scrolltop');
      }
      if (!isTopHidden) {
        const hasAutoProminent = document.documentElement.hasAttribute('mdw-top-autoprominent');
        const autoHide = App.shouldAutoHide();
        if (hasAutoProminent || autoHide) {
          const appTop = App.getAppTop();
          if (currentScrollY > appTop.clientHeight) {
            isTopHidden = true;
            document.documentElement.setAttribute('mdw-top-hide', '');
            if (!isDocument && autoHide) {
              appTop.style.setProperty('margin-top', `${-appTop.clientHeight}px`);
            }
            if (hasAutoProminent) {
              const toolbar = appTop.getElementsByClassName('mdw-toolbar')[0];
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
