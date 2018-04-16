/**
 * @param {Element} element
 * @return {void}
 */
function setupDarkMode(element) {
  const darkAttribute = 'black dark';
  const lightAttribute = 'white light';
  element.addEventListener('click', () => {
    if (document.body.getAttribute('mdw-theme-fill') === darkAttribute) {
      document.body.setAttribute('mdw-theme-fill', lightAttribute);
      element.setAttribute('mdw-inactive', '');
      element.removeAttribute('mdw-active');
    } else {
      document.body.setAttribute('mdw-theme-fill', darkAttribute);
      element.removeAttribute('mdw-inactive');
      // element.setAttribute('mdw-active', '');
      // Poor visibility even though spec says 70% opacity
    }
  });
}

/** @return {void} */
function setupMenuOptions() {
  const [buttonDarkMode] = document.querySelectorAll('#docs-menu-buttons .mdw-button');
  setupDarkMode(buttonDarkMode);
}

export default setupMenuOptions;