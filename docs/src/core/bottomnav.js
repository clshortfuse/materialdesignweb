import setupImageTargets from '../targetHandler';
import { Bottomnav, BottomnavItem } from '../../../components/core/bottomnav/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-bottomnav');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Bottomnav(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-bottomnav__item');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new BottomnavItem(components[i]));
  }
}

initializeMdwComponents();
setupImageTargets();

