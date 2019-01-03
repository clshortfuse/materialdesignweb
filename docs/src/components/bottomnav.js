import { Bottomnav } from '../../../components/bottomnav/index';
import { iterateArrayLike } from '../../../components/common/dom';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.js .mdw-bottomnav'), Bottomnav.attach);
}

initializeMdwComponents();
