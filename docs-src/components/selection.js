import { List } from '../../components/list/index';
import { iterateArrayLike } from '../../components/common/dom';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.getElementsByClassName('mdw-list'), List.attach);
}

initializeMdwComponents();
