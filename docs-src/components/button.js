import * as Button from '../../components/button/index';
import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';
import { convertElementToCode } from '../sample-utils';
import { iterateArrayLike, setTextNode } from '../../core/dom';

/** @return {void} */
function initializeSampleComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-button'), Button.attach);
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

/** @type {HTMLElement} */
let sampleComponent;

/**
 * @param {string} name
 * @param {boolean} value
 * @return {void}
 */
function toggleOverlayOption(name, value) {
  const attr = sampleComponent.getAttribute('mdw-overlay-off') || '';
  if (!attr) {
    if (!value) {
      return;
    }
    sampleComponent.setAttribute('mdw-overlay-off', name);
    return;
  }
  if (value) {
    if (attr.indexOf(name) !== -1) {
      return;
    }
    sampleComponent.setAttribute('mdw-overlay-off', `${attr} ${name}`);
    return;
  }
  if (attr.indexOf(name) === -1) {
    return;
  }
  sampleComponent.setAttribute('mdw-overlay-off', attr.replace(name, '').trim());
}

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  Button.detach(sampleComponent);

  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  setTextNode(htmlCodeElement, convertElementToCode(sampleComponent,
    document.getElementById('usePug').getAttribute('aria-pressed') === 'true'));

  // Reattach JS if requested
  if (useJS) {
    Button.attachCore(sampleComponent);
    if (sampleComponent.classList.contains('mdw-ripple')) {
      Ripple.attach(sampleComponent);
    }
    if (sampleComponent.classList.contains('mdw-overlay')) {
      Overlay.attach(sampleComponent);
    }
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
    case 'toggle':
      if (!value) {
        sampleComponent.removeAttribute('aria-pressed');
      } else {
        sampleComponent.setAttribute('aria-pressed', value);
      }
      break;
    case 'disabled':
      if (checked) {
        sampleComponent.setAttribute('aria-disabled', 'true');
      } else {
        sampleComponent.removeAttribute('aria-disabled');
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
          sampleComponent.removeAttribute('mdw-color');
          break;
        default:
          sampleComponent.setAttribute('mdw-color', value);
          break;
      }
      break;
    case 'ripple':
      if (checked) {
        sampleComponent.classList.add('mdw-ripple');
      } else {
        sampleComponent.classList.remove('mdw-ripple');
      }
      break;
    case 'overlay-hover':
    case 'overlay-focus':
    case 'overlay-activated':
      toggleOverlayOption(name.replace('overlay-', ''), !checked);
      break;
    case 'fill':
      switch (value) {
        case 'none':
          sampleComponent.removeAttribute('mdw-fill');
          sampleComponent.removeAttribute('mdw-light');
          sampleComponent.removeAttribute('mdw-dark');
          break;
        default:
          sampleComponent.setAttribute('mdw-fill', value.replace(/ (light|dark)/, ''));
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
  Button.attach(sampleComponent);
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

initializeSampleComponents();
setupComponentOptions();
setupPugButton();
updateSampleCode();
