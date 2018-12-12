import { List } from '../../../components/list/index';

/** @return {void} */
function configureNavDrawer() {
  const navElement = document.querySelector('#navdrawer');
  /**
   * @param {Event} event
   * @return {void}
   */
  function onStyleSelected(event) {
    switch (event.target.value) {
      case 'modal':
        navElement.removeAttribute('mdw-clipped');
        navElement.removeAttribute('mdw-floating');
        navElement.setAttribute('mdw-modal', '');
        return;
      case 'clipped':
        navElement.setAttribute('mdw-clipped', '');
        navElement.removeAttribute('mdw-floating');
        navElement.removeAttribute('mdw-modal');
        return;
      case 'floating':
        navElement.removeAttribute('mdw-clipped');
        navElement.setAttribute('mdw-floating', '');
        navElement.removeAttribute('mdw-modal');
        return;
      case 'floatingcard':
        navElement.removeAttribute('mdw-clipped');
        navElement.setAttribute('mdw-floating', 'card');
        navElement.removeAttribute('mdw-modal');
        return;
      default:
      case 'fullheight':
        navElement.removeAttribute('mdw-clipped');
        navElement.removeAttribute('mdw-floating');
        navElement.removeAttribute('mdw-modal');
    }
  }
  /**
   * @param {Event} event
   * @return {void}
   */
  function onToggleSelected(event) {
    switch (event.target.value) {
      case 'dismissible':
        navElement.setAttribute('mdw-dismissible', '');
        navElement.removeAttribute('mdw-mini');
        return;
      case 'mini':
        navElement.removeAttribute('mdw-dismissible');
        navElement.setAttribute('mdw-mini', '');
        return;
      default:
      case 'none':
        navElement.removeAttribute('mdw-dismissible');
        navElement.removeAttribute('mdw-mini');
    }
  }
  const styleRadioElements = document.querySelectorAll('input[name="mdw-navdrawer__style"]');
  for (let i = 0; i < styleRadioElements.length; i += 1) {
    const element = styleRadioElements[i];
    element.addEventListener('change', onStyleSelected);
  }
  const toggleRadioElements = document.querySelectorAll('input[name="mdw-navdrawer__toggle"]');
  for (let i = 0; i < toggleRadioElements.length; i += 1) {
    const element = toggleRadioElements[i];
    element.addEventListener('change', onToggleSelected);
  }
  const navdrawerDrawer = document.querySelector('#navdrawer .mdw-navdrawer__drawer');
  const navdrawerDrawerListItems = navdrawerDrawer.getElementsByClassName('mdw-list__item');

  /**
   * @param {NodeListOf<Element>} items
   * @return {Element}
   */
  function getSelectedListItem(items) {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].hasAttribute('mdw-selected')) {
        return items[i];
      }
    }
    return null;
  }
  for (let i = 0; i < navdrawerDrawerListItems.length; i += 1) {
    const item = navdrawerDrawerListItems[i];
    item.addEventListener('click', () => {
      if (item.hasAttribute('mdw-selected')) {
        return;
      }
      const currentlySelected = getSelectedListItem(navdrawerDrawerListItems);
      if (currentlySelected) {
        currentlySelected.removeAttribute('mdw-selected');
      }
      item.setAttribute('mdw-selected', '');
    });
  }
}

/** @return {void} */
function initializeMdwComponents() {
  const lists = document.querySelectorAll('#navdrawer .mdw-list');
  for (let i = 0; i < lists.length; i += 1) {
    List.attach(lists.item(i));
  }
}

initializeMdwComponents();
configureNavDrawer();
