import { setTextNode } from '../../core/dom.js';
import { convertElementToCode } from '../_sample-utils.js';

/** @type {HTMLElement} */
let sampleComponent;
/** @type {HTMLElement} */
let mediaElement;
/** @type {HTMLElement} */
let actionsElement;
/** @type {HTMLElement} */
let closeActionElement;
/** @type {HTMLElement} */
let primaryButtonElement;

/** @return {void} */
function updateSampleCode() {
  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  setTextNode(htmlCodeElement, convertElementToCode(
    sampleComponent,
    document.getElementById('usePug').getAttribute('aria-pressed') === 'true',
  ));
}

/** @return {void} */
function setupPugButton() {
  const pugButton = document.getElementById('usePug');
  pugButton.addEventListener('click', () => {
    if (pugButton.getAttribute('aria-pressed') === 'true') {
      pugButton.setAttribute('aria-pressed', 'false');
    } else {
      pugButton.setAttribute('aria-pressed', 'true');
    }
    updateSampleCode();
  });
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = /** @type {HTMLInputElement} */ (event.target);
  let raiseOptions;
  switch (name) {
    case 'elevation':
      sampleComponent.removeAttribute('mdw-elevation');
      switch (value) {
        case 'auto':
          break;
        default:
          sampleComponent.setAttribute('mdw-elevation', value);
          break;
      }
      break;
    case 'raise-focus-within':
    case 'raise-hover':
      raiseOptions = (sampleComponent.getAttribute('mdw-raised') || '').split(' ');
      if (checked) {
        if (!raiseOptions.includes(name.slice('raise-'.length))) {
          raiseOptions.push(name.slice('raise-'.length));
        }
      } else {
        raiseOptions = raiseOptions.filter((o) => o !== name.slice('raise-'.length));
      }
      raiseOptions.sort();
      if (raiseOptions.length) {
        sampleComponent.setAttribute('mdw-raised', raiseOptions.join(' ').trim());
      } else {
        sampleComponent.removeAttribute('mdw-raised');
      }
      break;
    case 'media-placement':
      if (mediaElement.parentElement) {
        mediaElement.remove();
      }
      switch (value) {
        default:
        case 'none':
          break;
        case 'top':
          sampleComponent.insertBefore(mediaElement, sampleComponent.getElementsByClassName('mdw-card__start')[0]);
          break;
        case 'middle':
          sampleComponent.insertBefore(mediaElement, sampleComponent.getElementsByClassName('mdw-card__supporting-text')[0]);
          break;
        case 'bottom':
          sampleComponent.appendChild(mediaElement);
          break;
      }
      break;
    case 'media-ratio':
      switch (value) {
        default:
        case 'none':
          mediaElement.removeAttribute('mdw-ratio');
          break;
        case '16:9':
          mediaElement.setAttribute('mdw-ratio', '16:9');
          break;
        case '3:2':
          mediaElement.setAttribute('mdw-ratio', '3:2');
          break;
        case '4:3':
          mediaElement.setAttribute('mdw-ratio', '4:3');
          break;
        case '1:1':
          mediaElement.setAttribute('mdw-ratio', '1:1');
          break;
      }
      break;
    case 'primary-action':
      if (checked) {
        if (!primaryButtonElement.parentElement) {
          sampleComponent.insertBefore(primaryButtonElement, sampleComponent.firstChild);
        }
      } else if (primaryButtonElement.parentElement) {
        primaryButtonElement.remove();
      }
      break;
    case 'secondary-actions':
      if (checked) {
        if (!actionsElement.parentElement) {
          sampleComponent.appendChild(actionsElement);
        }
      } else if (actionsElement.parentElement) {
        actionsElement.remove();
      }
      break;
    case 'close-action':
      if (checked) {
        if (!closeActionElement.parentElement) {
          sampleComponent.insertBefore(closeActionElement, sampleComponent.getElementsByClassName('mdw-card__header')[0]);
        }
      } else if (closeActionElement.parentElement) {
        closeActionElement.remove();
      }
      break;
    case 'surface':
      sampleComponent.setAttribute('mdw-surface', value.replace(/ (light|dark)/, ''));
      if (!value.includes(' light')) {
        sampleComponent.removeAttribute('mdw-light');
      } else {
        sampleComponent.setAttribute('mdw-light', '');
      }
      if (!value.includes(' dark')) {
        sampleComponent.removeAttribute('mdw-dark');
      } else {
        sampleComponent.setAttribute('mdw-dark', '');
      }
      if (value === 'card') {
        sampleComponent.classList.remove('mdw-theme');
      } else {
        sampleComponent.classList.add('mdw-theme');
      }
      break;
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-card');
  mediaElement = /** @type {HTMLElement} */ (sampleComponent.getElementsByClassName('mdw-card__media')[0]);
  actionsElement = /** @type {HTMLElement} */ (sampleComponent.getElementsByClassName('mdw-card__actions')[0]);
  primaryButtonElement = /** @type {HTMLElement} */ (sampleComponent.getElementsByClassName('mdw-card__button')[0]);
  closeActionElement = /** @type {HTMLElement} */ (sampleComponent.getElementsByClassName('mdw-card__end')[0]);
  for (const el of document.querySelectorAll('input[name]')) {
    el.addEventListener('change', onOptionChange);
  }
}

setupComponentOptions();
setupPugButton();
updateSampleCode();
