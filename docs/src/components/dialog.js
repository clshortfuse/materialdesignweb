import { Dialog } from '../../../components/dialog/index';
import { setupMenuOptions } from '../menuoptions';
import setupImageTargets from '../targetHandler';

/** @return {void} */
function setupJSDialog() {
  const button = document.querySelector('.js .mdw-button');
  const confirmDialogElement = Dialog.create({
    title: 'Feedback',
    body: 'Are you enjoying this demo?',
    buttons: ["It's great!", 'Meh.'],
    type: 'confirm',
    parent: document.querySelector('.render div'),
  });
  const alertDialogElement = Dialog.create({
    body: 'placeholder',
    buttons: ['K'],
    type: 'alert',
    parent: document.querySelector('.render div'),
  });
  confirmDialogElement.addEventListener('mdw:confirm', () => {
    Dialog.updateBody(alertDialogElement, 'Thanks!');
    Dialog.updateButtonText(alertDialogElement, ['K']);
    Dialog.show(alertDialogElement);
  });
  confirmDialogElement.addEventListener('mdw:cancel', () => {
    Dialog.updateBody(alertDialogElement, 'Oh...');
    Dialog.updateButtonText(alertDialogElement, ['Sorry!']);
    Dialog.show(alertDialogElement);
  });
  button.addEventListener('click', (event) => {
    Dialog.show(confirmDialogElement, event);
  });
}

setupJSDialog();
setupImageTargets();
setupMenuOptions();

