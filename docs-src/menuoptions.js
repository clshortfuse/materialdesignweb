import { setStorageItem, removeStorageItem, getStorageItem } from './storage';

/**
 * @param {boolean} value
 * @param {Element=} button
 * @return {void}
 */
export function setRTLMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('dir', 'rtl');
    if (button) {
      button.setAttribute('aria-pressed', 'true');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
    setStorageItem('rtlmode', 'true');
  } else {
    // Explicit LTR is required for Safari to support repeated toggling
    document.documentElement.setAttribute('dir', 'ltr');
    if (button) {
      button.setAttribute('aria-pressed', 'false');
    }
    // element.removeAttribute('mdw-active');
    removeStorageItem('rtlmode');
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
 * @param {Element=} button
 * @return {void}
 */
export function setDarkMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('mdw-dark', '');
    document.documentElement.setAttribute('mdw-surface', 'black');
    document.documentElement.removeAttribute('mdw-light');
  } else {
    document.documentElement.setAttribute('mdw-light', '');
    document.documentElement.setAttribute('mdw-surface', 'white');
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
 * @param {Element=} button
 * @return {void}
 */
export function setAltTheme(value, button) {
  document.documentElement.setAttribute('mdw-theme', value ? 'colored' : 'default');
  const stringValue = (value ? 'true' : 'false');
  if (button) {
    button.setAttribute('aria-pressed', stringValue);
  }
  const statusBarAttribute = document.head.getElementsByTagName('meta')['theme-color'];
  if (statusBarAttribute) {
    statusBarAttribute.setAttribute('content', value ? '#FF9800' : '#E91E63');
  }

  setStorageItem('alttheme', stringValue);
}

/**
 * @param {string} value
 * @param {Element=} button
 * @return {void}
 */
export function setFontSize(value, button) {
  if (value) {
    document.documentElement.style.setProperty('font-size', value);
    if (button) {
      button.setAttribute('aria-pressed', 'true');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
    setStorageItem('fontsize', value);
  } else {
    document.documentElement.style.removeProperty('font-size');
    if (button) {
      button.setAttribute('aria-pressed', 'false');
    }
    // element.removeAttribute('mdw-active');
    removeStorageItem('fontsize');
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
    if (document.documentElement.getAttribute('dir') === 'rtl') {
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
    if (document.documentElement.getAttribute('mdw-theme') === 'colored') {
      setAltTheme(false, element);
    } else {
      setAltTheme(true, element);
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
