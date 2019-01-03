import { Button } from '../../../components/button/index';
import { Fab } from '../../../components/fab/index';
import { iterateArrayLike } from '../../../components/common/dom';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-fab'), Fab.attach);

  iterateArrayLike(document.querySelectorAll('.js .mdw-button'), Button.attach);

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
