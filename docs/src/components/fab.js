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
  document.querySelector('input[name="hover"]').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      document.querySelector('.js .mdw-fab__speed-dial').setAttribute('mdw-hover', '');
    } else {
      document.querySelector('.js .mdw-fab__speed-dial').removeAttribute('mdw-hover');
    }
  });
  document.querySelector('input[name="type"][value="regular"]').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      document.querySelector('.js .mdw-fab__button').removeAttribute('mdw-mini');
      document.querySelector('.js .mdw-fab__button').removeAttribute('mdw-extended');
    }
  });
  document.querySelector('input[name="type"][value="mini"]').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      document.querySelector('.js .mdw-fab__button').setAttribute('mdw-mini', '');
      document.querySelector('.js .mdw-fab__button').removeAttribute('mdw-extended');
    }
  });
  document.querySelector('input[name="type"][value="extended"]').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      document.querySelector('.js .mdw-fab__button').removeAttribute('mdw-mini');
      document.querySelector('.js .mdw-fab__button').setAttribute('mdw-extended', '');
    }
  });
  document.querySelector('input[name="type"][value="extended-hover"]').addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      document.querySelector('.js .mdw-fab__button').removeAttribute('mdw-mini');
      document.querySelector('.js .mdw-fab__button').setAttribute('mdw-extended', 'hover');
    }
  });
}

initializeMdwComponents();
setupMenuOptions();
