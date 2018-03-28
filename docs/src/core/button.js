import setupImageTargets from '../targetHandler';
import { Button } from '../../../components/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  const components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Button(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();

