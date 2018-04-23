import { Dialog } from '../../../components/complex/dialog/index';
import { setupMenuOptions } from '../menuoptions';
import setupImageTargets from '../targetHandler';

/** @return {void} */
function setupJSDialog() {
  const button = document.querySelector('.js .mdw-button');
  const confirmDialog = Dialog.create({
    title: 'Feedback',
    body: 'Are you enjoying this demo?',
    buttons: ["It's great!", 'Meh.'],
    type: 'confirm',
    parent: document.querySelector('.render div'),
  });
  const alertDialog = Dialog.create({
    body: 'placeholder',
    buttons: ['K'],
    type: 'alert',
    parent: document.querySelector('.render div'),
  });
  confirmDialog.onConfirmListener = (event) => {
    alertDialog.updateBody('Thanks!');
    alertDialog.updateButtonText(['K']);
    alertDialog.show();
  };
  confirmDialog.onCancelListener = (event) => {
    alertDialog.updateBody('Oh...');
    alertDialog.updateButtonText(['Sorry!']);
    alertDialog.show();
  };
  button.addEventListener('click', (event) => {
    confirmDialog.show(event);
  });
}

setupJSDialog();
setupImageTargets();
setupMenuOptions();

