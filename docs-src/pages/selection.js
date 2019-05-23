import * as Selection from '../../components/selection/index';
import * as SelectionRadioGroup from '../../components/selection/radiogroup';
import * as List from '../../components/list/index';
import { iterateArrayLike } from '../../core/dom';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.getElementsByClassName('mdw-selection'), Selection.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-selection__radio-group'), SelectionRadioGroup.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-list'), List.attach);
}

initializeMdwComponents();
