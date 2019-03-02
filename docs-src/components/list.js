import { List } from '../../components/list/index';
import { iterateArrayLike } from '../../components/common/dom';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-list'), List.attach);
}

initializeMdwComponents();
