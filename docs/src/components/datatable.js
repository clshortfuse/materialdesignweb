import { iterateArrayLike } from '../../../components/common/dom';
import { Button } from '../../../components/button/index';
import { DataTable } from '../../../components/datatable/index';
import { Menu } from '../../../components/menu/index';
import { DataTableAdapter } from '../../../adapters/datatable/index';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.getElementsByClassName('mdw-datatable'), DataTable.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-button'), Button.attach);
  iterateArrayLike(document.getElementsByClassName('mdw-menu'), Menu.attach);
}


/** @type {DataTableAdapter} */
let dynamicTableAdapter = null;
/** @return {void} */
function buildDynamicTable() {
  const datasource = [];
  let count = 1;
  const addDatasourceObject = () => {
    datasource.push({
      text: Math.random().toString(36).substring(2),
      text2: Math.random().toString(36).substring(2),
      check1: Math.random() > 0.5,
      increment: count,
      random: Math.floor(Math.random() * 99999),
    });
    count += 1;
  };
  for (let i = 0; i < 256; i += 1) {
    addDatasourceObject();
  }

  const datatable = document.getElementById('dynamic-table');
  dynamicTableAdapter = new DataTableAdapter({ datatable, datasource });
  dynamicTableAdapter.addColumn({
    key: 'selected',
    type: 'checkbox',
    rowSelector: true,
  });
  dynamicTableAdapter.addColumn({
    key: 'text',
    name: 'Primary Column (full-width)',
    primaryColumn: true,
    sortable: true,
    type: 'text',
  });
  dynamicTableAdapter.addColumn({
    key: 'text2',
    name: 'Text field',
    sortable: true,
    type: 'text',
  });
  dynamicTableAdapter.addColumn({
    key: 'check1',
    name: 'bool',
    type: 'checkbox',
    tooltip: 'Non-selection boolean value',
    sortable: true,
  });
  dynamicTableAdapter.addColumn({
    key: 'increment',
    name: 'Increment',
    type: 'number',
    sortable: true,
  });
  dynamicTableAdapter.addColumn({
    key: 'random',
    name: 'Random',
    sortable: true,
    type: 'number',
  });
  dynamicTableAdapter.setUseLazyRendering(true);
  dynamicTableAdapter.setPagination();
  dynamicTableAdapter.refresh();
  const buttons = dynamicTableAdapter.element.querySelectorAll('.mdw-datatable__header-controls .mdw-button');
  const filterButton = buttons[0];
  const optionsButton = buttons[1];
  const menus = dynamicTableAdapter.element.querySelectorAll('.mdw-datatable__header-controls .mdw-menu');
  const filterMenu = menus[0];
  const optionsMenu = menus[1];

  filterButton.addEventListener('click', (event) => {
    Menu.show(filterMenu, event);
  });

  // Prefer NodeList instead of HTMLCollection
  const filterMenuItems = filterMenu.querySelectorAll('.mdw-menu__item');
  const noFilterMenuItem = filterMenuItems[0];
  const mdFilterMenuItem = filterMenuItems[1];
  const randomDivBy9MenuItem = filterMenuItems[2];
  const checkedFilterMenuItem = filterMenuItems[3];

  /**
   * @param {NodeListOf<Element>} menuItems
   * @param {number} checkedIndex
   * @return {void}
   */
  function setMenuChecked(menuItems, checkedIndex) {
    iterateArrayLike(menuItems, (menuItem, index) => {
      if (checkedIndex === index) {
        menuItem.setAttribute('mdw-checked', '');
      } else {
        menuItem.removeAttribute('mdw-checked');
      }
    });
  }
  noFilterMenuItem.addEventListener('click', () => {
    dynamicTableAdapter.setFilter(null);
    dynamicTableAdapter.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 0);
    filterButton.setAttribute('mdw-inactive', '');
    filterButton.removeAttribute('mdw-active');
  });
  mdFilterMenuItem.addEventListener('click', () => {
    dynamicTableAdapter.setFilter(data => data.text.indexOf('md') !== -1 || data.text2.indexOf('md') !== -1);
    dynamicTableAdapter.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 1);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });
  randomDivBy9MenuItem.addEventListener('click', () => {
    dynamicTableAdapter.setFilter(data => data.random % 9 === 0);
    dynamicTableAdapter.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 2);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });
  checkedFilterMenuItem.addEventListener('click', () => {
    dynamicTableAdapter.setFilter(data => data.check1);
    dynamicTableAdapter.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 3);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });

  const menuItems = optionsMenu.querySelectorAll('.mdw-menu__item');
  const throttleMenuItem = menuItems[0];
  const paginateMenuItem = menuItems[1];
  optionsButton.addEventListener('click', (event) => {
    Menu.show(optionsMenu, event);
  });
  throttleMenuItem.addEventListener('click', () => {
    if (throttleMenuItem.hasAttribute('mdw-checked')) {
      dynamicTableAdapter.setUseLazyRendering(false);
      throttleMenuItem.removeAttribute('mdw-checked');
    } else {
      dynamicTableAdapter.setUseLazyRendering(true);
      throttleMenuItem.setAttribute('mdw-checked', '');
    }
    Menu.hide(optionsMenu);
    dynamicTableAdapter.refresh();
  });
  paginateMenuItem.addEventListener('click', () => {
    if (paginateMenuItem.hasAttribute('mdw-checked')) {
      dynamicTableAdapter.setPagination({ disabled: true });
      paginateMenuItem.removeAttribute('mdw-checked');
    } else {
      dynamicTableAdapter.setPagination();
      paginateMenuItem.setAttribute('mdw-checked', '');
    }
    Menu.hide(optionsMenu);
    dynamicTableAdapter.refresh();
  });
}

initializeMdwComponents();
buildDynamicTable();
