import { isRtl } from "../common/dom";

// https://www.w3.org/TR/wai-aria-practices/#grid

class Table {
  /**
   * @param {HTMLElement} element
   * @return {void}
   */
  static attach(element) {
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'grid');
    }
    element.setAttribute('mdw-js', '');
    const table = Table.getTable(element);
    const useCellSelection = element.hasAttribute('mdw-cell-selection');
    const useRowSelection = element.hasAttribute('mdw-row-selection');
    if (!useCellSelection && !useRowSelection) {
      return;
    }
    table.addEventListener('keydown', Table.onTableKeyDown);
    const tbody = Table.getTableBody(element);
    let firstRow = null;
    let foundTabbableRow = false;
    let firstCell = null;
    let foundTabbableCell = false;
    for (let i = 0; i < tbody.rows.length; i += 1) {
      const row = tbody.rows.item(i);
      if (useCellSelection) {
        for (let j = 0; j < row.cells.length; j += 1) {
          const cell = row.cells.item(j);
          if (!firstCell) {
            firstCell = cell;
          }
          if (!cell.hasAttribute('tabindex')) {
            cell.setAttribute('tabindex', '-1');
          } else {
            const tabindex = cell.getAttribute('tabindex');
            if (tabindex === '0') {
              if (!foundTabbableCell) {
                foundTabbableCell = true;
              } else {
                cell.setAttribute('tabindex', '-1');
              }
            }
          }
          cell.addEventListener('focus', Table.onCellFocus);
          cell.addEventListener('blur', Table.onCellBlur);
        }
      } else {
        if (!firstRow) {
          firstRow = row;
        }
        if (!row.hasAttribute('tabindex')) {
          row.setAttribute('tabindex', '-1');
        } else {
          const tabindex = row.getAttribute('tabindex');
          if (tabindex === '0') {
            if (!foundTabbableRow) {
              foundTabbableRow = true;
            } else {
              row.setAttribute('tabindex', '-1');
            }
          }
        }
        row.addEventListener('focus', Table.onRowFocus);
        row.addEventListener('blur', Table.onRowBlur);
      }
    }
    if (useCellSelection && !foundTabbableCell && firstCell) {
      firstCell.setAttribute('tabindex', '0');
    } else if (!foundTabbableRow && firstRow) {
      firstRow.setAttribute('tabindex', '0');
    }
  }

  static onTableKeyDown(event) {
    const tableElement = event.currentTarget;
    if (!tableElement) {
      return;
    }
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
    if (event.key === 'ArrowUp' || (event.key === 'Up')) {
      if (row.sectionRowIndex === 0) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      /** @type {HTMLTableSectionElement} */
      const tbody = row.parentElement;
      const newIndex = row.sectionRowIndex - 1;
      const newRow = tbody.rows.item(newIndex);
      if (isRow) {
        newRow.focus();
      } else {
        newRow.cells.item(cellIndex).focus();
      }
      return;
    }
    if (event.key === 'ArrowDown' || (event.key === 'Down')) {
      /** @type {HTMLTableSectionElement} */
      const tbody = row.parentElement;
      const newIndex = row.sectionRowIndex + 1;
      if (newIndex >= tbody.rows.length) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const newRow = tbody.rows.item(newIndex);
      if (isRow) {
        newRow.focus();
      } else {
        newRow.cells.item(cellIndex).focus();
      }
      return;
    }
    if (event.ctrlKey && event.key === 'Home') {
      if (row.sectionRowIndex === 0 && cellIndex === 0) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      /** @type {HTMLTableSectionElement} */
      const tbody = row.parentElement;
      const newRow = tbody.rows.item(0);
      if (isRow) {
        newRow.focus();
      } else {
        newRow.cells.item(0).focus();
      }
      return;
    }
    if (event.ctrlKey && event.key === 'End') {
      /** @type {HTMLTableSectionElement} */
      const tbody = row.parentElement;
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
      /** @type {HTMLTableSectionElement} */
      const newRow = tbody.rows.item(newRowIndex);
      if (isRow) {
        newRow.focus();
      } else {
        newRow.cells.item(newCellIndex).focus();
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
      newCell.focus();
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
      newCell.focus();
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
      newCell.focus();
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
      newCell.focus();
      return;
    }
  }

  static onRowFocus(event) {
    const row = event.currentTarget;
    row.setAttribute('tabindex', '0');
  }

  static onRowBlur(event) {
    const row = event.currentTarget;
    // Only handle if blur is to another table cell
    const blurrer = event.relatedTarget;
    if (!blurrer) {
      return;
    }
    const isTableRow = blurrer instanceof HTMLTableRowElement;
    const isTableCell = blurrer instanceof HTMLTableCellElement;
    if (!isTableRow && !isTableCell) {
      return;
    }
    let blurrerTable = blurrer;
    while (blurrerTable != null && blurrerTable instanceof HTMLTableElement === false) {
      blurrerTable = blurrerTable.parentElement;
    }

    if (blurrerTable instanceof HTMLTableElement === false) {
      // Blurrer is not part of a table
      return;
    }

    let cellTable = event.currentTarget;
    while (cellTable != null && cellTable instanceof HTMLTableElement === false) {
      cellTable = cellTable.parentElement;
    }
    if (cellTable instanceof HTMLTableElement === false) {
      // Current cell is not part of a table
      return;
    }
    if (cellTable !== blurrerTable) {
      // Table parents do not match
      return;
    }
    row.setAttribute('tabindex', '-1');
  }

  static onCellFocus(event) {
    const cell = event.currentTarget;
    cell.setAttribute('tabindex', '0');
    const row = cell.parentElement;
    row.setAttribute('mdw-focused', '');
  }

  static onCellBlur(event) {
    const cell = event.currentTarget;
    const row = cell.parentElement;
    row.removeAttribute('mdw-focused');
    // Only handle if blur is to another table cell
    const blurrer = event.relatedTarget;
    if (!blurrer) {
      return;
    }
    const isTableRow = blurrer instanceof HTMLTableRowElement;
    const isTableCell = blurrer instanceof HTMLTableCellElement;
    if (!isTableRow && !isTableCell) {
      return;
    }
    let blurrerTable = blurrer;
    while (blurrerTable != null && blurrerTable instanceof HTMLTableElement === false) {
      blurrerTable = blurrerTable.parentElement;
    }

    if (blurrerTable instanceof HTMLTableElement === false) {
      // Blurrer is not part of a table
      return;
    }

    let cellTable = event.currentTarget;
    while (cellTable != null && cellTable instanceof HTMLTableElement === false) {
      cellTable = cellTable.parentElement;
    }
    if (cellTable instanceof HTMLTableElement === false) {
      // Current cell is not part of a table
      return;
    }
    if (cellTable !== blurrerTable) {
      // Table parents do not match
      return;
    }
    cell.setAttribute('tabindex', '-1');
  }
  static detach(element) {
    element.removeAttribute('mdw-js');
    const table = Table.getTable(element);
    table.removeEventListener('keydown', Table.onTableKeyDown);
    const tbody = Table.getTableBody(element);
    for (let i = 0; i < tbody.rows.length; i += 1) {
      const row = tbody.rows.item(i);
      row.removeEventListener('focus', Table.onRowFocus);
      row.removeEventListener('blur', Table.onRowBlur);
      for (let j = 0; j < row.cells.length; j += 1) {
        const cell = row.cells.item(i);
        cell.removeAttribute('tabindex');
        cell.removeEventListener('focus', Table.onCellFocus);
        cell.removeEventListener('blur', Table.onCellBlur);
      }
    }
  }


  /**
   * @param {HTMLElement} tableElement
   * @return {HTMLTableElement}
   */
  static getTable(tableElement) {
    if (tableElement instanceof HTMLTableElement) {
      return tableElement;
    }
    let table = tableElement.getElementsByTagName('table')[0];
    if (!table) {
      table = document.createElement('table');
      const footer = tableElement.getElementsByClassName('mdw-table__footer')[0];
      if (footer) {
        tableElement.insertBefore(table, footer);
      } else {
        tableElement.appendChild(table);
      }
    }
    return table;
  }

  /**
   * @param {HTMLElement} element
   * @return {HTMLTableRowElement}
   */
  static findTableRow(element) {
    if (element instanceof HTMLTableElement) {
      return null;
    }
    if (element instanceof HTMLTableRowElement) {
      return element;
    }
    if (!element.parentElement) {
      return null;
    }
    return Table.findTableRow(element.parentElement);
  }

  /**
   * @param {HTMLElement} tableElement
   * @return {HTMLTableSectionElement}
   */
  static getTableBody(tableElement) {
    let tbody = tableElement.getElementsByTagName('tbody')[0];
    if (!tbody) {
      const table = Table.getTable(tableElement);
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }
    return tbody;
  }

  /**
   * @param {HTMLElement} tableElement
   * @return {HTMLTableRowElement}
   */
  static getHeaderRow(tableElement) {
    let thead = tableElement.getElementsByTagName('thead')[0];
    if (!thead) {
      const table = Table.getTable(tableElement);
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
}

export {
  Table,
};
