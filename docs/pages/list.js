import * as List from '../../components/list/index.js';

/** @return {void} */
function initializeMdwComponents() {
  for (const element of document.querySelectorAll('.js .mdw-list')) List.attach(element);
}

initializeMdwComponents();
