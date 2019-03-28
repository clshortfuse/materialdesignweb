import { iterateArrayLike, getPassiveEventListenerOption } from '../../core/dom';
import Throttler from '../../core/throttler';

const MIN_SCROLL_DELTA = 24; // Avoid finger bounce

const MOBILE_BREAKPOINT = 600;
const TABLET_BREAKPOINT = 1024;

// Throttler will execute at earliest convenience
// Smoother than using requestAnimationFrame
const SCROLL_THROTTLE_TIME_MS = 20;

let lastScrollY = null;
let penultimateScrollY = null;
let scrolledPastAppBar = false;
let appBarElement = null;
let layoutContentElement = null;
let lastScrollBottomDistance = null;
let scrollThrottler = null;

/** @return {void} */
export function attach() {
  const appBar = getAppBarElement();
  if (appBar) {
    // Initialize with scroll up
    document.body.addEventListener('scroll', onBodyScroll, getPassiveEventListenerOption());
    const contentElement = getContentElement();
    if (contentElement) {
      contentElement.addEventListener('scroll', onContentScroll, getPassiveEventListenerOption());
    }
    resetScroll();
  }

  iterateArrayLike(document.getElementsByClassName('mdw-layout__navdrawer-toggle'),
    el => el.addEventListener('click', toggleNavDrawer));
  iterateArrayLike(document.getElementsByClassName('mdw-layout__navdrawer-show'),
    el => el.addEventListener('click', showNavDrawer));
  iterateArrayLike(document.getElementsByClassName('mdw-layout__navdrawer-hide'),
    el => el.addEventListener('click', hideNavDrawer));
  iterateArrayLike(document.getElementsByClassName('mdw-layout__sidesheet-toggle'),
    el => el.addEventListener('click', toggleSideSheet));
  iterateArrayLike(document.getElementsByClassName('mdw-layout__sidesheet-show'),
    el => el.addEventListener('click', showSideSheet));
  iterateArrayLike(document.getElementsByClassName('mdw-layout__sidesheet-hide'),
    el => el.addEventListener('click', hideSideSheet));
  const scrim = document.getElementsByClassName('mdw-layout__scrim')[0];
  if (scrim) {
    scrim.addEventListener('click', onScrimClick);
    scrim.addEventListener('scroll', onScrimScroll);
    scrim.addEventListener('touchmove', onScrimScroll);
    scrim.addEventListener('wheel', onScrimScroll);
  }
}

/**
 * Run before document has loaded
 * @return {void}
 */
export function onPrerender() {
  if ('standalone' in navigator && navigator.standalone) {
    document.documentElement.setAttribute('mdw-standalone', '');
  }

  const ua = navigator.userAgent.toLowerCase();
  if (/iphone/.test(ua) || /ipad/.test(ua)) {
    document.documentElement.setAttribute('mdw-ios', '');
  }

  // Auto lightness and fill
  if (!document.documentElement.hasAttribute('mdw-surface')
    && !document.documentElement.hasAttribute('mdw-light')
    && !document.documentElement.hasAttribute('mdw-dark')) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('mdw-dark', '');
      document.documentElement.setAttribute('mdw-surface', 'black');
    } else {
      document.documentElement.setAttribute('mdw-light', '');
      document.documentElement.setAttribute('mdw-surface', 'white');
    }
  }
}

/** @return {Throttler} */
export function getScrollThrottler() {
  if (!scrollThrottler) {
    scrollThrottler = new Throttler(SCROLL_THROTTLE_TIME_MS);
  }
  return scrollThrottler;
}

/**
 * @param {Event} event
 * @return {void}
 */
