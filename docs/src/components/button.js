import setupImageTargets from '../targetHandler';
import { Button } from '../../../components/button/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function initializeMdwComponents() {
  const buttons = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < buttons.length; i += 1) {
    Button.attach(buttons.item(i));
  }
}

initializeMdwComponents();
setupMenuOptions();
setupImageTargets();

