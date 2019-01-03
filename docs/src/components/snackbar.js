import { convertElementToCode } from '../sample-utils';
import { Snackbar } from '../../../components/snackbar/index';
import { iterateArrayLike } from '../../../components/common/dom';

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-snackbar'), Snackbar.attach);
}

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  Snackbar.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  htmlCodeElement.textContent = convertElementToCode(sampleComponent);

  // Reattach JS if requested
  if (useJS) {
    Snackbar.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = [
    'Snackbar.show(snackBarElement);',
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
        case 'auto':
          snackbar.removeAttribute('mdw-hide');
          snackbar.removeAttribute('mdw-show');
          break;
        case 'show':
          snackbar.removeAttribute('mdw-hide');
          snackbar.setAttribute('mdw-show', '');
          break;
        case 'hide':
          snackbar.setAttribute('mdw-hide', '');
          snackbar.removeAttribute('mdw-show');
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
        buttonElement.setAttribute('mdw-theme-color', 'accent');
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
  sampleComponent = document.querySelector('.component-sample .mdw-snackbar__container');
  document.querySelector('.component-sample button.mdw-button').addEventListener('click', () => {
    Snackbar.create({
      text: `Snackbar created at: ${new Date().toLocaleTimeString()}`,
      parent: document.querySelector('.js-sample'),
      show: true,
    });
  });
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
