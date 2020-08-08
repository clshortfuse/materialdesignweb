/** @return {void} */
export function detectStandalone() {
  // @ts-ignore: Safari uses navigator.standalone
  if (navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
    document.documentElement.setAttribute('mdw-standalone', '');
  }
}

/** @return {void} */
export function detectUserAgent() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone/.test(ua) || /ipad/.test(ua)) {
    document.documentElement.setAttribute('mdw-ios', '');
  }
}

/** @return {void} */
export function detectColorScheme() {
  // Auto lightness and fill
  if (!document.documentElement.hasAttribute('mdw-surface')
    && !document.documentElement.hasAttribute('mdw-light')
    && !document.documentElement.hasAttribute('mdw-dark')) {
    if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
      document.documentElement.setAttribute('mdw-dark', '');
    } else {
      document.documentElement.setAttribute('mdw-light', '');
    }
  }
}

/**
 * Run before document has loaded
 * @return {void}
 */
export function onPrerender() {
  detectStandalone();
  detectUserAgent();
  detectColorScheme();
}
