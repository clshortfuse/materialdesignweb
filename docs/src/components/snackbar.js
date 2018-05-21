import { setupMenuOptions } from '../menuoptions';
import { convertElementToCode, getChildTextNode, attachEventListener } from '../sample-utils';

/** @return {void} */
function initializeSampleComponents() {
  const snackbars = document.querySelectorAll('.js .mdw-snackbar');
  for (let i = 0; i < snackbars.length; i += 1) {
    // Snackbar.attach(snackbars.item(i));
  }
}

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  // Snackbar.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  htmlCodeElement.textContent = convertElementToCode(sampleComponent);

  // Reattach JS if requested
  if (useJS) {
    // Snackbar.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = '/* None */';
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  const span = sampleComponent.getElementsByTagName('span')[0];
  let buttonElement = sampleComponent.getElementsByClassName('mdw-button')[0];
  switch (name) {
    case 'stacked':
      if (checked) {
        sampleComponent.setAttribute('mdw-stacked', '');
      } else {
        sampleComponent.removeAttribute('mdw-stacked');
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
          sampleComponent.removeAttribute('mdw-hide');
          sampleComponent.removeAttribute('mdw-show');
          break;
        case 'show':
          sampleComponent.removeAttribute('mdw-hide');
          sampleComponent.setAttribute('mdw-show', '');
          break;
        case 'hide':
          sampleComponent.setAttribute('mdw-hide', '');
          sampleComponent.removeAttribute('mdw-show');
          break;
      }
      break;
    case 'autohide':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-autohide');
          break;
        case '4':
          sampleComponent.setAttribute('mdw-autohide', '');
          break;
        default:
          sampleComponent.setAttribute('mdw-autohide', value);
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
        sampleComponent.appendChild(buttonElement);
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
  sampleComponent = document.querySelector('.component-sample .mdw-snackbar');
  attachEventListener(
    document.querySelectorAll('input[name]'),
    'change',
    onOptionChange
  );
}

initializeSampleComponents();
setupMenuOptions();
setupComponentOptions();
updateSampleCode();
