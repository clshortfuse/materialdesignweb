import * as List from '../../components/list/index.js';
import * as Selection from '../../components/selection/index.js';
import * as SelectionRadioGroup from '../../components/selection/radiogroup.js';

/** @return {void} */
function initializeMdwComponents() {
  for (const element of document.getElementsByClassName('mdw-selection')) Selection.attach(element);
  for (const element of document.getElementsByClassName('mdw-selection__radio-group')) SelectionRadioGroup.attach(element);
  for (const element of document.getElementsByClassName('mdw-list')) List.attach(element);
}

initializeMdwComponents();
