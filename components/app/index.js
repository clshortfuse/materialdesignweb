import { nextTick, cancelTick, iterateArrayLike } from '../common/dom';

const MIN_SCROLL_DELTA = 24; // Avoid finger bounce
let lastScrollY = null;
let penultimateScrollY = null;
let isAppBarHidden = false;
let currentScheduledTick = null;

export default class App {
  static attach() {
    const appBar = App.getAppBarElement();
    if (appBar) {
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

  static onContentScrollThrottler() {
    if (currentScheduledTick) {
      cancelTick(currentScheduledTick);
    }
    currentScheduledTick = nextTick(() => App.onScroll(false));
  }

  static getAppBarElement() {
    if (App.appBarElement) {
      return App.appBarElement;
    }
    App.appBarElement = document.getElementsByClassName('mdw-app__appbar')[0];
    return App.appBarElement;
  }

  static getContentElement() {
    if (App.contentElement) {
      return App.contentElement;
    }
    App.contentElement = document.getElementsByClassName('mdw-app__content')[0];
    return App.contentElement;
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
      if (currentScrollY <= 0) {
        // Scrolled to top
        document.documentElement.setAttribute('mdw-scrolltop', '');
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
        document.documentElement.removeAttribute('mdw-scrolldown');
        document.documentElement.removeAttribute('mdw-appbar-hide');
        document.documentElement.removeAttribute('mdw-scrollbottom');
        isAppBarHidden = false;
        if ((!isDocument) && App.shouldAutoHide()) {
          appBar = appBar || App.getAppBarElement();
          appBar.style.removeProperty('margin-top');
        }
      }
    } else if (change > 0) {
      // Scrolled down
      if (lastScrollY <= penultimateScrollY) {
        // Did not scroll down before
        document.documentElement.setAttribute('mdw-scrolldown', '');
        document.documentElement.removeAttribute('mdw-scrolltop');
      }
      console.log(currentScrollY, scrollElement.scrollHeight, scrollElement.clientHeight, scrollElement.offsetHeight);
      if (currentScrollY >= scrollElement.scrollHeight - scrollElement.clientHeight) {
        document.documentElement.setAttribute('mdw-scrollbottom', '');
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
