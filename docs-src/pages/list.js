import * as List from '../../components/list/index';
import { iterateArrayLike } from '../../core/dom';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-list'), List.attach);
}

initializeMdwComponents();
