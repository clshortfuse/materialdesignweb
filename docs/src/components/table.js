import { Button } from '../../../components/button/index';
import { Table } from '../../../components/table/index';
import { Menu } from '../../../components/menu/index';
import { setupMenuOptions } from '../menuoptions';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-table');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Table(components.item(i)));
  }
  components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    Button.attach(components.item(i));
  }
  components = document.querySelectorAll('.js .mdw-menu');
  for (let i = 0; i < components.length; i += 1) {
    Menu.attach(components.item(i));
  }
}

/** @return {void} */
function buildDynamicTable() {
  /** @type {Table} */
  const table = componentMap.get(document.getElementById('dynamic-table'));
  table.addColumn({
    key: 'selected',
    type: 'checkbox',
    rowSelector: true,
  });
  table.addColumn({
    key: 'text',
    name: 'Primary Column (full-width)',
    primaryColumn: true,
    sortable: true,
    type: 'text',
  });
  table.addColumn({
    key: 'text2',
    name: 'Text field',
    sortable: true,
    type: 'text',
  });
  table.addColumn({
    key: 'check1',
    name: 'bool',
    type: 'checkbox',
    tooltip: 'Non-selection boolean value',
    sortable: true,
  });
  table.addColumn({
    key: 'increment',
    name: 'Increment',
    type: 'number',
    sortable: true,
  });
  table.addColumn({
    key: 'random',
    name: 'Random',
    sortable: true,
    type: 'number',
  });
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
  table.setDatasource(datasource);
  table.setUseLazyRendering(true);
  table.setPagination();
  table.refresh();
  const buttons = table.element.querySelectorAll('.mdw-table__header-controls .mdw-button');
  const filterButton = buttons[0];
  const optionsButton = buttons[1];
  const menus = table.element.querySelectorAll('.mdw-table__header-controls .mdw-menu');
  const filterMenu = menus[0];
  const optionsMenu = menus[1];

  filterButton.addEventListener('click', (event) => {
    Menu.show(filterMenu, event);
  });
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
    for (let i = 0; i < menuItems.length; i += 1) {
      const menuItem = menuItems.item(i);
      if (checkedIndex === i) {
        menuItem.setAttribute('mdw-checked', '');
      } else {
        menuItem.removeAttribute('mdw-checked');
      }
    }
  }
  noFilterMenuItem.addEventListener('click', () => {
    table.setFilter(null);
    table.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 0);
    filterButton.setAttribute('mdw-inactive', '');
    filterButton.removeAttribute('mdw-active');
  });
  mdFilterMenuItem.addEventListener('click', () => {
    table.setFilter(data => data.text.indexOf('md') !== -1 || data.text2.indexOf('md') !== -1);
    table.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 1);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });
  randomDivBy9MenuItem.addEventListener('click', () => {
    table.setFilter(data => data.random % 9 === 0);
    table.refresh();
    Menu.hide(filterMenu);
    setMenuChecked(filterMenuItems, 2);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });
  checkedFilterMenuItem.addEventListener('click', () => {
    table.setFilter(data => data.check1);
    table.refresh();
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
      table.setUseLazyRendering(false);
      throttleMenuItem.removeAttribute('mdw-checked');
    } else {
      table.setUseLazyRendering(true);
      throttleMenuItem.setAttribute('mdw-checked', '');
    }
    Menu.hide(optionsMenu);
    table.refresh();
  });
  paginateMenuItem.addEventListener('click', () => {
    if (paginateMenuItem.hasAttribute('mdw-checked')) {
      table.setPagination({ disabled: true });
      paginateMenuItem.removeAttribute('mdw-checked');
    } else {
      table.setPagination();
      paginateMenuItem.setAttribute('mdw-checked', '');
    }
    Menu.hide(optionsMenu);
    table.refresh();
  });
}

initializeMdwComponents();
setupMenuOptions();
buildDynamicTable();
