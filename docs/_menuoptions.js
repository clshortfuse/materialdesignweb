import { setStorageItem, removeStorageItem, getStorageItem } from './_storage';

/**
 * @param {boolean} value
 * @param {Element} [button]
 * @return {void}
 */
export function setRTLMode(value, button) {
  if (value) {
    document.documentElement.dir = 'rtl';
    setStorageItem('rtlmode', 'true');
  } else {
    // Explicit LTR is required for Safari to support repeated toggling
    document.documentElement.dir = 'ltr';
    removeStorageItem('rtlmode');
  }
  if (button) {
    button.setAttribute('aria-pressed', value ? 'true' : 'false');
  }
}

/** @return {boolean} */
export function isDarkMode() {
  const userPreference = getStorageItem('darkmode');
  if (userPreference == null) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return userPreference === 'true';
}

/**
 * @param {boolean} value
 * @param {Element} [button]
 * @return {void}
 */
export function setDarkMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('mdw-dark', '');
    document.documentElement.removeAttribute('mdw-light');
  } else {
    document.documentElement.setAttribute('mdw-light', '');
    document.documentElement.removeAttribute('mdw-dark');
  }
  const stringValue = (value ? 'true' : 'false');
  if (button) {
    button.setAttribute('aria-pressed', stringValue);
  }
  setStorageItem('darkmode', stringValue);
}

/**
 * @param {boolean} value
 * @param {Element} [button]
 * @return {void}
 */
export function setAltTheme(value, button) {
  const items = document.head.getElementsByTagName('link');
  for (let i = 0; i < items.length; i += 1) {
    const stylesheet = items.item(i);
    if (stylesheet.href.indexOf(value ? 'theme-colored' : 'theme-default') !== -1) {
      stylesheet.disabled = false;
    }
    if (stylesheet.href.indexOf(value ? 'theme-default' : 'theme-colored') !== -1) {
      stylesheet.disabled = true;
    }
  }

  const stringValue = (value ? 'true' : 'false');
  if (button) {
    button.setAttribute('aria-pressed', stringValue);
  }
  const statusBarAttribute = document.head.getElementsByTagName('meta').namedItem('theme-color');
  if (statusBarAttribute) {
    statusBarAttribute.setAttribute('content', value ? '#FF5722' : '#E91E63');
  }

  setStorageItem('alttheme', stringValue);
}

/**
 * @param {string} value
 * @param {Element} [button]
 * @return {void}
 */
export function setFontSize(value, button) {
  if (value) {
    document.documentElement.style.setProperty('font-size', value);
    setStorageItem('fontsize', value);
  } else {
    document.documentElement.style.removeProperty('font-size');
    removeStorageItem('fontsize');
  }
  if (button) {
    button.setAttribute('aria-pressed', value ? 'true' : 'false');
  }
}

/**
 * @param {Element} [element]
 * @return {void}
 */
function setupRTLMode(element) {
  if (getStorageItem('rtlmode') === 'true') {
    setRTLMode(true, element);
  }
  if (!element) {
    return;
  }
  element.addEventListener('click', () => {
    if (document.documentElement.dir === 'rtl') {
      setRTLMode(false, element);
    } else {
      setRTLMode(true, element);
    }
  });
}

/**
 * @param {Element} [element]
 * @return {void}
 */
function setupAltTheme(element) {
  if (getStorageItem('alttheme') === 'true') {
    setAltTheme(true, element);
  }
  if (!element) {
    return;
  }
  element.addEventListener('click', () => {
    if (getStorageItem('alttheme') !== 'true') {
      setAltTheme(true, element);
    } else {
      setAltTheme(false, element);
    }
  });
}

/**
 * @param {Element} [element]
 * @return {void}
 */
function setupDarkMode(element) {
  if (isDarkMode()) {
    setDarkMode(true, element);
  }
  if (!element) {
    return;
  }
  element.addEventListener('click', () => {
    if (document.documentElement.hasAttribute('mdw-dark')) {
      setDarkMode(false, element);
    } else {
      setDarkMode(true, element);
    }
  });
}

/**
 * @param {Element} element
 * @return {void}
 */
function setupLargeFontMode(element) {
  const fontsize = getStorageItem('fontsize');
  setFontSize(fontsize, element);
  if (!element) {
    return;
  }
  element.addEventListener('click', () => {
    if (document.documentElement.style.getPropertyValue('font-size')) {
      setFontSize(null, element);
    } else {
      setFontSize('200%', element);
    }
  });
}

/** @return {void} */
export function setupMenuOptions() {
  setupAltTheme(document.getElementById('altThemeButton'));
  setupRTLMode(document.getElementById('rtlButton'));
  setupDarkMode(document.getElementById('darkModeButton'));
  setupLargeFontMode(document.getElementById('largeFontButton'));
}
