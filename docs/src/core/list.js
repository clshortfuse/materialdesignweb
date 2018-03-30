import setupImageTargets from '../targetHandler';
import { List, ListItem } from '../../../components/core/list/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-list');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new List(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-list__item');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new ListItem(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();
