import { isRtl, findElementParentByClassName } from '../common/dom';

// https://www.w3.org/TR/wai-aria-practices/#grid

class DataTable {
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
    for (let i = 0; i < tbody.rows.length; i += 1) {
      const row = tbody.rows.item(i);
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
      for (let j = 0; j < row.cells.length; j += 1) {
        const cell = row.cells.item(j);
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
      }
    }
    if (rowFocusable && !foundTabbableRow && firstRow) {
      firstRow.setAttribute('tabindex', '0');
    } else if (cellFocusable && !foundTabbableCell && firstCell) {
      firstCell.setAttribute('tabindex', '0');
    }
  }

  static onTableBodyClick(event) {
    /** @type {Element} */
    const mdwDataTable = findElementParentByClassName(event.currentTarget, 'mdw-datatable');
    const { target } = event;
    if (target instanceof HTMLTableCellElement) {
      const cellFocusable = mdwDataTable.hasAttribute('mdw-cell-focusable');
      const rowFocusable = mdwDataTable.hasAttribute('mdw-row-focusable');
      if (cellFocusable || rowFocusable) {
        const otherTabIndexes = event.currentTarget.querySelectorAll('[tabindex="0"]');
        for (let i = 0; i < otherTabIndexes.length; i += 1) {
          otherTabIndexes.item(i).setAttribute('tabindex', '-1');
        }
        if (cellFocusable) {
          target.setAttribute('tabindex', '0');
        } else {
          target.parentElement.setAttribute('tabindex', '0');
        }
      }
      return;
    }
    if (target instanceof HTMLInputElement && target.getAttribute('type') === 'checkbox') {
      if (mdwDataTable.hasAttribute('mdw-adapter')) {
        return;
      }
      // Checkbox clicked
      const cell = DataTable.findParentCell(target);
      if (!cell.hasAttribute('mdw-selector')) {
        return;
      }
      event.stopPropagation();
      const currentRow = cell.parentElement;
      let hasSelection = false;
      if (target.checked) {
        currentRow.setAttribute('mdw-selected', '');
        hasSelection = true;
      } else {
        currentRow.removeAttribute('mdw-selected');
        const checkboxes = mdwDataTable.querySelectorAll('td[mdw-selector] input[type=checkbox]');
        for (let i = 0; i < checkboxes.length; i += 1) {
          if (checkboxes.item(i).checked) {
            hasSelection = true;
            break;
          }
        }
      }
      if (hasSelection) {
        mdwDataTable.setAttribute('mdw-has-selection', '');
      } else {
        mdwDataTable.removeAttribute('mdw-has-selection');
      }
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
    const tableHeaders = cell.parentElement.getElementsByTagName('th');
    for (let i = 0; i < tableHeaders.length; i += 1) {
      const otherTableHeader = tableHeaders.item(i);
      if (otherTableHeader !== cell) {
        otherTableHeader.removeAttribute('mdw-sorted');
      }
    }
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
    if (currentSelection instanceof HTMLTableCellElement) {
      cellIndex = currentSelection.cellIndex;
      row = currentSelection.parentElement;
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
      event.stopPropagation();
      event.preventDefault();
      const newIndex = row.sectionRowIndex - 1;
      const newRow = tbody.rows.item(newIndex);
      currentSelection.setAttribute('tabindex', '-1');
      if (isRow) {
        newRow.focus();
        newRow.setAttribute('tabindex', '0');
      } else {
        newRow.cells.item(cellIndex).focus();
        newRow.cells.item(cellIndex).setAttribute('tabindex', '0');
      }
      return;
    }
    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      const newIndex = row.sectionRowIndex + 1;
      if (newIndex >= tbody.rows.length) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newRow = tbody.rows.item(newIndex);
      currentSelection.setAttribute('tabindex', '-1');
      if (isRow) {
        newRow.focus();
        newRow.setAttribute('tabindex', '0');
      } else {
        newRow.cells.item(cellIndex).focus();
        newRow.cells.item(cellIndex).setAttribute('tabindex', '0');
      }
      return;
    }
    if (event.ctrlKey && event.key === 'Home') {
      if (row.sectionRowIndex === 0 && cellIndex === 0) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newRow = tbody.rows.item(0);
      currentSelection.setAttribute('tabindex', '-1');
      if (isRow) {
        newRow.focus();
        newRow.setAttribute('tabindex', '0');
      } else {
        newRow.cells.item(0).focus();
        newRow.cells.item(0).setAttribute('tabindex', '0');
      }
      return;
    }
    if (event.ctrlKey && event.key === 'End') {
      const newRowIndex = tbody.rows.length - 1;
      let newCellIndex = 0;
      if (!isRow) {
        newCellIndex = row.cells.length - 1;
      }
      if (row.sectionRowIndex === newRowIndex && cellIndex === newCellIndex) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newRow = tbody.rows.item(newRowIndex);
      currentSelection.setAttribute('tabindex', '-1');
      if (isRow) {
        newRow.focus();
        newRow.setAttribute('tabindex', '0');
      } else {
        newRow.cells.item(newCellIndex).focus();
        newRow.cells.item(newCellIndex).setAttribute('tabindex', '0');
      }
      return;
    }
    if (event.key === 'Home') {
      if (isRow) {
        return;
      }
      if (cellIndex === 0) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newIndex = 0;
      const newCell = row.cells.item(newIndex);
      currentSelection.setAttribute('tabindex', '-1');
      newCell.focus();
      newCell.setAttribute('tabindex', '0');
      return;
    }
    if (event.key === 'End') {
      if (isRow) {
        return;
      }
      const newIndex = row.cells.length - 1;
      if (newIndex === cellIndex) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newCell = row.cells.item(newIndex);
      currentSelection.setAttribute('tabindex', '-1');
      newCell.focus();
      newCell.setAttribute('tabindex', '0');
      return;
    }
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
      event.stopPropagation();
      event.preventDefault();
      const newIndex = cellIndex - 1;
      const newCell = row.cells.item(newIndex);
      currentSelection.setAttribute('tabindex', '-1');
      newCell.focus();
      newCell.setAttribute('tabindex', '0');
      return;
    }
    if (isRight) {
      if (isRow) {
        return;
      }
      const newIndex = cellIndex + 1;
      if (newIndex >= row.cells.length) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newCell = row.cells.item(newIndex);
      currentSelection.setAttribute('tabindex', '-1');
      newCell.focus();
      newCell.setAttribute('tabindex', '0');
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
   * @param {Element} tableElement
   * @return {HTMLTableElement}
   */
  static getTable(tableElement) {
    if (tableElement instanceof HTMLTableElement) {
      return tableElement;
    }
    let table = tableElement.getElementsByTagName('table')[0];
    if (!table) {
      table = document.createElement('table');
      const footer = tableElement.getElementsByClassName('mdw-datatable__footer')[0];
      if (footer) {
        tableElement.insertBefore(table, footer);
      } else {
        tableElement.appendChild(table);
      }
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
   * @param {Element} tableElement
   * @return {HTMLTableSectionElement}
   */
  static getTableBody(tableElement) {
    let tbody = tableElement.getElementsByTagName('tbody')[0];
    if (!tbody) {
      const table = DataTable.getTable(tableElement);
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }
    return tbody;
  }
}

export {
  DataTable,
};
