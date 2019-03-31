import { iterateArrayLike } from '../../core/dom';
import * as TextField from '../../components/textfield/index';

import { convertElementToCode } from '../_sample-utils';

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-textfield'), TextField.attach);
}

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useAutoSize = document.querySelector('input[name="autosize"]').checked;
  const isTextArea = document.querySelector('input[name="field-type"][value="text-area"]').checked;
  const useJS = jsRequired || jsOptional;
  if (useAutoSize && useJS && isTextArea) {
    sampleComponent.setAttribute('mdw-autosize', '');
  } else {
    sampleComponent.removeAttribute('mdw-autosize');
  }
  // Remove resize values
  sampleComponent.getElementsByClassName('mdw-textfield__input')[0].removeAttribute('style');

  // Strip JS related elements and attributes
  TextField.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  htmlCodeElement.textContent = convertElementToCode(sampleComponent);

  // Reattach JS if requested
  if (useJS) {
    TextField.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.TextField.attach(element);';
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  let inputElement = sampleComponent.getElementsByClassName('mdw-textfield__input')[0];
  let desiredTagName = inputElement.tagName.toLowerCase();
  let helperText;
  let errorText;
  let prefixText;
  let suffixText;
  let signifierElement;
  switch (name) {
    case 'field-type':
      switch (value) {
        default:
        case 'single-type':
          sampleComponent.removeAttribute('mdw-autosize');
          desiredTagName = 'input';
          break;
        case 'text-area':
          desiredTagName = 'textarea';
          break;
        case 'dropdown':
          sampleComponent.removeAttribute('mdw-autosize');
          desiredTagName = 'select';
          break;
      }
      break;
    case 'style':
      switch (value) {
        default:
        case 'filled':
          sampleComponent.removeAttribute('mdw-outlined');
          sampleComponent.removeAttribute('mdw-solo');
          break;
        case 'outlined':
          sampleComponent.setAttribute('mdw-outlined', '');
          sampleComponent.removeAttribute('mdw-solo');
          break;
        case 'solo':
          sampleComponent.removeAttribute('mdw-outlined');
          sampleComponent.setAttribute('mdw-solo', '');
          break;
      }
      break;
    case 'box':
      if (checked) {
        sampleComponent.setAttribute('mdw-box', '');
      } else {
        sampleComponent.removeAttribute('mdw-box');
      }
      break;
    case 'outlined':
      if (checked) {
        sampleComponent.setAttribute('mdw-outlined', '');
      } else {
        sampleComponent.removeAttribute('mdw-outlined');
      }
      break;
    case 'disabled':
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].setAttribute('disabled', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].removeAttribute('disabled');
      }
      break;
    case 'required':
      if (checked) {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].setAttribute('required', '');
      } else {
        sampleComponent.getElementsByClassName('mdw-textfield__input')[0].removeAttribute('required');
      }
      break;
    case 'prefix':
      prefixText = sampleComponent.getElementsByClassName('mdw-textfield__prefix')[0];
      if (checked) {
        if (!prefixText) {
          prefixText = document.createElement('div');
          prefixText.classList.add('mdw-textfield__prefix');
          prefixText.textContent = '$';
          sampleComponent.appendChild(prefixText);
        }
      } else if (prefixText) {
        prefixText.parentElement.removeChild(prefixText);
      }
      break;
    case 'suffix':
      suffixText = sampleComponent.getElementsByClassName('mdw-textfield__suffix')[0];
      if (checked) {
        if (!suffixText) {
          suffixText = document.createElement('div');
          suffixText.classList.add('mdw-textfield__suffix');
          suffixText.textContent = 'lbs';
          sampleComponent.appendChild(suffixText);
        }
      } else if (suffixText) {
        suffixText.parentElement.removeChild(suffixText);
      }
      break;
    case 'signifier':
      signifierElement = sampleComponent.getElementsByClassName('mdw-textfield__signifier')[0];
      if (checked) {
        if (!signifierElement) {
          signifierElement = document.createElement('div');
          signifierElement.classList.add('mdw-textfield__signifier');
          signifierElement.classList.add('material-icons');
          signifierElement.textContent = 'security';
          if (inputElement.nextElementSibling) {
            sampleComponent.insertBefore(signifierElement, inputElement.nextElementSibling);
          } else {
            sampleComponent.appendChild(signifierElement);
          }
        }
      } else if (signifierElement) {
        signifierElement.parentElement.removeChild(signifierElement);
      }
      break;
    case 'helper-text':
      helperText = sampleComponent.getElementsByClassName('mdw-textfield__helper-text')[0];
      if (checked) {
        if (!helperText) {
          helperText = document.createElement('div');
          helperText.classList.add('mdw-textfield__helper-text');
          helperText.textContent = 'Helper text.';
          sampleComponent.appendChild(helperText);
        }
      } else if (helperText) {
        helperText.parentElement.removeChild(helperText);
      }
      break;
    case 'error-text':
      errorText = sampleComponent.getElementsByClassName('mdw-textfield__error-text')[0];
      if (checked) {
        if (!errorText) {
          errorText = document.createElement('div');
          errorText.classList.add('mdw-textfield__error-text');
          errorText.textContent = 'Error text.';
          sampleComponent.appendChild(errorText);
        }
      } else if (errorText) {
        errorText.parentElement.removeChild(errorText);
      }
      break;
    case 'color':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-ink');
          break;
        default:
          sampleComponent.setAttribute('mdw-ink', value);
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
          if (value.indexOf(' light') === -1) {
            sampleComponent.removeAttribute('mdw-light');
          } else {
            sampleComponent.setAttribute('mdw-light', '');
          }
          if (value.indexOf(' dark') === -1) {
            sampleComponent.removeAttribute('mdw-dark');
          } else {
            sampleComponent.setAttribute('mdw-dark', '');
          }
          break;
      }
      break;
    default:
  }

  if (inputElement.tagName.toLowerCase() !== desiredTagName) {
    const newElement = document.createElement(desiredTagName);
    for (let i = inputElement.attributes.length - 1; i >= 0; i -= 1) {
      const attr = inputElement.attributes.item(i);
      newElement.attributes.setNamedItem(attr.cloneNode());
    }
    inputElement.parentElement.replaceChild(newElement, inputElement);
    inputElement = newElement;
    let dropdown = sampleComponent.getElementsByClassName('mdw-textfield__icon')[0];
    if (desiredTagName === 'select') {
      const option1 = document.createElement('option');
      option1.setAttribute('value', '');
      option1.textContent = 'Empty';
      const option2 = document.createElement('option');
      option2.setAttribute('value', 'option1');
      option2.textContent = 'Option 1';
      const option3 = document.createElement('option');
      option3.setAttribute('value', 'option2');
      option3.textContent = 'Option 2';
      inputElement.appendChild(option1);
      inputElement.appendChild(option2);
      inputElement.appendChild(option3);
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.classList.add('mdw-textfield__icon');
        dropdown.setAttribute('mdw-dropdown', '');
        sampleComponent.appendChild(dropdown);
      }
    } else if (dropdown) {
      dropdown.parentElement.removeChild(dropdown);
    }
  }
  inputElement.removeAttribute('rows');
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-textfield');
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
