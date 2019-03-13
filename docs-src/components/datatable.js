import { iterateArrayLike } from '../../components/common/dom';
import { Button } from '../../components/button/index';
import { DataTable } from '../../components/datatable/index';
import { Menu, MenuItem } from '../../components/menu/index';
import { DataTableAdapter } from '../../adapters/datatable/index';

/** @return {void} */
function initializeMdwComponents() {
  iterateArrayLike(document.querySelectorAll('.mdw-datatable.js'), DataTable.attach);
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
  Menu.attach(filterMenu);
  Menu.attach(optionsMenu);

  filterButton.addEventListener('click', event => Menu.show(filterMenu, event));
  optionsButton.addEventListener('click', event => Menu.show(optionsMenu, event));

  filterMenu.addEventListener(MenuItem.CHECK_EVENT, (event) => {
    /** @type {HTMLElement} */
    const menuItem = (event.target);
    switch (menuItem.dataset.filter) {
      default:
      case 'none':
        dynamicTableAdapter.setFilter(null);
        break;
      case 'md':
        dynamicTableAdapter.setFilter(data => data.text.indexOf('md') !== -1 || data.text2.indexOf('md') !== -1);
        break;
      case 'div9':
        dynamicTableAdapter.setFilter(data => data.random % 9 === 0);
        break;
      case 'bool':
        dynamicTableAdapter.setFilter(data => data.check1);
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
    /** @type {HTMLElement} */
    const menuItem = (event.target);
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
    /** @type {HTMLElement} */
    const menuItem = (event.target);
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
