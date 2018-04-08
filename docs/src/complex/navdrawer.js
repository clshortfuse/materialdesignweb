import setupImageTargets from '../targetHandler';

/** @return {void} */
function configureNavDrawer() {
  const navElement = document.querySelector('#navdrawer');
  /**
   * @param {Event} event
   * @return {void}
   */
  function onSelected(event) {
    switch (event.target.value) {
      case 'temporary':
        navElement.removeAttribute('mdw-clipped');
        navElement.removeAttribute('mdw-floating');
        navElement.setAttribute('mdw-temporary', '');
        return;
      case 'clipped':
        navElement.setAttribute('mdw-clipped', '');
        navElement.removeAttribute('mdw-floating');
        navElement.removeAttribute('mdw-temporary');
        return;
      case 'floating':
        navElement.removeAttribute('mdw-clipped');
        navElement.setAttribute('mdw-floating', '');
        navElement.removeAttribute('mdw-temporary');
        return;
      case 'floatingcard':
        navElement.removeAttribute('mdw-clipped');
        navElement.setAttribute('mdw-floating', 'card');
        navElement.removeAttribute('mdw-temporary');
        return;
      default:
      case 'fullheight':
        navElement.removeAttribute('mdw-clipped');
        navElement.removeAttribute('mdw-floating');
        navElement.removeAttribute('mdw-temporary');
    }
  }
  const radioElements = document.querySelectorAll('input[name="mdw-navdrawer__style"]');
  for (let i = 0; i < radioElements.length; i += 1) {
    const element = radioElements[i];
    element.addEventListener('change', onSelected);
  }
  document.querySelector('input[name="mdw-navdrawer__mini"]').addEventListener('change', (event) => {
    if (event.target.checked) {
      navElement.setAttribute('mdw-mini', '');
    } else {
      navElement.removeAttribute('mdw-mini');
    }
  });
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

configureNavDrawer();
setupImageTargets();
