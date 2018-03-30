import setupImageTargets from '../targetHandler';
import { Tab, TabItem } from '../../../components/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-tab');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Tab(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-tab__item');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new TabItem(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();
