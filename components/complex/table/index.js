class Table {
  /**
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.element.addEventListener('click', (event) => {
      // Use one event listener to reduce overhead
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
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.hasAttribute('type') && target.getAttribute('type') === 'checkbox') {
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
