import { convertElementToCode, attachEventListener } from '../sample-utils';

/** @type {HTMLElement} */
let sampleComponent;
/** @type {HTMLElement} */
let mediaElement;

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
  let textElement;
  let actionsElement;
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
    case 'raise-focus':
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
    case 'focusable':
      if (checked) {
        sampleComponent.setAttribute('tabindex', '0');
      } else {
        sampleComponent.removeAttribute('tabindex');
      }
      break;
    case 'media-placement':
      if (mediaElement.parentElement) {
        mediaElement.parentElement.removeChild(mediaElement);
      }
      if (value === 'none') {
        break;
      }
      switch (value) {
        case 'top':
          sampleComponent.insertBefore(mediaElement, sampleComponent.firstChild);
          break;
        case 'middle':
          textElement = sampleComponent.getElementsByClassName('mdw-card__supporting-text')[0];
          sampleComponent.insertBefore(mediaElement, textElement);
          break;
        case 'bottom':
          sampleComponent.appendChild(mediaElement);
          break;
      }
      break;
    case 'media-ratio':
      if (!mediaElement.parentElement) {
        return;
      }
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
    case 'actions':
      actionsElement = sampleComponent.getElementsByClassName('mdw-card__actions')[0];
      if (checked) {
        if (!actionsElement) {
          textElement = sampleComponent.getElementsByClassName('mdw-card__supporting-text')[0];
          textElement.insertAdjacentHTML('afterend',
            `<div class="mdw-card__actions">
              <button class="mdw-button" mdw-theme-color="accent">Action 1</button>
              <button class="mdw-button" mdw-theme-color="accent">Action 2</button>
              <span></span>
              <button class="mdw-button material-icons" mdw-icon>more_vert</button>
            </div>`);
        }
      } else {
        if (actionsElement) {
          actionsElement.parentElement.removeChild(actionsElement);
        }
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
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-card');
  mediaElement = sampleComponent.getElementsByClassName('mdw-card__media')[0];
  attachEventListener(
    document.querySelectorAll('input[name]'),
    'change',
    onOptionChange
  );
}

setupComponentOptions();
updateSampleCode();
