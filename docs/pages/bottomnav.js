import * as BottomNav from '../../components/bottomnav/index.js';
import * as BottomNavItem from '../../components/bottomnav/item.js';
import * as Button from '../../components/button/index.js';
import { setTextNode } from '../../core/dom.js';
import { convertElementToCode } from '../_sample-utils.js';

/** @return {void} */
function initializeSampleComponents() {
  for (const element of document.querySelectorAll('.mdw-bottomnav')) {
    BottomNav.attach(element);
  }
}

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function updateSampleCode() {
  // Strip JS related elements and attributes
  BottomNav.detach(sampleComponent);
  sampleComponent.removeAttribute('role');
  for (const item of sampleComponent.getElementsByClassName('mdw-bottomnav__item')) {
    BottomNavItem.detach(item);
    item.classList.remove('mdw-ripple');
    item.classList.remove('mdw-overlay');
    item.removeAttribute('mdw-overlay-off');
    item.removeAttribute('role');
  }

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  setTextNode(htmlCodeElement, convertElementToCode(
    sampleComponent,
    document.getElementById('usePug').getAttribute('aria-pressed') === 'true',
  ));

  // Reattach JS if requested
  BottomNav.attach(sampleComponent);

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.BottomNav.attach(bottomNavElement);';
}

/** @return {void} */
function setupPugButton() {
  const pugButton = document.getElementById('usePug');
  Button.attach(pugButton);
  pugButton.addEventListener('click', () => {
    if (pugButton.getAttribute('aria-pressed') === 'true') {
      pugButton.setAttribute('aria-pressed', 'false');
    } else {
      pugButton.setAttribute('aria-pressed', 'true');
    }
    updateSampleCode();
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value } = /** @type {HTMLInputElement} */ (event.target);
  switch (name) {
    case 'ink':
      switch (value) {
        case 'default':
          for (const el of sampleComponent.getElementsByClassName('mdw-bottomnav__item')) el.removeAttribute('mdw-ink');
          break;
        default:
          for (const el of sampleComponent.getElementsByClassName('mdw-bottomnav__item')) el.setAttribute('mdw-ink', value);
          break;
      }
      break;
    case 'surface':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-surface');
          sampleComponent.removeAttribute('mdw-light');
          sampleComponent.removeAttribute('mdw-dark');
          break;
        default:
          sampleComponent.setAttribute('mdw-surface', value.replace(/ (light|dark)/, ''));
          if (!value.includes(' light')) {
            sampleComponent.removeAttribute('mdw-light');
          } else {
            sampleComponent.setAttribute('mdw-light', '');
          }
          if (!value.includes(' dark')) {
            sampleComponent.removeAttribute('mdw-dark');
          } else {
            sampleComponent.setAttribute('mdw-dark', '');
          }
          if (value === 'none') {
            sampleComponent.classList.remove('mdw-theme');
          } else {
            sampleComponent.classList.add('mdw-theme');
          }
          break;
      }
      break;
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-bottomnav');
  BottomNav.attach(sampleComponent);
  for (const el of document.querySelectorAll('input[name]')) {
    el.addEventListener('change', onOptionChange);
  }
}

initializeSampleComponents();
setupComponentOptions();
setupPugButton();
updateSampleCode();
