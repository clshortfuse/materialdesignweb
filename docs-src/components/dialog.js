import * as Button from '../../components/button/index';
import * as Dialog from '../../components/dialog/index';
import { iterateArrayLike } from '../../core/dom';
import { changeElementTagName, convertElementToCode } from '../_sample-utils';


/** @type {HTMLElement} */
let sampleComponent;

/**
 * @param {MouseEvent} event
 * @return {void}
 */
function onSampleButtonClick(event) {
  Dialog.show(sampleComponent, event);
}

/** @return {void} */
function updateSampleCode() {
  const jsRequired = document.querySelector('input[name="javascript"][value="required"]').checked;
  const jsOptional = document.querySelector('input[name="javascript"][value="optional"]').checked;
  const useJS = jsRequired || jsOptional;

  // Strip JS related elements and attributes
  Dialog.detach(sampleComponent);
  let button = document.querySelector('.component-sample .mdw-button');
  let closer = document.querySelector('.component-sample .mdw-dialog__close');
  const dialogButtons = sampleComponent.querySelectorAll('.mdw-dialog__button-area .mdw-button');
  Button.detach(button);
  button.removeEventListener('click', onSampleButtonClick);
  const tabIndexElements = sampleComponent.querySelectorAll('[tabindex]');
  iterateArrayLike(tabIndexElements, el => el.removeAttribute('tabindex'));

  if (closer) {
    if (jsRequired || (closer instanceof HTMLAnchorElement === false)) {
      closer.parentElement.removeChild(closer);
      closer = null;
    }
  }

  if (useJS) {
    dialogButtons[0].setAttribute('mdw-autofocus', '');
  } else {
    dialogButtons[0].removeAttribute('mdw-autofocus');
  }

  if (jsRequired) {
    sampleComponent.removeAttribute('id');
    button.removeAttribute('href');
    dialogButtons[0].removeAttribute('href');
    dialogButtons[1].removeAttribute('href');
  } else {
    sampleComponent.setAttribute('id', 'sample-dialog');
    button.setAttribute('href', '#sample-dialog');
    dialogButtons[0].setAttribute('href', '#');
    dialogButtons[1].setAttribute('href', '#');
    if (!closer) {
      closer = document.createElement('a');
      closer.classList.add('mdw-dialog__close');
      closer.setAttribute('href', '#');
      sampleComponent.insertBefore(closer, sampleComponent.firstElementChild);
    }
  }


  const htmlCodeElement = document.getElementsByClassName('component-html')[0];
  const sampleContainer = document.querySelector('.component-sample__container');
  const htmlCodeBlocks = [];
  let el = sampleContainer.firstElementChild;
  while (el) {
    const htmlCode = convertElementToCode(el).trim();
    if (htmlCode) {
      htmlCodeBlocks.push(htmlCode);
    }
    el = el.nextElementSibling;
  }
  htmlCodeElement.textContent = htmlCodeBlocks.join('\n');

  // Reattach JS if requested
  if (useJS) {
    Dialog.attach(sampleComponent);
    Button.attach(button);
    button.addEventListener('click', onSampleButtonClick);
  }

  const jsCodeElement = document.getElementsByClassName('component-js')[0];
  jsCodeElement.textContent = [
    "buttonElement.addEventListener('click', (event) => {",
    '  mdw.Dialog.show(dialogElement, event);',
    '});',
  ].join('\n');
}

/**
 * @param {Event} event
 * @return {void}
 */
function onOptionChange(event) {
  const { name, value, checked } = event.target;
  const buttonArea = sampleComponent.getElementsByClassName('mdw-dialog__button-area')[0];
  switch (name) {
    case 'stacked-buttons':
      if (checked) {
        buttonArea.setAttribute('mdw-stacked', '');
      } else {
        buttonArea.removeAttribute('mdw-stacked');
      }
      break;
    case 'width':
      switch (value) {
        case 'auto':
          sampleComponent.removeAttribute('mdw-width-units');
          break;
        default:
          sampleComponent.setAttribute('mdw-width-units', value);
          break;
      }
      break;
    default:
  }
  updateSampleCode();
}

/** @return {void} */
function setupComponentOptions() {
  sampleComponent = document.querySelector('.component-sample .mdw-dialog');
  iterateArrayLike(document.querySelectorAll('input[name]'), (el) => {
    el.addEventListener('change', onOptionChange);
  });
}

/** @return {void} */
function initializeSampleComponents() {
  const button = document.querySelector('.js .mdw-button');
  Button.attach(button);
  const confirmDialogElement = Dialog.create({
    title: 'Feedback',
    body: 'Are you enjoying this demo?',
    buttons: ["It's great!", 'Meh.'],
    parent: document.querySelector('.render div'),
  });
  const alertDialogElement = Dialog.create({
    body: 'placeholder',
    buttons: ['K'],
    parent: document.querySelector('.render div'),
  });
  confirmDialogElement.addEventListener(Dialog.CONFIRM_EVENT, () => {
    Dialog.updateBody(alertDialogElement, 'Thanks!');
    Dialog.updateButtonText(alertDialogElement, ['K']);
    Dialog.show(alertDialogElement);
  });
  confirmDialogElement.addEventListener(Dialog.CANCEL_EVENT, () => {
    Dialog.updateBody(alertDialogElement, 'Oh...');
    Dialog.updateButtonText(alertDialogElement, ['Sorry!']);
    Dialog.show(alertDialogElement);
  });
  button.addEventListener('click', (event) => {
    Dialog.show(confirmDialogElement, event);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();
