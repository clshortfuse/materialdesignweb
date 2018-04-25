import setupImageTargets from '../targetHandler';
import { Menu } from '../../../components/core/menu/index';
import { setupMenuOptions } from '../menuoptions';

/** @return {void} */
function setMenuButtons() {
  const menuItems = document.querySelectorAll('.js .mdw-menu__item');
  for (let i = 0; i < menuItems.length; i += 1) {
    const menuItem = menuItems.item(i);
    const menu = menuItem.parentElement;
    menuItem.addEventListener('click', () => {
      if (menuItem.hasAttribute('disabled')) {
        return;
      }
      Menu.hide(menu);
    });
  }
}

/** @return {void} */
function setupJSButton() {
  const button = document.querySelector('.js .mdw-button');
  const menu = document.querySelector('.js .mdw-menu');
  button.addEventListener('click', (event) => {
    Menu.show(menu, event);
  });
}

setMenuButtons();
setupImageTargets();
setupMenuOptions();
setupJSButton();

