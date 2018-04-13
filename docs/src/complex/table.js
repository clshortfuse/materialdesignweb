import { Button } from '../../../components/core/button/index';
import { Table } from '../../../components/complex/table/index';
import { Menu } from '../../../components/core/menu/index';

const componentMap = new WeakMap();

/** @return {void} */
function initializeMdwComponents() {
  let components;
  components = document.querySelectorAll('.js .mdw-table');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Table(components[i]));
  }
  components = document.querySelectorAll('.js .mdw-button');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Button(components[i]));
  }
  components = document.querySelectorAll('.js .mdw-menu');
  for (let i = 0; i < components.length; i += 1) {
    componentMap.set(components[i], new Menu(components[i]));
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
  const [filterButton, optionsButton] = table.element.querySelectorAll('.mdw-table__header-controls .mdw-button');
  const [filterMenu, optionsMenu] = [...table.element.querySelectorAll('.mdw-table__header-controls .mdw-menu')]
    .map(element => componentMap.get(element));

  filterButton.addEventListener('click', (event) => {
    filterMenu.show(event);
  });
  const filterMenuItems = filterMenu.element.querySelectorAll('.mdw-menu__item');
  const [
    noFilterMenuItem,
    mdFilterMenuItem,
    randomDivBy9MenuItem,
    checkedFilterMenuItem,
  ] = filterMenuItems;
  /**
   * @param {HTMLElement[]} menuItems
   * @param {number} checkedIndex
   * @return {void}
   */
  function setMenuChecked(menuItems, checkedIndex) {
    menuItems.forEach((value, index) => {
      if (checkedIndex === index) {
        value.setAttribute('mdw-checked', '');
      } else {
        value.removeAttribute('mdw-checked');
      }
    });
  }
  noFilterMenuItem.addEventListener('click', () => {
    table.setFilter(null);
    table.refresh();
    filterMenu.hide();
    setMenuChecked(filterMenuItems, 0);
    filterButton.setAttribute('mdw-inactive', '');
    filterButton.removeAttribute('mdw-active');
  });
  mdFilterMenuItem.addEventListener('click', () => {
    table.setFilter(data => data.text.indexOf('md') !== -1 || data.text2.indexOf('md') !== -1);
    table.refresh();
    filterMenu.hide();
    setMenuChecked(filterMenuItems, 1);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });
  randomDivBy9MenuItem.addEventListener('click', () => {
    table.setFilter(data => data.random % 9 === 0);
    table.refresh();
    filterMenu.hide();
    setMenuChecked(filterMenuItems, 2);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });
  checkedFilterMenuItem.addEventListener('click', () => {
    table.setFilter(data => data.check1);
    table.refresh();
    filterMenu.hide();
    setMenuChecked(filterMenuItems, 3);
    filterButton.setAttribute('mdw-active', '');
    filterButton.removeAttribute('mdw-inactive');
  });

  const [throttleMenuItem, paginateMenuItem] = optionsMenu.element.querySelectorAll('.mdw-menu__item');
  optionsButton.addEventListener('click', (event) => {
    optionsMenu.show(event);
  });
  throttleMenuItem.addEventListener('click', () => {
    if (throttleMenuItem.hasAttribute('mdw-checked')) {
      table.setUseLazyRendering(false);
      throttleMenuItem.removeAttribute('mdw-checked');
    } else {
      table.setUseLazyRendering(true);
      throttleMenuItem.setAttribute('mdw-checked', '');
    }
    optionsMenu.hide();
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
    optionsMenu.hide();
    table.refresh();
  });
}

initializeMdwComponents();
buildDynamicTable();
