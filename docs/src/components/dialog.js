import { Dialog } from '../../../components/dialog/index';
import { setupMenuOptions } from '../menuoptions';
import { changeElementTagName, convertElementToCode, attachEventListener } from '../sample-utils';


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
  button.removeEventListener('click', onSampleButtonClick);
  const tabIndexElements = sampleComponent.querySelectorAll('[tabindex]');
  for (let i = 0; i < tabIndexElements.length; i += 1) {
    tabIndexElements.item(i).removeAttribute('tabindex');
  }

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
    if (button instanceof HTMLAnchorElement) {
      button = changeElementTagName(button, 'button');
    }
    dialogButtons[0].removeAttribute('href');
    if (dialogButtons[0] instanceof HTMLAnchorElement) {
      changeElementTagName(dialogButtons[0], 'button');
    }
    dialogButtons[1].removeAttribute('href');
    if (dialogButtons[1] instanceof HTMLAnchorElement) {
      changeElementTagName(dialogButtons[1], 'button');
    }
  } else {
    sampleComponent.setAttribute('id', 'sample-dialog');
    button.setAttribute('href', '#sample-dialog');
    if (button instanceof HTMLButtonElement) {
      button = changeElementTagName(button, 'a');
    }
    dialogButtons[0].setAttribute('href', '#');
    if (dialogButtons[0] instanceof HTMLButtonElement) {
      changeElementTagName(dialogButtons[0], 'a');
    }
    dialogButtons[1].setAttribute('href', '#');
    if (dialogButtons[1] instanceof HTMLButtonElement) {
      changeElementTagName(dialogButtons[1], 'a');
    }
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
  let mdwPosition = sampleComponent.getAttribute('mdw-position') || '';
  const buttonArea = sampleComponent.getElementsByClassName('mdw-dialog__button-area')[0]
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
  attachEventListener(
    document.querySelectorAll('input[name]'),
    'change',
    onOptionChange
  );
}

/** @return {void} */
function initializeSampleComponents() {
  const button = document.querySelector('.js .mdw-button');
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
  confirmDialogElement.addEventListener('mdw:confirm', () => {
    Dialog.updateBody(alertDialogElement, 'Thanks!');
    Dialog.updateButtonText(alertDialogElement, ['K']);
    Dialog.hide(confirmDialogElement); // Manual hide only necessary when chaining dialogs
    Dialog.show(alertDialogElement);
  });
  confirmDialogElement.addEventListener('mdw:cancel', () => {
    Dialog.updateBody(alertDialogElement, 'Oh...');
    Dialog.updateButtonText(alertDialogElement, ['Sorry!']);
    Dialog.hide(confirmDialogElement); // Manual hide only necessary when chaining dialogs
    Dialog.show(alertDialogElement);
  });
  button.addEventListener('click', (event) => {
    Dialog.show(confirmDialogElement, event);
  });
}

initializeSampleComponents();
setupComponentOptions();
updateSampleCode();


setupMenuOptions();

