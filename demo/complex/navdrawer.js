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
      case "temporary":
        navElement.removeAttribute('mdw-clipped');
        navElement.removeAttribute('mdw-floating');
        navElement.setAttribute('mdw-temporary', '');
        return;
      case "clipped":
        navElement.setAttribute('mdw-clipped', '');
        navElement.removeAttribute('mdw-floating');
        navElement.removeAttribute('mdw-temporary');
        return;
      case "floating":
        navElement.removeAttribute('mdw-clipped');
        navElement.setAttribute('mdw-floating', '');
        navElement.removeAttribute('mdw-temporary');
        return;
      case "floatingcard":
        navElement.removeAttribute('mdw-clipped');
        navElement.setAttribute('mdw-floating', 'card');
        navElement.removeAttribute('mdw-temporary');
        return;
      default:
      case "fullheight":
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
  const navdrawerDrawerRows = navdrawerDrawer.getElementsByClassName('mdw-list__row');

  /**
   * @param {NodeListOf<Element>} rows
   * @return {Element}
   */
  function getSelectedRow(rows) {
    for (let i = 0; i < rows.length; i += 1) {
      if (rows[i].hasAttribute('selected')) {
        return rows[i];
      }
    }
    return null;
  }
  for (let i = 0; i < navdrawerDrawerRows.length; i += 1) {
    const row = navdrawerDrawerRows[i];
    row.addEventListener('click', () => {
      if (row.hasAttribute('selected')) {
        return;
      }
      const currentlySelected = getSelectedRow(navdrawerDrawerRows);
      if (currentlySelected) {
        currentlySelected.removeAttribute('selected');
      }
      row.setAttribute('selected', '');
    });
  }
}

configureNavDrawer();
setupImageTargets();
