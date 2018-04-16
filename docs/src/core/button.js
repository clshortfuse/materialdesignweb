import setupImageTargets from '../targetHandler';
import { Button } from '../../../components/core/button/index';
import setupMenuOptions from '../menuoptions';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  const components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Button(components[i]));
  }
}

initializeMdwComponents();
setupMenuOptions();
setupImageTargets();