export function onScrimScroll(event) {
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


/** @return {void} */
export function onScrimClick() {
  const navdrawer = document.getElementsByClassName('mdw-layout__navdrawer')[0];
  if (navdrawer && navdrawer.getAttribute('aria-hidden') === 'false') {
    if (window.innerWidth < TABLET_BREAKPOINT || document.body.getAttribute('mdw-navdrawer-style') === 'modal') {
      hideNavDrawer();
    }
  }
  const sidesheet = document.getElementsByClassName('mdw-layout__sidesheet')[0];
  if (sidesheet && sidesheet.getAttribute('aria-hidden') === 'false') {
    if (window.innerWidth < TABLET_BREAKPOINT || document.body.getAttribute('mdw-sidesheet-style') === 'modal') {
      hideSideSheet();
    }
  }
}

/** @return {void} */
export function showNavDrawer() {
  document.getElementsByClassName('mdw-layout__navdrawer')[0].setAttribute('aria-hidden', 'false');
}

/** @return {void} */
export function hideNavDrawer() {
  document.getElementsByClassName('mdw-layout__navdrawer')[0].setAttribute('aria-hidden', 'true');
}

/** @return {void} */
export function toggleNavDrawer() {
  if (document.getElementsByClassName('mdw-layout__navdrawer')[0].getAttribute('aria-hidden') === 'false') {
    hideNavDrawer();
  } else {
    showNavDrawer();
  }
}

/** @return {void} */
export function showSideSheet() {
  document.getElementsByClassName('mdw-layout__sidesheet')[0].setAttribute('aria-hidden', 'false');
}

/** @return {void} */
export function hideSideSheet() {
  document.getElementsByClassName('mdw-layout__sidesheet')[0].setAttribute('aria-hidden', 'true');
}

/** @return {void} */
export function toggleSideSheet() {
  if (document.getElementsByClassName('mdw-layout__sidesheet')[0].getAttribute('aria-hidden') === 'false') {
    hideSideSheet();
  } else {
    showSideSheet();
  }
}

/** @return {void} */
export function detach() {
  document.removeEventListener('scroll', onBodyScroll);
  const content = getContentElement();
  if (content) {
    content.removeEventListener('scroll', onContentScroll);
  }
  const scrim = document.getElementsByClassName('mdw-layout__scrim')[0];
  if (scrim) {
    scrim.removeEventListener('click', onScrimClick);
    scrim.removeEventListener('scroll', onScrimScroll);
    scrim.removeEventListener('touchmove', onScrimScroll);
    scrim.removeEventListener('wheel', onScrimScroll);
  }
}

/** @return {void} */
export function onBodyScroll() {
  // position:sticky scrolling
  getScrollThrottler().run(() => onScroll(true));
}

/** @return {boolean} */
export function isMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/** @return {boolean} */
export function isTablet() {
  return window.innerWidth >= MOBILE_BREAKPOINT
    && window.innerWidth < TABLET_BREAKPOINT;
}

/** @return {boolean} */
export function shouldAutoHideAppBar() {
  const appBar = getAppBarElement();
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
  if (autoHide.indexOf('tablet') !== -1 && isTablet()) {
    return true;
  }
  if (autoHide.indexOf('mobile') !== -1 && isMobile()) {
    return true;
  }
  return false;
}

/** @return {void} */
export function onContentScroll() {
  getScrollThrottler().run(() => onScroll(false));
}

/** @return {HTMLElement} */
export function getAppBarElement() {
  if (!appBarElement) {
    appBarElement = document.getElementsByClassName('mdw-layout__appbar')[0];
  }
  return appBarElement;
}

/**
 * @param {boolean} [changeFabCut=true]
 * @return {void}
 */
export function showFab(changeFabCut) {
  const fabElement = document.getElementsByClassName('mdw-layout__fab')[0];
  if (!fabElement) {
    return;
  }
  fabElement.setAttribute('aria-hidden', 'false');
  if (changeFabCut !== false) {
    openAppBarFabCut();
  }
}

/** @return {void} */
export function openAppBarFabCut() {
  const appBar = getAppBarElement();
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

/** @return {void} */
export function closeAppBarFabCut() {
  const appBar = getAppBarElement();
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
export function hideFab(changeFabCut) {
  const fabElement = document.getElementsByClassName('mdw-layout__fab')[0];
  if (!fabElement) {
    return;
  }
  fabElement.setAttribute('aria-hidden', 'true');
  if (changeFabCut !== false) {
    closeAppBarFabCut();
  }
}

/** @return {boolean} */
export function isFabShown() {
  const fabElement = document.getElementsByClassName('mdw-layout__fab')[0];
  if (!fabElement) {
    return false;
  }
  return fabElement.getAttribute('aria-hidden') !== 'true';
}

/** @return {HTMLElement} */
export function getContentElement() {
  if (!layoutContentElement) {
    layoutContentElement = document.getElementsByClassName('mdw-layout__content')[0];
  }
  return layoutContentElement;
}

/** @return {void} */
export function resetScroll() {
  const appBar = getAppBarElement();
  if (appBar) {
    appBar.removeAttribute('mdw-hide');
    appBar.removeAttribute('mdw-raise');
  }
  scrolledPastAppBar = false;
  lastScrollY = 0 + MIN_SCROLL_DELTA;
  penultimateScrollY = lastScrollY;
  onScroll(true);
}

/**
 * @param {boolean} isBody
 * @return {void}
 */
export function onScroll(isBody) {
  const contentElement = getContentElement();
  const scrollElement = isBody ? document.body : contentElement;
  const currentScrollY = scrollElement.scrollTop;
  const change = currentScrollY - lastScrollY;
  const delta = Math.abs(change);
  if (delta === 0) {
    // Horizontal scroll?
    return;
  }
  if (currentScrollY < 0 && lastScrollY <= 0) {
    // Repeated overscroll event
    return;
  }

  const scrollBottom = scrollElement.scrollHeight - scrollElement.clientHeight;
  const scrollBottomDistance = scrollBottom - currentScrollY;
  const scrollTopChange = currentScrollY <= 0
    || lastScrollY <= 0;
  const scrollBottomChange = scrollBottomDistance === 0 && lastScrollBottomDistance !== 0;

  lastScrollBottomDistance = scrollBottomDistance;
  if (delta < MIN_SCROLL_DELTA && !scrollTopChange && !scrollBottomChange) {
    return;
  }

  const didScrollUp = (scrollBottomDistance > 0) && (change < 0);
  const isAtScrollTop = didScrollUp && currentScrollY <= 0;
  const newScrollUp = didScrollUp && lastScrollY >= penultimateScrollY;
  const didScrollDown = (change > 0);
  const isAtScrollBottom = didScrollDown && (scrollBottomDistance <= 0);
  const newScrollDown = didScrollDown && lastScrollY <= penultimateScrollY;

  penultimateScrollY = lastScrollY;
  lastScrollY = currentScrollY;

  // To avoid DOM read, abort if scrolling in same direction and has already past app bar
  if ((change === 0) || (!isAtScrollTop && !newScrollUp && !isAtScrollBottom && !newScrollDown
    && scrolledPastAppBar)) {
    return;
  }

  const appBar = getAppBarElement();
  if (!appBar) {
    return;
  }

  const bottomAppBar = appBar.hasAttribute('mdw-bottom');

  const scrolledAway = bottomAppBar ? didScrollUp : didScrollDown;
  const newScrollAway = scrolledAway && (bottomAppBar ? newScrollUp : newScrollDown);

  // For code readability
  const scrolledBack = !scrolledAway;
  const newScrollBack = scrolledBack && (bottomAppBar ? newScrollDown : newScrollUp);

  const isAtRest = (bottomAppBar ? isAtScrollBottom : isAtScrollTop);

  if (scrolledBack) {
    // scrolledPastAppBar needs to be recalculated
    scrolledPastAppBar = false;
  }

  // Don't perform on each scroll back, only on first
  if (newScrollBack || isAtRest) {
    if (appBar.hasAttribute('mdw-autohide')) {
      appBar.removeAttribute('mdw-hide');
      appBar.style.removeProperty('margin-top');
    }
  }

  if (!scrolledPastAppBar) {
    if (bottomAppBar) {
      scrolledPastAppBar = currentScrollY <= scrollBottom - appBar.clientHeight;
    } else {
      scrolledPastAppBar = currentScrollY > appBar.clientHeight;
    }
  }

  if (isAtRest) {
    if (appBar.hasAttribute('mdw-autoprominent')) {
      appBar.setAttribute('mdw-prominent', '');
    }
    if (appBar.hasAttribute('mdw-autoraise')) {
      appBar.removeAttribute('mdw-raise');
    }
    return;
  }

  // Not at rest
  if (scrolledAway && scrolledPastAppBar) {
    if (shouldAutoHideAppBar()) {
      appBar.setAttribute('mdw-hide', '');
      if (!isBody) {
        appBar.style.setProperty('margin-top', `${-appBar.clientHeight}px`);
      }
    }
    if (appBar.hasAttribute('mdw-autoprominent')) {
      appBar.removeAttribute('mdw-prominent');
    }
  }

  if (newScrollAway) {
    if (appBar.hasAttribute('mdw-autoraise')) {
      appBar.setAttribute('mdw-raise', '');
    }
  }
}
