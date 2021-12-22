// https://www.w3.org/TR/wai-aria-practices/#grid

import * as Keyboard from '../../core/aria/keyboard.js';
import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';
import { iterateArrayLike } from '../../core/dom.js';

import * as DataTableCell from './cell.js';
import * as DataTableColumnHeader from './columnheader.js';
import * as DataTableRow from './row.js';
import * as DataTableRowHeader from './rowheader.js';

export const CELL_TABINDEX_QUERIES = [
  'td:not([mdw-autofocus-widget])',
  'th:not([mdw-autofocus-widget])',
  'td[mdw-autofocus-widget] .mdw-datatable__widget',
  'th[mdw-autofocus-widget] .mdw-datatable__widget',
];

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onSelectedChange(event) {
  const selected = event.detail.value === 'true';
  /** @type {HTMLElement} */
  const dataTableElement = (event.currentTarget);
  const hasSelection = selected || dataTableElement.querySelector('td[aria-selected="true"],tr[aria-selected="true"]');
  if (hasSelection) {
    dataTableElement.setAttribute('mdw-has-selection', '');
  } else {
    dataTableElement.removeAttribute('mdw-has-selection');
  }
}

/**
 * @param {Element} datatableElement
 * @return {HTMLElement}
 */
export function getScroller(datatableElement) {
  /** @type {HTMLElement} */
  let scroller = (datatableElement.getElementsByClassName('mdw-datatable__scroller')[0]);
  if (!scroller) {
    scroller = document.createElement('div');
    scroller.classList.add('mdw-datatable__scroller');
    const footer = datatableElement.getElementsByClassName('mdw-datatable__footer')[0];
    if (footer) {
      datatableElement.insertBefore(scroller, footer);
    } else {
      datatableElement.appendChild(scroller);
    }
    // Move table into scroller if it exists
    const table = datatableElement.getElementsByTagName('table')[0];
    if (table) {
      table.parentElement.removeChild(table);
      scroller.appendChild(table);
    }
  }
  return scroller;
}

/**
 * @param {Element} datatableElement
 * @return {HTMLTableElement}
 */
export function getTable(datatableElement) {
  if (datatableElement instanceof HTMLTableElement) {
    return datatableElement;
  }
  let table = datatableElement.getElementsByTagName('table')[0];
  if (!table) {
    const scroller = getScroller(datatableElement);
    table = document.createElement('table');
    scroller.appendChild(table);
  }
  return table;
}

/**
 * @param {Element} datatableElement
 * @return {HTMLTableSectionElement}
 */
export function getTableBody(datatableElement) {
  let tbody = datatableElement.getElementsByTagName('tbody')[0];
  if (!tbody) {
    const table = getTable(datatableElement);
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  }
  return tbody;
}

/**
 * @param {Element} datatableElement
 * @param {number} columnIndex
 * @param {boolean} ascending
 * @return {void}
 */
