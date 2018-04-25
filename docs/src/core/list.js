import setupImageTargets from '../targetHandler';
import { List } from '../../../components/core/list/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function initializeMdwComponents() {
  const lists = document.querySelectorAll('.js .mdw-list');
  for (let i = 0; i < lists.length; i += 1) {
    List.attach(lists.item(i));
  }
}

initializeMdwComponents();
setupMenuOptions();
setupImageTargets();
