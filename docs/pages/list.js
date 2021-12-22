import * as List from '../../components/list/index.js';
import { iterateArrayLike } from '../../core/dom.js';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-list'), List.attach);
}

initializeMdwComponents();
