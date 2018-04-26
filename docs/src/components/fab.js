import { setupMenuOptions } from '../menuoptions';
import { Button } from '../../../components/button/index';
import { Fab } from '../../../components/fab/index';

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-fab');
  for (let i = 0; i < components.length; i += 1) {
    Fab.attach(components.item(i));
  }
  components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    Button.attach(components.item(i));
  }
}

initializeMdwComponents();
setupMenuOptions();
