import { setStorageItem, removeStorageItem, getStorageItem } from './storage';

const darkAttribute = 'black dark';
const lightAttribute = 'white light';

/**
 * @param {boolean} value
 * @param {Element=} button
 * @return {void}
 */
export function setRTLMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('dir', 'rtl');
    if (button) {
      button.removeAttribute('mdw-inactive');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
    setStorageItem('rtlmode', 'true');
  } else {
    // Explicit LTR is required for Safari to support repeated toggling
    document.documentElement.setAttribute('dir', 'ltr');
    if (button) {
      button.setAttribute('mdw-inactive', '');
    }
    // element.removeAttribute('mdw-active');
    removeStorageItem('rtlmode');
  }
}

/**
 * @param {boolean} value
 * @param {Element=} button
 * @return {void}
 */
export function setDarkMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('mdw-dark', '');
    document.documentElement.setAttribute('mdw-fill', 'black');
    document.documentElement.removeAttribute('mdw-light');
    if (button) {
      button.removeAttribute('mdw-inactive');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
  } else {
    document.documentElement.setAttribute('mdw-light', '');
    document.documentElement.setAttribute('mdw-fill', 'white');
    document.documentElement.removeAttribute('mdw-dark');
    if (button) {
      button.setAttribute('mdw-inactive', '');
    }
    // element.removeAttribute('mdw-active');
  }
  setStorageItem('darkmode', value ? 'true' : 'false');
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
      button.removeAttribute('mdw-inactive');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
    setStorageItem('fontsize', value);
  } else {
    document.documentElement.style.removeProperty('font-size');
    if (button) {
      button.setAttribute('mdw-inactive', '');
    }
    // element.removeAttribute('mdw-active');
    removeStorageItem('fontsize');
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
function setupRTLMode(element) {
  if (getStorageItem('rtlmode') === 'true') {
    setRTLMode(true, element);
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
 * @param {Element} element
 * @return {void}
 */
function setupDarkMode(element) {
  if (getStorageItem('darkmode') === 'true') {
    setDarkMode(true, element);
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
  const buttons = document.getElementById('docs-menu-buttons').getElementsByClassName('mdw-button');
  const buttonRTLMode = buttons[0];
  const buttonDarkMode = buttons[1];
  const largeFontMode = buttons[2];
  setupRTLMode(buttonRTLMode);
  setupDarkMode(buttonDarkMode);
  setupLargeFontMode(largeFontMode);
}
