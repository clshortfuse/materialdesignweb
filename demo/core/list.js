import setupImageTargets from '../targetHandler';
import { List, ListRow } from '../../components/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-list');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new List(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-list__row');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new ListRow(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();
