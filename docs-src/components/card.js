import { convertElementToCode } from '../sample-utils';
import { iterateArrayLike } from '../../components/common/dom';

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
  htmlCodeElement.textContent = convertElementToCode(sampleComponent);
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
        if (raiseOptions.indexOf(name.substr('raise-'.length)) === -1) {
          raiseOptions.push(name.substr('raise-'.length));
        }
      } else {
        raiseOptions = raiseOptions.filter(o => o !== name.substr('raise-'.length));
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
        mediaElement.parentElement.removeChild(mediaElement);
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
        primaryButtonElement.parentElement.removeChild(primaryButtonElement);
      }
      break;
    case 'secondary-actions':
      if (checked) {
        if (!actionsElement.parentElement) {
          sampleComponent.appendChild(actionsElement);
        }
      } else if (actionsElement.parentElement) {
        actionsElement.parentElement.removeChild(actionsElement);
      }
      break;
    case 'close-action':
      if (checked) {
        if (!closeActionElement.parentElement) {
          sampleComponent.insertBefore(closeActionElement, sampleComponent.getElementsByClassName('mdw-card__header')[0]);
        }
      } else if (closeActionElement.parentElement) {
        closeActionElement.parentElement.removeChild(closeActionElement);
      }
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
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-card');
  /** @type {HTMLElement} */
  mediaElement = (sampleComponent.getElementsByClassName('mdw-card__media')[0]);
  /** @type {HTMLElement} */
  actionsElement = (sampleComponent.getElementsByClassName('mdw-card__actions')[0]);
  /** @type {HTMLElement} */
  primaryButtonElement = (sampleComponent.getElementsByClassName('mdw-card__button')[0]);
  /** @type {HTMLElement} */
  closeActionElement = (sampleComponent.getElementsByClassName('mdw-card__end')[0]);
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

setupComponentOptions();
updateSampleCode();
