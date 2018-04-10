class Table {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.element.addEventListener('click', (event) => {
      // Use one event listener to reduce overhead and allow dynamic content
      this.handleClickInteraction(event);
    });
  }

  detach() {
    this.element = null;
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  handleClickInteraction(event) {
    /** @type {HTMLElement} */
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      if (target.hasAttribute('type') && target.getAttribute('type') === 'checkbox') {
        event.stopPropagation();
        const currentCell = this.getTableCell(target);
        if (currentCell.tagName.toLowerCase() === 'th') {
          this.setCheckOnAllRows(target.checked);
          this.setHasSelection(target.checked);
          return;
        }
        const currentRow = this.getTableRow(target);
        if (target.checked) {
          currentRow.setAttribute('mdw-selected', '');
          this.setHasSelection(true);
        } else {
          currentRow.removeAttribute('mdw-selected');
          const checkedRows = this.getCheckedRows();
          this.setHasSelection(checkedRows.length !== 0);
        }
      }
      return;
    }
    const currentCell = this.getTableCell(target);
    if (currentCell) {
      if (currentCell.tagName.toLowerCase() === 'th' && currentCell.hasAttribute('mdw-sortable')) {
        event.stopPropagation();
        let ascending = true;
        if (!currentCell.hasAttribute('mdw-sorted')) {
          ascending = false;
        } else if (currentCell.getAttribute('mdw-sorted') === 'reverse') {
          ascending = false;
        }
        this.updateSortIcons(currentCell, ascending);
        this.updateSortColumn(currentCell, ascending);
        return;
      }
    }
  }

  /**
   * Overrideable sorting method
   * @param {HTMLTableHeaderCellElement} tableHeaderCell
   * @param {boolean} [ascending=false]
   * @return {void}
   */
  updateSortColumn(tableHeaderCell, ascending) {
    if (tableHeaderCell.cellIndex === -1) {
      // Header not attached to row!
      return;
    }
    /** @type {HTMLTableSectionElement} */
    const tbody = this.element.querySelector('tbody');
    const rows = [];
    for (let i = 0; i < tbody.rows.length; i += 1) {
      rows.push(tbody.rows.item(i));
    }
    for (let i = tbody.rows.length - 1; i >= 0; i -= 1) {
      tbody.deleteRow(i);
    }
    rows.sort((a, b) => {
      const aCell = a.cells.item(tableHeaderCell.cellIndex);
      const bCell = b.cells.item(tableHeaderCell.cellIndex);
      const aText = aCell.textContent;
      const bText = bCell.textContent;
      if (aCell.hasAttribute('mdw-table-number')) {
        return parseFloat(aText) - parseFloat(bText);
      }
      return aText.localeCompare(bText);
    });
    if (ascending) {
      rows.reverse();
    }
    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  }

  /**
   * @param {HTMLTableHeaderCellElement=} sortedTableHeaderCell null if none
   * @param {boolean=} [ascending=false]
   * @return {void}
   */
  updateSortIcons(sortedTableHeaderCell, ascending) {
    if (sortedTableHeaderCell) {
      if (ascending) {
        sortedTableHeaderCell.setAttribute('mdw-sorted', 'reverse');
      } else {
        sortedTableHeaderCell.setAttribute('mdw-sorted', '');
      }
    }
    const tableHeaders = this.element.querySelectorAll('th');
    for (let i = 0; i < tableHeaders.length; i += 1) {
      const otherTableHeader = tableHeaders.item(i);
      if (otherTableHeader !== sortedTableHeaderCell) {
        otherTableHeader.removeAttribute('mdw-sorted');
      }
    }
  }

  /**
   * @param {boolean} value
   * @return {void}
   */
  setCheckOnAllRows(value) {
    const checkboxes = this.element.querySelectorAll('td[mdw-table-checkbox] input[type=checkbox]');
    for (let i = 0; i < checkboxes.length; i += 1) {
      const checkbox = checkboxes.item(i);
      checkbox.checked = value;
      const currentRow = this.getTableRow(checkbox);
      if (value) {
        currentRow.setAttribute('mdw-selected', '');
      } else {
        currentRow.removeAttribute('mdw-selected');
      }
    }
  }

  /**
   * @param {HTMLElement} element
   * @return {HTMLTableRowElement}
   */
  getTableRow(element) {
    if (element === this.element) {
      return null;
    }
    if (element instanceof HTMLTableRowElement) {
      return element;
    }
    if (!element.parentElement) {
      return null;
    }
    return this.getTableRow(element.parentElement);
  }

  /**
   * @param {HTMLElement} element
   * @return {HTMLTableCellElement}
   */
  getTableCell(element) {
    if (element === this.element) {
      return null;
    }
    if (element instanceof HTMLTableCellElement) {
      return element;
    }
    if (!element.parentElement) {
      return null;
    }
    return this.getTableCell(element.parentElement);
  }

  /** @return {HTMLTableRowElement[]} */
  getCheckedRows() {
    const checkboxes = this.element.querySelectorAll('td[mdw-table-checkbox] input[type=checkbox]');
    const checkedRows = [];
    for (let i = 0; i < checkboxes.length; i += 1) {
      /** @type {HTMLInputElement} */
      const checkbox = checkboxes.item(i);
      if (checkbox.checked) {
        const row = this.getTableRow(checkbox);
        if (row) {
          checkedRows.push(row);
        }
      }
    }
    return checkedRows;
  }

  /**
   * @param {boolean} value
   * @return {void}
   */
  setHasSelection(value) {
    if (value) {
      this.element.setAttribute('mdw-has-selection', '');
      return;
    }
    this.element.removeAttribute('mdw-has-selection');
  }
}

export {
  Table,
};
