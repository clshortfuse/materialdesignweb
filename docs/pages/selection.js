import * as List from '../../components/list/index.js';
import * as Selection from '../../components/selection/index.js';
import * as SelectionRadioGroup from '../../components/selection/radiogroup.js';
import { iterateArrayLike } from '../../core/dom.js';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.getElementsByClassName('mdw-selection'), Selection.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-selection__radio-group'), SelectionRadioGroup.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-list'), List.attach);
}

initializeMdwComponents();
