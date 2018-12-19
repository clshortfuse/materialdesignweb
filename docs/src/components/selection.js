import { List } from '../../../components/list/index';

/** @return {void} */
function initializeMdwComponents() {
  const lists = document.getElementsByClassName('mdw-list');
  for (let i = 0; i < lists.length; i += 1) {
    List.attach(lists.item(i));
  }
}

initializeMdwComponents();
