import setupImageTargets from '../targetHandler';
import { Menu, MenuItem } from '../../../components/core/menu/index';
import setupMenuOptions from '../menuoptions';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-menu');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Menu(components[i]));
  }

  components = document.querySelectorAll('.js .mdw-menu__item');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new MenuItem(components[i]));
  }
}

/** @return {void} */
function setupJSButton() {
  const button = document.querySelector('.js .mdw-button');
  const menu = document.querySelector('.js .mdw-menu');
  button.addEventListener('click', () => {
    const mdwMenu = componentMap.get(menu);
    mdwMenu.show();
  });
}

initializeMdwComponents();
setupImageTargets();
setupMenuOptions();
setupJSButton();

