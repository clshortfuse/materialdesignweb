
import * as cookies from './cookies';

const darkAttribute = 'black dark';
const lightAttribute = 'white light';

/**
 * @param {Element} element
 * @param {boolean} value
 * @return {void}
 */
function setDarkMode(element, value) {
  if (value) {
    document.body.setAttribute('mdw-theme-fill', darkAttribute);
    element.removeAttribute('mdw-inactive');
    // element.setAttribute('mdw-active', '');
    // Poor visibility even though spec says 70% opacity
  } else {
    document.body.setAttribute('mdw-theme-fill', lightAttribute);
    element.setAttribute('mdw-inactive', '');
    // element.removeAttribute('mdw-active');
  }
  cookies.setItem('darkmode', value ? 'true' : 'false', 365);
}
/**
 * @param {Element} element
 * @return {void}
 */
function setupDarkMode(element) {
  if (cookies.getItem('darkmode') === 'true') {
    setDarkMode(element, true);
  }
  element.addEventListener('click', () => {
    if (document.body.getAttribute('mdw-theme-fill') === darkAttribute) {
      setDarkMode(element, false);
    } else {
      setDarkMode(element, true);
    }
  });
}

/** @return {void} */
function setupMenuOptions() {
  const [buttonDarkMode] = document.querySelectorAll('#docs-menu-buttons .mdw-button');
  setupDarkMode(buttonDarkMode);
}

export default setupMenuOptions;
