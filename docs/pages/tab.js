import * as Button from '../../components/button/index.js';
import * as Tab from '../../components/tab/index.js';
import { iterateArrayLike, setTextNode } from '../../core/dom.js';
import { convertElementToCode } from '../_sample-utils.js';

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function onWindowResize() {
  iterateArrayLike(document.getElementsByClassName('mdw-tab'), Tab.onResize);
}

/** @return {void} */
function updateSampleCode() {
  // Strip automatic attributes and classes
  Tab.detach(sampleComponent);
  iterateArrayLike(sampleComponent.getElementsByClassName('mdw-tab__item'), (el) => {
    el.classList.remove('mdw-overlay');
    el.classList.remove('mdw-ripple');
    el.removeAttribute('mdw-overlay-off');
  });
  const indicator = sampleComponent.getElementsByClassName('mdw-tab__indicator')[0];
  indicator.removeAttribute('style');

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  setTextNode(htmlCodeElement, convertElementToCode(sampleComponent,
    document.getElementById('usePug').getAttribute('aria-pressed') === 'true'));

  Tab.attach(sampleComponent);

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = [
    'mdw.Tab.attach(tabElement);',
    '',
    "window.addEventListener('resize', () => mdw.Tab.onResize(tabElement));",
  ].join('\n');
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

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.getElementsByClassName('mdw-tab'), Tab.attach);
  window.addEventListener('resize', onWindowResize);
  iterateArrayLike(document.getElementsByTagName('form'), (formElement) => {
    formElement.reset();
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  /** @type {HTMLInputElement} */
  const inputElement = (event.currentTarget);
  const { name, value, checked } = inputElement;
  const tabListElement = sampleComponent.querySelector('.mdw-tab__list');

  switch (name) {
    case 'framework':
      switch (value) {
        case 'javascript':
          break;
        case 'css':
          break;
        default:
      }
      break;
    case 'ink':
      switch (value) {
        case 'default':
          tabListElement.removeAttribute('mdw-ink');
          break;
        default:
          tabListElement.setAttribute('mdw-ink', value);
          break;
      }
      break;
    case 'surface':
      switch (value) {
        case 'none':
          tabListElement.removeAttribute('mdw-surface');
          tabListElement.removeAttribute('mdw-light');
          tabListElement.removeAttribute('mdw-dark');
          break;
        default:
          tabListElement.setAttribute('mdw-surface', value.replace(/ (light|dark)/, ''));
          if (value.indexOf(' light') === -1) {
            tabListElement.removeAttribute('mdw-light');
          } else {
            tabListElement.setAttribute('mdw-light', '');
          }
          if (value.indexOf(' dark') === -1) {
            tabListElement.removeAttribute('mdw-dark');
          } else {
            tabListElement.setAttribute('mdw-dark', '');
          }
          if (value === 'none') {
            tabListElement.classList.remove('mdw-theme');
          } else {
            tabListElement.classList.add('mdw-theme');
          }
          break;
      }
      break;
    case 'tabs-scrollable':
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-tab__list')[0].setAttribute('mdw-scrollable', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-tab__list')[0].removeAttribute('mdw-scrollable');
      }
      break;
    case 'content-scrollable': {
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-tab__content')[0].removeAttribute('mdw-no-scroll');
      } else {
        sampleComponent.getElementsByClassName('mdw-tab__content')[0].setAttribute('mdw-no-scroll', '');
      }
      break;
    }
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  setupPugButton();
  sampleComponent = document.querySelector('.component-sample .mdw-tab');
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
