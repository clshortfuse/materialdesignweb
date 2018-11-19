import { Button } from '../../../components/button/index';
import { setupMenuOptions } from '../menuoptions';
import { convertElementToCode, getChildTextNode, attachEventListener } from '../sample-utils';

/** @return {void} */
function initializeSampleComponents() {
  const buttons = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < buttons.length; i += 1) {
    Button.attach(buttons.item(i));
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
  let focusRing;
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
        case 'raised-always':
          sampleComponent.setAttribute('mdw-raised', 'always');
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
    case 'disabled':
      if (checked) {
        sampleComponent.setAttribute('disabled', '');
      } else {
        sampleComponent.removeAttribute('disabled');
      }
      break;
    case 'focus-ring':
      focusRing = sampleComponent.getElementsByClassName('mdw-button__focus-ring')[0];
      if (checked) {
        if (!focusRing) {
          focusRing = document.createElement('div');
          focusRing.classList.add('mdw-button__focus-ring');
          sampleComponent.insertBefore(focusRing, sampleComponent.firstChild);
        }
      } else if (focusRing) {
        focusRing.parentElement.removeChild(focusRing);
      }
      break;
    case 'content':
      switch (value) {
        case 'text':
          sampleComponent.removeAttribute('mdw-icon');
          sampleComponent.classList.remove('material-icons');
          getChildTextNode(sampleComponent).nodeValue = 'Button';
          break;
        case 'icon':
          sampleComponent.setAttribute('mdw-icon', '');
          sampleComponent.classList.add('material-icons');
          getChildTextNode(sampleComponent).nodeValue = 'favorite';
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
      for (let i = sampleComponent.attributes.length - 1; i >= 0; i -= 1) {
        const attr = sampleComponent.attributes.item(i);
        newElement.attributes.setNamedItem(attr.cloneNode());
      }
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
