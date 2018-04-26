import setupImageTargets from '../targetHandler';
import { TextField } from '../../../components/textfield/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function initializeMdwComponents() {
  const textfields = document.querySelectorAll('.js .mdw-textfield');
  for (let i = 0; i < textfields.length; i += 1) {
    TextField.attach(textfields.item(i));
  }
}

initializeMdwComponents();
setupMenuOptions();
setupImageTargets();
