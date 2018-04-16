import setupMenuOptions from '../menuoptions';
import { Button } from '../../../components/core/button/index';
import { Fab } from '../../../components/complex/fab/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-fab');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Fab(components[i]));
  }
  components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Button(components[i]));
  }
}

initializeMdwComponents();
setupMenuOptions();
