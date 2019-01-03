import { List } from '../../../components/list/index';
import { iterateArrayLike, iterateSomeOfArrayLike } from '../../../components/common/dom';

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
  iterateArrayLike(document.querySelectorAll('input[name="mdw-navdrawer__style"]'),
    el => el.addEventListener('change', onStyleSelected));

  iterateArrayLike(document.querySelectorAll('input[name="mdw-navdrawer__toggle"]'),
    el => el.addEventListener('change', onToggleSelected));

  const navdrawerDrawer = document.querySelector('#navdrawer .mdw-navdrawer__drawer');
  const navdrawerDrawerListItems = navdrawerDrawer.getElementsByClassName('mdw-list__item');

  /**
   * @param {ArrayLike<Element>} items
   * @return {Element}
   */
  function getSelectedListItem(items) {
    let listItem = null;
    iterateSomeOfArrayLike(items, (item) => {
      if (!item.hasAttribute('mdw-selected')) {
        return false;
      }
      listItem = item;
      return true;
    });
    return listItem;
  }
  /**
   * @param {MouseEvent} event
   * @return {void}
   */
  function onNavDrawerListItemClick(event) {
    /** @type {HTMLElement} */
    const item = (event.currentTarget);
    if (item.hasAttribute('mdw-selected')) {
      return;
    }
    const currentlySelected = getSelectedListItem(navdrawerDrawerListItems);
    if (currentlySelected) {
      currentlySelected.removeAttribute('mdw-selected');
    }
    item.setAttribute('mdw-selected', '');
  }
  iterateArrayLike(navdrawerDrawerListItems, (item) => {
    item.addEventListener('click', onNavDrawerListItemClick);
  });
}

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('#navdrawer .mdw-list'), List.attach);
}

initializeMdwComponents();
configureNavDrawer();
