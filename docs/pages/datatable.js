import DataTableAdapter from '../../adapters/datatable/index.js';
import * as Button from '../../components/button/index.js';
import * as DataTable from '../../components/datatable/index.js';
import * as Menu from '../../components/menu/index.js';
import * as MenuItem from '../../components/menu/item.js';
import * as Selection from '../../components/selection/index.js';

/** @return {void} */
function initializeMdwComponents() {
  for (const element of document.querySelectorAll('.mdw-datatable.js')) { DataTable.attach(element); }
  for (const element of document.getElementsByClassName('mdw-button')) { Button.attach(element); }
  for (const element of document.getElementsByClassName('mdw-selection')) { Selection.attach(element); }
  for (const element of document.getElementsByClassName('mdw-menu')) { Menu.attach(element); }
}

/**
 * @typedef {Object} CustomData
 * @prop {boolean} selected
 * @prop {string} text
 * @prop {string} text2
 * @prop {boolean} check1
 * @prop {number} increment
 * @prop {number} random
 */

/** @type {DataTableAdapter<CustomData>} */
let dynamicTableAdapter = null;
/** @return {void} */
function buildDynamicTable() {
  /** @type {CustomData[]} */
  const datasource = [];
  let count = 1;
  const addDatasourceObject = () => {
    datasource.push({
      selected: false,
      text: Math.random().toString(36).slice(2),
      text2: Math.random().toString(36).slice(2),
      check1: Math.random() > 0.5,
      increment: count,
      random: Math.floor(Math.random() * 99_999),
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
  Menu.attach(filterMenu);
  Menu.attach(optionsMenu);

  filterButton.addEventListener('click', (/** @type {MouseEvent} */ event) => Menu.show(filterMenu, event));
  optionsButton.addEventListener('click', (/** @type {MouseEvent} */ event) => Menu.show(optionsMenu, event));

  filterMenu.addEventListener(MenuItem.CHECK_EVENT, (event) => {
    const menuItem = /** @type {HTMLElement} */ (event.target);
    switch (menuItem.dataset.filter) {
      default:
      case 'none':
        dynamicTableAdapter.setFilter(null);
        break;
      case 'md':
        dynamicTableAdapter.setFilter((data) => data.text.includes('md') || data.text2.includes('md'));
        break;
      case 'div9':
        dynamicTableAdapter.setFilter((data) => data.random % 9 === 0);
        break;
      case 'bool':
        dynamicTableAdapter.setFilter((data) => data.check1);
        break;
    }
    dynamicTableAdapter.refresh();
    if (dynamicTableAdapter.filter) {
      filterButton.setAttribute('aria-pressed', 'true');
    } else {
      filterButton.setAttribute('aria-pressed', 'false');
    }
  });
  filterMenu.addEventListener(MenuItem.ACTIVATE_EVENT, () => Menu.hide(filterMenu));

  optionsMenu.addEventListener(MenuItem.CHECK_EVENT, (event) => {
    const menuItem = /** @type {HTMLElement} */ (event.target);
    switch (menuItem.dataset.option) {
      default:
        break;
      case 'throttle':
        dynamicTableAdapter.setUseLazyRendering(true);
        break;
      case 'paginate':
        dynamicTableAdapter.setPagination();
        break;
    }
    dynamicTableAdapter.refresh();
  });
  optionsMenu.addEventListener(MenuItem.UNCHECK_EVENT, (event) => {
    const menuItem = /** @type {HTMLElement} */ (event.target);
    switch (menuItem.dataset.option) {
      default:
        break;
      case 'throttle':
        dynamicTableAdapter.setUseLazyRendering(false);
        break;
      case 'paginate':
        dynamicTableAdapter.setPagination({ disabled: true });
        break;
    }
    dynamicTableAdapter.refresh();
  });
  optionsMenu.addEventListener(MenuItem.ACTIVATE_EVENT, () => Menu.hide(optionsMenu));
}

initializeMdwComponents();
buildDynamicTable();
