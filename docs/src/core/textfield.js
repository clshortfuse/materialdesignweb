import setupImageTargets from '../targetHandler';
import { TextField } from '../../../components/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  const components = document.querySelectorAll('.js .mdw-textfield');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new TextField(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();
