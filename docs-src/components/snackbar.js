import { convertElementToCode } from '../sample-utils';
import * as Snackbar from '../../components/snackbar/index';
import { iterateArrayLike } from '../../core/dom';

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  const snackbar = sampleComponent.getElementsByClassName('mdw-snackbar')[0];

  // Strip JS related elements and attributes
  Snackbar.detach(snackbar);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  htmlCodeElement.textContent = convertElementToCode(sampleComponent);

  // Reattach JS if requested
  if (useJS) {
    Snackbar.attach(snackbar);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = [
    'Snackbar.create({',
    "  text: 'Required text.',",
    "  buttonText: 'Optional button text',",
    "  buttonThemeColor: 'accent',",
    '  stacked: false,',
    '  autoHide: 4,',
    '  autoDestroy: true,',
    "  parent: document.getElementsByClassName('.mdw-snackbar__container')[0],",
    '  show: true,',
    '  skipQueue: false',
    '})',
  ].join('\n');
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  const snackbar = sampleComponent.getElementsByClassName('mdw-snackbar')[0];
  const span = sampleComponent.getElementsByTagName('span')[0];
  let buttonElement = sampleComponent.getElementsByClassName('mdw-button')[0];
  switch (name) {
    case 'stacked':
      if (checked) {
        snackbar.setAttribute('mdw-stacked', '');
      } else {
        snackbar.removeAttribute('mdw-stacked');
      }
      break;
    case 'text':
      switch (value) {
        case 'short':
          span.textContent = 'Short message snackbar.';
          break;
        case 'long':
          span.textContent = 'Long message snackbar that wraps text on smaller screens.';
          break;
        case 'line-break':
          span.textContent = 'Two-line message\n with explicit line break.';
          break;
        default:
      }
      break;
    case 'visibility':
      switch (value) {
        default:
        case 'show':
          snackbar.setAttribute('aria-hidden', 'false');
          break;
        case 'hide':
          snackbar.setAttribute('aria-hidden', 'true');
          break;
      }
      break;
    case 'autohide':
      switch (value) {
        case 'none':
          snackbar.removeAttribute('mdw-autohide');
          break;
        case '4':
          snackbar.setAttribute('mdw-autohide', '');
          break;
        default:
          snackbar.setAttribute('mdw-autohide', value);
          break;
      }
      break;
    case 'position':
      switch (value) {
        default:
        case 'start':
          sampleComponent.removeAttribute('mdw-position');
          break;
        case 'center':
          sampleComponent.setAttribute('mdw-position', 'center');
          break;
        case 'end':
          sampleComponent.setAttribute('mdw-position', 'end');
          break;
      }
      break;
    case 'button':
      if (value === 'none') {
        if (buttonElement) {
          buttonElement.parentElement.removeChild(buttonElement);
        }
        break;
      }
      if (!buttonElement) {
        buttonElement = document.createElement('button');
        buttonElement.classList.add('mdw-button');
        buttonElement.classList.add('mdw-theme');
        buttonElement.setAttribute('mdw-color', 'accent');
        snackbar.appendChild(buttonElement);
      }
      switch (value) {
        case 'short':
          buttonElement.textContent = 'Action';
          break;
        case 'long':
          buttonElement.textContent = 'Longer Action Text';
          break;
        default:
      }
      break;
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.mdw-snackbar__container');
  /** @type {HTMLElement} */
  const jsSnackbarContainer = (document.querySelector('.mdw-snackbar__container.js-sample'));
  document.querySelector('.component-sample button.mdw-button').addEventListener('click', () => {
    Snackbar.create({
      text: `Snackbar created at: ${new Date().toLocaleTimeString()}`,
      parent: jsSnackbarContainer,
    });
  });
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

setupComponentOptions();
updateSampleCode();
