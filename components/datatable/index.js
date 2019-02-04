import {
  dispatchDomEvent,
  isRtl,
  findElementParentByClassName,
  iterateArrayLike,
  iterateSomeOfArrayLike,
} from '../common/dom';

// https://www.w3.org/TR/wai-aria-practices/#grid

// eslint-disable-next-line import/prefer-default-export
export class DataTable {
  /**
   * @param {Element} element
   * @return {void}
   */
  static attach(element) {
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'grid');
    }
    element.setAttribute('mdw-js', '');
    const headerRow = DataTable.getHeaderRow(element);
    const tbody = DataTable.getTableBody(element);
    const cellFocusable = element.hasAttribute('mdw-cell-focusable');
    const rowFocusable = element.hasAttribute('mdw-row-focusable');

    headerRow.addEventListener('click', DataTable.onHeaderRowClick);
    tbody.addEventListener('keydown', DataTable.onTableBodyKeyDown);
    tbody.addEventListener('click', DataTable.onTableBodyClick);
    let firstRow = null;
    let foundTabbableRow = false;
    let firstCell = null;
    let foundTabbableCell = false;
    iterateArrayLike(tbody.rows, (row) => {
      if (rowFocusable) {
        if (!firstRow) {
          firstRow = row;
        }
        if (!foundTabbableRow && row.getAttribute('tabindex') === '0') {
          foundTabbableRow = true;
        } else {
          row.setAttribute('tabindex', '-1');
        }
      } else {
        row.removeAttribute('tabindex');
      }
      iterateArrayLike(row.cells, (cell) => {
        if (cellFocusable && !rowFocusable) {
          if (!firstCell) {
            firstCell = cell;
          }
          if (!foundTabbableCell && cell.getAttribute('tabindex') === '0') {
            foundTabbableCell = true;
          } else {
            cell.setAttribute('tabindex', '-1');
          }
        } else {
          cell.removeAttribute('tabindex');
        }
      });
    });
    if (rowFocusable && !foundTabbableRow && firstRow) {
      DataTable.updateTabIndex(firstRow, false);
    } else if (cellFocusable && !foundTabbableCell && firstCell) {
      DataTable.updateTabIndex(firstCell, false);
    }
  }

  static onTableBodyClick(event) {
    const tbody = event.currentTarget;
    const mdwDataTable = findElementParentByClassName(tbody, 'mdw-datatable');
    const { target } = event;
    let cell = null;
    /** @type {HTMLTableRowElement} */
    let row = null;

    if (target instanceof HTMLInputElement && target.getAttribute('type') === 'checkbox') {
      if (mdwDataTable.hasAttribute('mdw-adapter')) {
        return;
      }
      // Checkbox clicked
      cell = DataTable.findParentCell(target);
      if (!cell.hasAttribute('mdw-selector')) {
        return;
      }
      event.stopPropagation();
      /** @type {HTMLTableRowElement} */
      row = (cell.parentElement);
      let hasSelection = false;
      if (target.checked) {
        row.setAttribute('mdw-selected', '');
        hasSelection = true;
      } else {
        row.removeAttribute('mdw-selected');
        /** @type {NodeListOf<HTMLInputElement>} */
        const checkboxes = (mdwDataTable.querySelectorAll('td[mdw-selector] input[type=checkbox]'));
        hasSelection = iterateSomeOfArrayLike(checkboxes, checkbox => checkbox.checked);
      }
      if (hasSelection) {
        mdwDataTable.setAttribute('mdw-has-selection', '');
      } else {
        mdwDataTable.removeAttribute('mdw-has-selection');
      }
      return;
    }
    if (target instanceof HTMLTableRowElement) {
      row = target;
    } else if (target instanceof HTMLTableCellElement) {
      cell = target;
    } else {
      cell = DataTable.findParentCell(target);
    }

    if (cell) {
      /** @type {HTMLTableRowElement} */
      row = (cell.parentElement);
      const cellFocusable = mdwDataTable.hasAttribute('mdw-cell-focusable');
      if (cellFocusable) {
        DataTable.updateTabIndex(cell);
        return;
      }
    }
    if (row) {
      const rowFocusable = mdwDataTable.hasAttribute('mdw-row-focusable');
      if (rowFocusable) {
        DataTable.updateTabIndex(row);
      }
    }
  }

  /**
   * @param {HTMLTableRowElement|HTMLTableCellElement} element
   * @param {boolean} [removeOtherTabIndexes=true]
   * @return {void}
   */
  static updateTabIndex(element, removeOtherTabIndexes) {
    if (removeOtherTabIndexes !== false) {
      /** @type {HTMLElement} */
      let tbody = element;
      while (tbody != null && tbody instanceof HTMLTableSectionElement === false) {
        tbody = tbody.parentElement;
      }
      if (element instanceof HTMLTableCellElement) {
        iterateArrayLike(tbody.querySelectorAll('td[tabindex="0"]'), (td) => {
          if (td !== element) {
            td.setAttribute('tabindex', '-1');
          }
        });
      }
      if (element instanceof HTMLTableRowElement) {
        iterateArrayLike(tbody.querySelectorAll('tr[tabindex="0"]'), (tr) => {
          if (tr !== element) {
            tr.setAttribute('tabindex', '-1');
          }
        });
      }
    }
    if (element.getAttribute('tabindex') !== '0') {
      element.setAttribute('tabindex', '0');
      dispatchDomEvent(element, 'mdw:tabindexchanged');
    }
  }

  /**
   * @param {Element} element
   * @return {HTMLTableCellElement}
   */
  static findParentCell(element) {
    let el = element;
    while (el != null) {
      if (el instanceof HTMLTableElement) {
        return null;
      }
      if (el instanceof HTMLTableCellElement) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  static onHeaderRowClick(event) {
    const cell = DataTable.findParentCell(event.target);
    if (!cell) {
      return;
    }
    if (cell.cellIndex === -1) {
      return;
    }
    if (!cell.hasAttribute('mdw-sortable')) {
      return;
    }
    const mdwTable = findElementParentByClassName(event.currentTarget, 'mdw-datatable');
    if (!mdwTable) {
      return;
    }
    if (mdwTable.hasAttribute('mdw-adapter')) {
      return;
    }
    let ascending = true;
    if (cell.hasAttribute('mdw-sorted') && !cell.getAttribute('mdw-sorted')) {
      ascending = false;
    }
    if (ascending) {
      cell.setAttribute('mdw-sorted', '');
    } else {
      cell.setAttribute('mdw-sorted', 'desc');
    }
    iterateArrayLike(cell.parentElement.getElementsByTagName('th'), (th) => {
      if (th !== cell) {
        th.removeAttribute('mdw-sorted');
      }
    });

    /** @type {HTMLTableSectionElement} */
    const tbody = DataTable.getTableBody(mdwTable);
    const rows = [];
    for (let i = tbody.rows.length - 1; i >= 0; i -= 1) {
      rows.push(tbody.rows.item(i));
      tbody.deleteRow(i);
    }
    rows.sort((a, b) => {
      const aCell = a.cells.item(cell.cellIndex);
      const bCell = b.cells.item(cell.cellIndex);
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
    event.stopPropagation();
  }

  static onTableBodyKeyDown(event) {
    const currentSelection = document.activeElement;
    let cellIndex = 0;
    /** @type {HTMLTableRowElement} */
    let row = null;
    let isRow = false;
    /** @type {HTMLTableRowElement|HTMLTableCellElement} */
    let nextSelection = null;
    if (currentSelection instanceof HTMLTableCellElement) {
      ({ cellIndex } = currentSelection);
      /** @type {HTMLTableRowElement} */
      row = (currentSelection.parentElement);
    } else if (currentSelection instanceof HTMLTableRowElement) {
      isRow = true;
      row = currentSelection;
    }
    if (!row) {
      return;
    }
    /** @type {HTMLTableSectionElement} */
    const tbody = event.currentTarget;
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      if (row.sectionRowIndex === 0) {
        return;
      }
      const newRow = tbody.rows.item(row.sectionRowIndex - 1);
      if (isRow) {
        nextSelection = newRow;
      } else {
        nextSelection = newRow.cells.item(cellIndex);
      }
    } else if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      const newIndex = row.sectionRowIndex + 1;
      if (newIndex >= tbody.rows.length) {
        return;
      }
      const newRow = tbody.rows.item(newIndex);
      if (isRow) {
        nextSelection = newRow;
      } else {
        nextSelection = newRow.cells.item(cellIndex);
      }
    } else if (event.ctrlKey && event.key === 'Home') {
      if (row.sectionRowIndex === 0 && cellIndex === 0) {
        return;
      }
      const newRow = tbody.rows.item(0);
      if (isRow) {
        nextSelection = newRow;
      } else {
        nextSelection = newRow.cells.item(0);
      }
    } else if (event.ctrlKey && event.key === 'End') {
      const newRowIndex = tbody.rows.length - 1;
      let newCellIndex = 0;
      if (!isRow) {
        newCellIndex = row.cells.length - 1;
      }
      if (row.sectionRowIndex === newRowIndex && cellIndex === newCellIndex) {
        return;
      }
      const newRow = tbody.rows.item(newRowIndex);
      if (isRow) {
        nextSelection = newRow;
      } else {
        nextSelection = newRow.cells.item(newCellIndex);
      }
    } else if (event.key === 'Home') {
      if (isRow) {
        return;
      }
      if (cellIndex === 0) {
        return;
      }
      nextSelection = row.cells.item(0);
    } else if (event.key === 'End') {
      if (isRow) {
        return;
      }
      const newIndex = row.cells.length - 1;
      if (newIndex === cellIndex) {
        return;
      }
      nextSelection = row.cells.item(newIndex);
    } else {
      const isRtlEnabled = isRtl();
      let isLeft = false;
      let isRight = false;
      if (event.key === 'ArrowLeft' || (event.key === 'Left')) {
        if (isRtlEnabled) {
          isRight = true;
        } else {
          isLeft = true;
        }
      }
      if (event.key === 'ArrowRight' || (event.key === 'Right')) {
        if (isRtlEnabled) {
          isLeft = true;
        } else {
          isRight = true;
        }
      }
      if (isLeft) {
        if (isRow) {
          return;
        }
        if (cellIndex === 0) {
          return;
        }
        nextSelection = row.cells.item(cellIndex - 1);
      } else if (isRight) {
        if (isRow) {
          return;
        }
        const newIndex = cellIndex + 1;
        if (newIndex >= row.cells.length) {
          return;
        }
        nextSelection = row.cells.item(newIndex);
      }
    }
    if (nextSelection) {
      event.stopPropagation();
      event.preventDefault();
      currentSelection.setAttribute('tabindex', '-1');
      nextSelection.focus();
      DataTable.updateTabIndex(nextSelection, false);
    }
  }

  static detach(element) {
    element.removeAttribute('mdw-js');
    const headerRow = DataTable.getHeaderRow(element);
    const tbody = DataTable.getTableBody(element);
    headerRow.removeEventListener('click', DataTable.onHeaderRowClick);
    tbody.removeEventListener('keydown', DataTable.onTableBodyKeyDown);
    tbody.removeEventListener('click', DataTable.onTableBodyClick);
  }

  /**
   * @param {Element} datatableElement
   * @return {HTMLElement}
   */
  static getScroller(datatableElement) {
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
  static getTable(datatableElement) {
    if (datatableElement instanceof HTMLTableElement) {
      return datatableElement;
    }
    let table = datatableElement.getElementsByTagName('table')[0];
    if (!table) {
      const scroller = this.getScroller(datatableElement);
      table = document.createElement('table');
      scroller.appendChild(table);
    }
    return table;
  }

  /**
   * @param {Element} tableElement
   * @return {HTMLTableRowElement}
   */
  static getHeaderRow(tableElement) {
    let thead = tableElement.getElementsByTagName('thead')[0];
    if (!thead) {
      const table = DataTable.getTable(tableElement);
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
   * @param {Element} datatableElement
   * @return {HTMLTableSectionElement}
   */
  static getTableBody(datatableElement) {
    let tbody = datatableElement.getElementsByTagName('tbody')[0];
    if (!tbody) {
      const table = DataTable.getTable(datatableElement);
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }
    return tbody;
  }
}