export function sortColumn(datatableElement, columnIndex, ascending = true) {
  if (datatableElement.hasAttribute('mdw-datatable-adapter')) {
    return;
  }
  iterateArrayLike(datatableElement.getElementsByTagName('th'), (th) => {
    if (th.cellIndex === columnIndex) {
      th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
    } else if (th.hasAttribute('aria-sort')) {
      th.setAttribute('aria-sort', 'none');
    }
  });

  /** @type {HTMLTableSectionElement} */
  const tbody = getTableBody(datatableElement);
  const rows = [];
  for (let i = tbody.rows.length - 1; i >= 0; i -= 1) {
    rows.push(tbody.rows.item(i));
    tbody.deleteRow(i);
  }
  rows.sort((a, b) => {
    const aCell = a.cells.item(columnIndex);
    const bCell = b.cells.item(columnIndex);
    const aText = aCell.textContent;
    const bText = bCell.textContent;
    if (aCell.dataset.type === 'number') {
      return parseFloat(bText) - parseFloat(aText);
    }
    return bText.localeCompare(aText);
  });
  if (ascending) {
    rows.reverse();
  }
  const fragment = document.createDocumentFragment();
  rows.forEach((row) => {
    fragment.appendChild(row);
  });
  tbody.appendChild(fragment);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onItemFocus(event) {
  /** @type {HTMLElement} */
  const datatableElement = (event.currentTarget);
  const onFocusInteraction = datatableElement.getAttribute('mdw-on-focus');
  if (!onFocusInteraction) {
    return;
  }
  /** @type {HTMLElement} */
  const itemElement = (event.target);
  if (itemElement.getAttribute('aria-disabled') === 'true') {
    return;
  }
  onFocusInteraction.split(' ').forEach((interaction) => {
    switch (interaction) {
      case 'select':
        if (itemElement instanceof HTMLTableRowElement) {
          DataTableRow.setSelected(itemElement, true);
        } else {
          DataTableCell.setSelected(itemElement, true);
        }
        break;
      default:
    }
  });
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onSort(event) {
  /** @type {HTMLElement} */
  const datatableElement = (event.currentTarget);
  /** @type {HTMLTableHeaderCellElement} */
  const cell = (event.target);
  sortColumn(datatableElement, cell.cellIndex, event.detail.sort === 'ascending');
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onRowHeaderCheckedChange(event) {
  /** @type {HTMLTableHeaderCellElement} */
  const cell = (event.target);
  const row = cell.parentElement;
  DataTableRow.setSelected(row, event.detail.value);
}

/**
 * @param {Event} event
 * @return {void}
 */
function onTabIndexZeroed(event) {
  /** @type {HTMLElement} */
  const dataTableElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const emitter = (event.target);

  const row = (emitter instanceof HTMLTableRowElement && emitter);
  const cell = (!row && emitter instanceof HTMLTableCellElement && emitter);
  if (!row && !cell) {
    return;
  }
  event.stopPropagation();
  RovingTabIndex.removeTabIndex(dataTableElement.querySelectorAll(row ? 'tr' : CELL_TABINDEX_QUERIES.join(',')), [emitter]);
}

/**
 * @param {CustomEvent} event
 * @return {void}
 */
export function onKeyboard(event) {
  /** @type {HTMLElement} */
  const dataTableElement = (event.currentTarget);
  /** @type {HTMLElement} */
  const emitter = (event.target);
  let current = document.activeElement;

  let row = (emitter instanceof HTMLTableRowElement && emitter);
  const cell = (!row && emitter instanceof HTMLTableCellElement && emitter);
  if (!row && !cell) {
    return;
  }
  if (!row) {
    /** @type {HTMLTableRowElement} */
    row = (cell.parentElement);
  }

  let checkNavKeys = false;
  switch (event.type) {
    case Keyboard.SPACEBAR_KEY:
      if (event.detail.ctrlKey || event.detail.altKey || event.detail.metaKey) {
        return;
      }
      if (!event.detail.shiftKey) {
        return;
      }
      if (!row.hasAttribute('aria-selected')) {
        return;
      }
      DataTableRow.setSelected(row, row.getAttribute('aria-selected') !== 'true', true);
      break;
    default:
      checkNavKeys = true;
  }

  if (checkNavKeys) {
    // Keyboard Navigation
    /** @type {ArrayLike<HTMLElement>} */
    let searchElements;
    let reverse = false;
    let loop = false;
    switch (event.type) {
      case Keyboard.UP_ARROW_KEY:
        reverse = true;
        // eslint-disable-next-line no-fallthrough
      case Keyboard.DOWN_ARROW_KEY:
        if (event.detail.ctrlKey || event.detail.altKey || event.detail.metaKey) {
          return;
        }
        if (cell) {
          searchElements = getTableBody(dataTableElement).querySelectorAll(
            CELL_TABINDEX_QUERIES.map((q) => `${q}:nth-child(${cell.cellIndex + 1})`).join(','),
          );
        } else {
          searchElements = getTableBody(dataTableElement).getElementsByTagName('tr');
        }
        break;
      case Keyboard.BACK_ARROW_KEY:
        reverse = true;
        // eslint-disable-next-line no-fallthrough
      case Keyboard.FORWARD_ARROW_KEY:
        if (event.detail.ctrlKey || event.detail.altKey || event.detail.metaKey) {
          return;
        }
        if (!cell) {
          return;
        }
        searchElements = cell.parentElement.querySelectorAll(CELL_TABINDEX_QUERIES.join(','));
        break;
      case Keyboard.END_KEY:
        reverse = true;
        // eslint-disable-next-line no-fallthrough
      case Keyboard.HOME_KEY:
        if (event.detail.altKey || event.detail.metaKey) {
          return;
        }
        if (!cell) {
          return;
        }
        if (event.detail.ctrlKey) {
          searchElements = getTableBody(dataTableElement).querySelectorAll(CELL_TABINDEX_QUERIES.join(','));
        } else {
          searchElements = cell.parentElement.querySelectorAll(CELL_TABINDEX_QUERIES.join(','));
        }
        cell.setAttribute('tabindex', '-1');
        current = null;
        loop = true;
        break;
      default:
        return;
    }
    RovingTabIndex.selectNext(searchElements, current, loop, reverse);
  }

  event.preventDefault();
  event.stopPropagation();
}

/**
 * @param {Element} element
 * @return {void}
 */
export function detach(element) {
  element.removeAttribute('mdw-datatable-js');
  element.removeEventListener(DataTableRow.FOCUS_EVENT, onItemFocus);
  element.removeEventListener(DataTableCell.FOCUS_EVENT, onItemFocus);
  element.removeEventListener(DataTableColumnHeader.SORT_EVENT, onSort);
  element.removeEventListener(Keyboard.UP_ARROW_KEY, onKeyboard);
  element.removeEventListener(Keyboard.DOWN_ARROW_KEY, onKeyboard);
  element.removeEventListener(Keyboard.FORWARD_ARROW_KEY, onKeyboard);
  element.removeEventListener(Keyboard.BACK_ARROW_KEY, onKeyboard);
  element.removeEventListener(Keyboard.HOME_KEY, onKeyboard);
  element.removeEventListener(Keyboard.END_KEY, onKeyboard);
  element.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}

/**
 * @param {Element} tableElement
 * @return {HTMLTableRowElement}
 */
export function getHeaderRow(tableElement) {
  let thead = tableElement.getElementsByTagName('thead')[0];
  if (!thead) {
    const table = getTable(tableElement);
    thead = document.createElement('thead');
    table.appendChild(thead);
  }
  let headerRow = thead.getElementsByTagName('tr')[0];
  if (!headerRow) {
    headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
  }
  return headerRow;
}

/**
 * @param {Element} element
 * @return {void}
 */
export function attach(element) {
  element.setAttribute('mdw-datatable-js', '');

  const table = getTable(element);
  table.setAttribute('role', 'grid');
  const headerRow = getHeaderRow(element);
  const tbody = getTableBody(element);

  iterateArrayLike(headerRow.getElementsByTagName('th'), DataTableColumnHeader.attach);
  iterateArrayLike(tbody.getElementsByTagName('th'), DataTableRowHeader.attach);

  const tableRows = tbody.getElementsByTagName('tr');
  iterateArrayLike(tableRows, DataTableRow.attach);

  const rowFocusable = element.hasAttribute('mdw-row-focusable');
  if (rowFocusable) {
    RovingTabIndex.setupTabIndexes(tableRows);
  }
  const cellFocusable = element.hasAttribute('mdw-cell-focusable');
  if (cellFocusable) {
    RovingTabIndex.setupTabIndexes(tbody.querySelectorAll(CELL_TABINDEX_QUERIES.join(',')));
  }

  element.addEventListener(DataTableRow.FOCUS_EVENT, onItemFocus);
  element.addEventListener(DataTableRow.SELECTED_CHANGE_EVENT, onSelectedChange);
  element.addEventListener(DataTableCell.FOCUS_EVENT, onItemFocus);
  element.addEventListener(DataTableCell.SELECTED_CHANGE_EVENT, onSelectedChange);
  element.addEventListener(DataTableColumnHeader.SORT_EVENT, onSort);
  element.addEventListener(Keyboard.SPACEBAR_KEY, onKeyboard);
  element.addEventListener(Keyboard.UP_ARROW_KEY, onKeyboard);
  element.addEventListener(Keyboard.DOWN_ARROW_KEY, onKeyboard);
  element.addEventListener(Keyboard.FORWARD_ARROW_KEY, onKeyboard);
  element.addEventListener(Keyboard.BACK_ARROW_KEY, onKeyboard);
  element.addEventListener(Keyboard.HOME_KEY, onKeyboard);
  element.addEventListener(Keyboard.END_KEY, onKeyboard);
  element.addEventListener(RovingTabIndex.TABINDEX_ZEROED, onTabIndexZeroed);
}
