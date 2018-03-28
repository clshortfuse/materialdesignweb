import setupImageTargets from '../targetHandler';
import { Tab, TabAction } from '../../components/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-tab');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Tab(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-tab__action');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new TabAction(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();
