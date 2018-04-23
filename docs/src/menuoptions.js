
import * as cookies from './cookies';

const darkAttribute = 'black dark';
const lightAttribute = 'white light';

/**
 * @param {boolean} value
 * @param {Element=} button
 * @return {void}
 */
function setRTLMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('dir', 'rtl');
    if (button) {
      button.removeAttribute('mdw-inactive');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
    cookies.setItem('rtlmode', 'true', 365);
  } else {
    document.documentElement.removeAttribute('dir');
    if (button) {
      button.setAttribute('mdw-inactive', '');
    }
    // element.removeAttribute('mdw-active');
    cookies.removeItem('rtlmode');
  }
}

/**
 * @param {boolean} value
 * @param {Element=} button
 * @return {void}
 */
function setDarkMode(value, button) {
  if (value) {
    document.documentElement.setAttribute('mdw-theme-fill', darkAttribute);
    if (button) {
      button.removeAttribute('mdw-inactive');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
  } else {
    document.documentElement.setAttribute('mdw-theme-fill', lightAttribute);
    if (button) {
      button.setAttribute('mdw-inactive', '');
    }
    // element.removeAttribute('mdw-active');
  }
  cookies.setItem('darkmode', value ? 'true' : 'false', 365);
}

/**
 * @param {string} value
 * @param {Element=} button
 * @return {void}
 */
function setFontSize(value, button) {
  if (value) {
    document.documentElement.style.setProperty('font-size', value);
    if (button) {
      button.removeAttribute('mdw-inactive');
    }
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
    cookies.setItem('fontsize', value, 365);
  } else {
    document.documentElement.style.removeProperty('font-size');
    if (button) {
      button.setAttribute('mdw-inactive', '');
    }
    // element.removeAttribute('mdw-active');
    cookies.removeItem('fontsize');
  }
}

/**
 * @param {Element} element
 * @return {void}
 */
function setupRTLMode(element) {
  if (cookies.getItem('rtlmode') === 'true') {
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
  if (cookies.getItem('darkmode') === 'true') {
    setDarkMode(true, element);
  }
  element.addEventListener('click', () => {
    if (document.documentElement.getAttribute('mdw-theme-fill') === darkAttribute) {
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
  const fontsize = cookies.getItem('fontsize');
  setFontSize(fontsize, element);
  element.addEventListener('click', () => {
    if (document.documentElement.style.getPropertyValue('font-size')) {
      setFontSize(null, element);
    } else {
      setFontSize('125%', element);
    }
  });
}

/** @return {void} */
function setupMenuOptions() {
  const [
    buttonRTLMode,
    buttonDarkMode,
    largeFontMode,
  ] = document.querySelectorAll('#docs-menu-buttons .mdw-button');
  setupRTLMode(buttonRTLMode);
  setupDarkMode(buttonDarkMode);
  setupLargeFontMode(largeFontMode);
}

export {
  setupMenuOptions,
  setRTLMode,
  setDarkMode,
  setFontSize,
};
