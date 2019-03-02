import { Button } from '../../components/button/index';
import { convertElementToCode } from '../sample-utils';
import { iterateArrayLike, setTextNode } from '../../components/common/dom';

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-button'), Button.attach);
}

/** @type {HTMLElement} */
let sampleComponent;

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  Button.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  htmlCodeElement.textContent = convertElementToCode(sampleComponent);

  // Reattach JS if requested
  if (useJS) {
    Button.attach(sampleComponent);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = 'mdw.Button.attach(buttonElement);';
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  let newElement;
  switch (name) {
    case 'elevation':
      switch (value) {
        default:
        case 'flat':
          sampleComponent.removeAttribute('mdw-raised');
          break;
        case 'raised':
          sampleComponent.setAttribute('mdw-raised', '');
          break;
      }
      break;
    case 'outlined':
      if (checked) {
        sampleComponent.setAttribute('mdw-outline', '');
      } else {
        sampleComponent.removeAttribute('mdw-outline');
      }
      break;
    case 'activated':
      if (checked) {
        sampleComponent.setAttribute('mdw-activated', '');
      } else {
        sampleComponent.removeAttribute('mdw-activated');
      }
      break;
    case 'active':
      if (checked) {
        sampleComponent.setAttribute('mdw-active', '');
      } else {
        sampleComponent.removeAttribute('mdw-active');
      }
      break;
    case 'inactive':
      if (checked) {
        sampleComponent.setAttribute('mdw-inactive', '');
      } else {
        sampleComponent.removeAttribute('mdw-inactive');
      }
      break;
    case 'disabled':
      if (checked) {
        sampleComponent.setAttribute('disabled', '');
      } else {
        sampleComponent.removeAttribute('disabled');
      }
      break;
    case 'content':
      switch (value) {
        case 'text':
          sampleComponent.removeAttribute('mdw-icon');
          sampleComponent.classList.remove('material-icons');
          setTextNode(sampleComponent, 'Button');
          break;
        case 'icon':
          sampleComponent.setAttribute('mdw-icon', '');
          sampleComponent.classList.add('material-icons');
          setTextNode(sampleComponent, 'favorite');
          break;
        default:
      }
      break;
    case 'color':
      switch (value) {
        case 'default':
          sampleComponent.removeAttribute('mdw-theme-color');
          break;
        default:
          sampleComponent.setAttribute('mdw-theme-color', value);
          break;
      }
      break;
    case 'fill':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-theme-fill');
          break;
        default:
          sampleComponent.setAttribute('mdw-theme-fill', value);
          break;
      }
      break;
    case 'htmltype':
      newElement = document.createElement(value);
      while (sampleComponent.firstChild) {
        newElement.appendChild(sampleComponent.firstChild);
      }
      iterateArrayLike(sampleComponent.attributes, (attr) => {
        newElement.attributes.setNamedItem(attr.cloneNode());
      });
      sampleComponent.parentElement.replaceChild(newElement, sampleComponent);
      sampleComponent = newElement;
      if (value === 'a') {
        sampleComponent.setAttribute('href', '#');
      } else {
        sampleComponent.removeAttribute('href');
      }
      break;
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-button');
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
