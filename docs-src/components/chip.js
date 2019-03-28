
import * as Chip from '../../components/chip/index';
import { iterateArrayLike } from '../../core/dom';
import { convertElementToCode } from '../sample-utils';

/** @type {ArrayLike<HTMLElement>} */
let sampleComponents;


/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  iterateArrayLike(sampleComponents, Chip.detach);


  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const sampleContainer = document.querySelector('.component-sample__container').firstElementChild;
  htmlCodeElement.textContent = convertElementToCode(sampleContainer);

  // Reattach JS if requested
  if (useJS) {
    iterateArrayLike(sampleComponents, Chip.attach);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.Chip.attach(chipElement);';
}

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-tab'), Chip.attach);
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
      iterateArrayLike(sampleComponents, (el) => {
        if (checked) {
          el.setAttribute('mdw-outlined', '');
        } else {
          el.removeAttribute('mdw-outlined');
        }
      });
      break;
    }
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponents = document.querySelectorAll('.component-sample .mdw-chip');
  iterateArrayLike(document.querySelectorAll('.demo-options input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
