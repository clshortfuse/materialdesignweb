import * as Chip from '../../components/chip/index.js';
import { convertElementToCode } from '../_sample-utils.js';

/** @type {Iterable<HTMLElement>} */
let sampleComponents;

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  for (const element of sampleComponents) { Chip.detach(element); }

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const sampleContainer = document.querySelector('.component-sample__container').firstElementChild;
  htmlCodeElement.textContent = convertElementToCode(sampleContainer);

  // Reattach JS if requested
  if (useJS) {
    for (const element of sampleComponents) { Chip.attach(element); }
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.Chip.attach(chipElement);';
}

/** @return {void} */
function initializeSampleComponents() {
  for (const element of document.querySelectorAll('.js .mdw-tab')) { Chip.attach(element); }
  for (const formElement of document.getElementsByTagName('form')) {
    formElement.reset();
  }
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const inputElement = /** @type {HTMLInputElement} */ (event.currentTarget);
  const { name, value, checked } = inputElement;

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
    case 'outlined': {
      for (const el of sampleComponents) {
        if (checked) {
          el.setAttribute('mdw-outlined', '');
        } else {
          el.removeAttribute('mdw-outlined');
        }
      }
      break;
    }
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponents = document.querySelectorAll('.component-sample .mdw-chip');
  for (const el of document.querySelectorAll('.demo-options input[name]')) {
    el.addEventListener('change', onOptionChange);
  }
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
