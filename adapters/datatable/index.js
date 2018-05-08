import { Button } from '../../components/button/index';
import { DataTable } from '../../components/datatable/index';

/** @return {HTMLLabelElement} */
function constructTableCheckbox() {
  const checkboxLabel = document.createElement('label');
  checkboxLabel.classList.add('mdw-selection');
  const input = document.createElement('input');
  input.classList.add('mdw-selection__input');
  input.setAttribute('type', 'checkbox');
  const icon = document.createElement('div');
  icon.classList.add('mdw-selection__icon');
  checkboxLabel.appendChild(input);
  checkboxLabel.appendChild(icon);
  return checkboxLabel;
}

class TableColumn {
  /**
   * @param {Object} options Text or options
   * @param {string} options.key
   * @param {(string|DocumentFragment)=} options.name
   * @param {string=} options.type
   * @param {boolean=} options.rowSelector
   * @param {string=} options.tooltip
   * @param {boolean=} options.sortable
   * @param {boolean=} options.primaryColumn
   * @param {HTMLElement=} options.customSortIcon
   * @param {string=} options.innerHTML
   * @param {DocumentFragment=} options.fragment
   * @param {(function(HTMLTableCellElement, any, any=):void)=} options.renderer
   * @param {(function(any):any)=} options.formatter
   */
  constructor(options) {
    this.element = document.createElement('th');
    if (options.innerHTML != null) {
      this.element.innerHTML = options.innerHTML;
    } else if (options.fragment) {
      this.element.appendChild(options.fragment);
    }
    this.key = options.key;
    this.element.dataset.key = options.key;

    if (options.sortable) {
      this.element.setAttribute('mdw-sortable', '');
      let sortIcon = options.customSortIcon;
      if (!sortIcon) {
        sortIcon = document.createElement('div');
        sortIcon.classList.add('mdw-datatable__sort-icon', 'material-icons');
        sortIcon.textContent = 'arrow_downward';
      }
      if (this.element.hasChildNodes()) {
        this.element.insertBefore(this.element.firstChild, options.customSortIcon);
      } else {
        this.element.appendChild(sortIcon);
      }
    }
    if (options.tooltip) {
      const wrapper = document.createElement('span');
      wrapper.classList.add('mdw-tooltip__wrapper');
      const target = document.createElement('span');
      target.classList.add('mdw-tooltip__target');
      if (!options.name) {
        target.textContent = '';
      } else if (typeof options.name === 'string') {
        target.textContent = options.name;
      } else {
        target.appendChild(options.name);
      }
      const tooltip = document.createElement('div');
      tooltip.classList.add('mdw-tooltip');
      tooltip.textContent = options.tooltip;
      wrapper.appendChild(target);
      wrapper.appendChild(tooltip);
      this.element.appendChild(wrapper);
    } else if (options.name) {
      let node;
      if (typeof options.name === 'string') {
        node = document.createTextNode(options.name);
      } else {
        node = options.name;
      }
      this.element.appendChild(node);
    }

    this.primaryColumn = options.primaryColumn;
    if (options.primaryColumn) {
      this.element.setAttribute('mdw-primary-column', '');
    }

    this.rowSelector = options.rowSelector;

    if (this.rowSelector) {
      this.element.setAttribute('mdw-selector', '');
    }
    if (options.type) {
      this.element.dataset.type = options.type;
      this.type = options.type;
    }
    if (this.rowSelector && this.type === 'checkbox') {
      const checkboxLabel = constructTableCheckbox();
      this.element.appendChild(checkboxLabel);
    }

    if (options.renderer) {
      this.renderer = options.renderer;
    } else if (options.type === 'checkbox') {
      this.renderer = TableColumn.defaultCheckboxRenderer;
    } else {
      this.renderer = TableColumn.defaultCellRenderer;
    }
    if (options.formatter) {
      this.formatter = options.formatter;
    } else {
      this.formatter = TableColumn.defaultValueFormatter;
    }
  }


  /**
   * @param {any} value
   * @param {any} object
   * @return {void}
   */
  static defaultValueFormatter(value, object) {
    return value;
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @param {any} value
   * @return {void}
   */
  static defaultCheckboxRenderer(cell, value) {
    let input = cell.getElementsByTagName('input')[0];
    const checked = !!value;
    if (!input) {
      const checkboxLabel = document.createElement('label');
      checkboxLabel.classList.add('mdw-selection');
      input = document.createElement('input');
      input.classList.add('mdw-selection__input');
      input.setAttribute('type', 'checkbox');
      input.checked = checked;
      const icon = document.createElement('div');
      icon.classList.add('mdw-selection__icon');
      checkboxLabel.appendChild(input);
      checkboxLabel.appendChild(icon);
      cell.appendChild(checkboxLabel);
    }
    if (input.checked !== checked) {
      input.checked = checked;
    }
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @param {any} value
   * @return {void}
   */
  static defaultCellRenderer(cell, value) {
    let stringValue;
    if (value == null) {
      stringValue = '';
    } else {
      stringValue = value.toString();
    }
    const len = cell.childNodes.length;
    let foundTextNode = false;
    for (let i = len - 1; i >= 0; i -= 1) {
      const node = cell.childNodes.item(i);
      if (!foundTextNode && node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue !== stringValue) {
          node.nodeValue = stringValue;
        }
        foundTextNode = true;
      } else {
        cell.removeChild(node);
      }
    }
    if (!foundTextNode) {
      const node = document.createTextNode(stringValue);
      cell.appendChild(node);
    }
  }
}

class DataTableAdapter {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.datatable
   * @param {Object[]} options.datasource Object array
   */
  constructor(options) {
    this.element = options.datatable;
    this.datasource = options.datasource;
    this.element.addEventListener('click', (event) => {
      // Use one event listener to reduce overhead and allow dynamic content
      this.handleClickInteraction(event);
    });
    /** @type {HTMLTableRowElement} */
    this.tabindexRow = null;
    /** @type {Object} */
    this.tabindexRowData = null;
    this.element.addEventListener('mdw:tabindexchanged', (event) => {
      if (this.element.hasAttribute('mdw-row-focusable')) {
        this.tabindexRow = event.target;
        this.tabindexRowData = this.getDataForTableRow(this.tabindexRow);
      }
    });
    DataTable.attach(this.element);
    this.element.setAttribute('mdw-adapter', '');
    /** @type {TableColumn[]} */
    this.columns = [];
    this.page = 0;
    this.pageLimit = 0;
    this.debounceTimeMs = 0;
    this.throttleTimeMs = 100;
    this.useLazyRendering = false;
  }

  detach() {
    this.element.removeAttribute('mdw-adapter');
    this.element = null;
    this.datasource = null;
  }

  buildScrollListener() {
    let throttleTimeout = null;
    let debounceTimeout = null;
    let pending = false;

    /** @return {void} */
    const throttle = () => {
      throttleTimeout = null;
      this.performLazyRender();
      if (pending) {
        pending = false;
        throttleTimeout = setTimeout(throttle, this.throttleTimeMs);
      }
    };
    this.scrollListener = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
      }
      if (throttleTimeout) {
        // Will perform in the future
        pending = true;
        return;
      }
      if (this.debounceTimeMs) {
        debounceTimeout = setTimeout(() => {
          throttleTimeout = setTimeout(throttle, this.throttleTimeMs);
        }, this.debounceTimeMs);
      } else {
        throttleTimeout = setTimeout(throttle, this.throttleTimeMs);
      }
    };
    this.element.addEventListener('scroll', this.scrollListener);
  }

  destroyScrollListener() {
    if (this.scrollListener) {
      this.element.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
  }

  /**
   * Overridable event fired when value change is requested
   * Return truthy value to cancel updating object
   * @param {any} object
   * @param {string} key
   * @param {any} value
   * @return {boolean} cancel
   */
  onValueChangedRequested(object, key, value) {
    return false;
  }

  /**
   * Overridable event fired when value is changed
   * @param {any} object
   * @param {string} key
   * @param {any} value
   * @return {void}
   */
  onValueChanged(object, key, value) {
    return;
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
          this.setCheckOnAllRows(target.checked, currentCell.cellIndex);
          this.setHasSelection(target.checked);
          return;
        }
        const currentRow = this.getTableRow(target);
        const object = this.getDataForTableRow(currentRow);
        if (this.onValueChangedRequested(object, currentCell.dataset.key, target.checked)) {
          event.preventDefault();
          return;
        }
        object[currentCell.dataset.key] = target.checked;
        this.onValueChanged(object, currentCell.dataset.key, target.checked);
        if (currentCell.hasAttribute('mdw-selector')) {
          if (target.checked) {
            currentRow.setAttribute('mdw-selected', '');
            this.setHasSelection(true);
          } else {
            currentRow.removeAttribute('mdw-selected');
            const selectedRows = this.getSelectedRows();
            this.setHasSelection(selectedRows.length !== 0);
          }
        }
      }
      return;
    }
    const currentCell = this.getTableCell(target);
    if (currentCell) {
      if (currentCell.tagName.toLowerCase() === 'th' && currentCell.hasAttribute('mdw-sortable')) {
        event.stopPropagation();
        let ascending = true;
        if (currentCell.hasAttribute('mdw-sorted') && !currentCell.getAttribute('mdw-sorted')) {
          ascending = false;
        }
        this.updateSortIcons(currentCell, ascending);
        if (this.updateSortColumn) {
          this.updateSortColumn(currentCell, ascending);
        }
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
    const index = tableHeaderCell.cellIndex;
    const tableColumn = this.columns[index];
    this.datasource.sort((a, b) => {
      const valueA = a[tableColumn.key];
      const valueB = b[tableColumn.key];
      if (tableColumn.type === 'number') {
        return parseFloat(valueB) - parseFloat(valueA);
      }
      if (tableColumn.type === 'checkbox') {
        return (valueB ? 1 : 0) - (valueA ? 1 : 0);
      }
      return valueA.localeCompare(valueB);
    });
    if (ascending) {
      this.datasource.reverse();
    }
    this.refresh();
  }

  /**
   * @param {HTMLTableHeaderCellElement=} sortedTableHeaderCell null if none
   * @param {boolean=} [ascending=false]
   * @return {void}
   */
  updateSortIcons(sortedTableHeaderCell, ascending) {
    if (sortedTableHeaderCell) {
      if (ascending) {
        sortedTableHeaderCell.setAttribute('mdw-sorted', '');
      } else {
        sortedTableHeaderCell.setAttribute('mdw-sorted', 'desc');
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
   * @param {number} columnIndex
   * @return {void}
   */
  setCheckOnAllRows(value, columnIndex) {
    const column = this.columns[columnIndex];
    this.datasource.forEach((object) => {
      object[column.key] = value;
    });
    this.refresh();
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
  getSelectedRows() {
    const selectorColumn = this.columns.find(column => column.rowSelector);
    if (!selectorColumn) {
      return [];
    }
    return this.getDatasource().filter(row => row[selectorColumn.key]);
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

  /**
   * @param {Object[]} datasource Object array
   * @return {void}
   */
  setDatasource(datasource) {
    this.datasource = datasource;
  }

  /**
   * Toggle lazy rending for datasources
   * @param {boolean} value
   * @return {void}
   */
  setUseLazyRendering(value) {
    this.useLazyRendering = value;
    if (value) {
      this.buildScrollListener();
    } else {
      this.destroyScrollListener();
    }
  }

  /**
   * @param {Object} options Text or options
   * @param {string} options.key
   * @param {(string|DocumentFragment)=} options.name
   * @param {boolean=} options.rowSelector
   * @param {string=} options.type
   * @param {boolean=} options.checkbox
   * @param {string=} options.tooltip
   * @param {boolean=} options.sortable
   * @param {boolean=} options.primaryColumn
   * @param {HTMLElement=} options.customSortIcon
   * @param {string=} options.innerHTML
   * @param {DocumentFragment=} options.fragment
   * @param {(function(HTMLTableCellElement, any, any=):void)=} options.renderer
   * @param {(function(any):any)=} options.formatter
   * @return {TableColumn}
   */
  addColumn(options) {
    const tableColumn = new TableColumn(options);
    const headerRow = this.getHeaderRow();
    headerRow.appendChild(tableColumn.element);
    this.columns.push(tableColumn);
    return tableColumn;
  }

  updatePaginator() {
    if (!this.pageLimit) {
      return;
    }
    const min = this.page * this.pageLimit;
    const total = this.getDatasource().length;
    let max = this.pageLimit + min;
    if (max > total) {
      max = total;
    }
    this.paginationDetailsElement.textContent = `${min + 1}-${max} of ${total}`;
    if (min === 0) {
      this.previousPageButton.setAttribute('disabled', '');
    } else {
      this.previousPageButton.removeAttribute('disabled');
    }
    if (max === total) {
      this.nextPageButton.setAttribute('disabled', '');
    } else {
      this.nextPageButton.removeAttribute('disabled');
    }
  }

  /**
   * @param {Object} options
   * @param {boolean=} [options.disabled=false]
   * @param {number=} [options.limit=10]
   * @param {number[]=} [options.limits=[10,25,50,100]]
   * @return {void}
   */
  setPagination(options = {}) {
    const footer = this.getFooter(!options.disabled);
    if (options.disabled) {
      this.pageLimit = 0;
      this.page = 0;
      if (footer) {
        footer.style.display = 'none';
      }
      this.needsDraw = true;
      return;
    }
    footer.style.display = '';
    let optionsElement = footer.getElementsByClassName('mdw-datatable__footer-options')[0];
    if (!optionsElement) {
      optionsElement = document.createElement('div');
      optionsElement.classList.add('mdw-datatable__footer-options');
      const rowsPerPageText = document.createElement('span');
      rowsPerPageText.textContent = 'Rows per page';
      const limits = options.limits || [10, 25, 50, 100];
      const limitsElement = document.createElement('label');
      limitsElement.classList.add('mdw-textfield');
      limitsElement.setAttribute('mdw-solo', '');
      const select = document.createElement('select');
      select.classList.add('mdw-textfield__input');
      limits.forEach((limit) => {
        const option = document.createElement('option');
        option.value = limit.toString();
        option.textContent = limit.toString();
        select.appendChild(option);
      });
      select.setAttribute('value', (options.limit && options.limit.toString()) || '10');
      const dropdownIcon = document.createElement('div');
      dropdownIcon.classList.add('mdw-textfield__dropdown-button');
      limitsElement.appendChild(select);
      limitsElement.appendChild(dropdownIcon);
      optionsElement.appendChild(rowsPerPageText);
      optionsElement.appendChild(limitsElement);
      footer.appendChild(optionsElement);
      select.addEventListener('input', () => {
        this.pageLimit = parseInt(select.value, 10);
        this.updateRowCount(false);
        this.updatePaginator();
        this.refreshRows();
      });
    }
    if (!this.paginationDetailsElement) {
      this.paginationDetailsElement = footer.getElementsByClassName('mdw-datatable__footer-details')[0];
    }
    if (!this.paginationDetailsElement) {
      this.paginationDetailsElement = document.createElement('div');
      this.paginationDetailsElement.classList.add('mdw-datatable__footer-details');
      footer.appendChild(this.paginationDetailsElement);
    }
    if (!this.paginationControls) {
      this.paginationControls = footer.getElementsByClassName('mdw-datatable__footer-controls')[0];
    }
    if (!this.paginationControls) {
      this.paginationControls = document.createElement('div');
      this.paginationControls.classList.add('mdw-datatable__footer-controls');
      footer.appendChild(this.paginationControls);
    }
    if (!this.previousPageButton || !this.nextPageButton) {
      const buttons = this.paginationControls.getElementsByClassName('mdw-button');
      if (buttons.length !== 2) {
        this.previousPageButton = document.createElement('button');
        this.previousPageButton.classList.add('mdw-button', 'material-icons');
        this.previousPageButton.setAttribute('mdw-icon', '');
        this.previousPageButton.textContent = 'chevron_left';
        this.paginationControls.appendChild(this.previousPageButton);
        Button.attach(this.previousPageButton);

        this.nextPageButton = document.createElement('button');
        this.nextPageButton.classList.add('mdw-button', 'material-icons');
        this.nextPageButton.setAttribute('mdw-icon', '');
        this.nextPageButton.textContent = 'chevron_right';
        this.paginationControls.appendChild(this.nextPageButton);
        Button.attach(this.nextPageButton);
      } else {
        this.previousPageButton = buttons[0];
        this.nextPageButton = buttons[1];
      }
      this.previousPageButton.addEventListener('click', () => {
        if (this.previousPageButton.hasAttribute('disabled')) {
          return;
        }
        this.page -= 1;
        this.updateRowCount(false);
        this.updatePaginator();
        this.refreshRows();
      });
      this.nextPageButton.addEventListener('click', () => {
        if (this.nextPageButton.hasAttribute('disabled')) {
          return;
        }
        this.page += 1;
        this.updateRowCount(false);
        this.updatePaginator();
        this.refreshRows();
      });
    }
    this.pageLimit = options.limit || 10;
    this.updateRowCount(false);
    this.updatePaginator();
    this.refreshRows();
  }

  /**
   * @param {boolean} create
   * @return {HTMLElement}
   */
  getFooter(create) {
    let footer = this.element.getElementsByClassName('mdw-datatable__footer')[0];
    if (!footer && create) {
      footer = document.createElement('div');
      footer.classList.add('mdw-datatable__footer');
      this.element.appendChild(footer);
    }
    return footer;
  }

  /**
   * @param {HTMLTableRowElement} el
   * @return {boolean}
   */
  isRowVisible(el) {
    const scrollingElement = this.element;
    const rowRect = el.getBoundingClientRect();
    const scrollingRect = scrollingElement.getBoundingClientRect();
    const rowTop = (rowRect.top) - (scrollingRect.top);
    const rowBottom = rowTop + rowRect.height;
    const viewportTop = 0;
    const viewportBottom = scrollingRect.height;
    if (rowTop > viewportTop && rowTop < viewportBottom) {
      // Top of row is visible
      return true;
    }
    if (rowBottom > viewportTop && rowBottom < viewportBottom) {
      // Bottom of row is visible
      return true;
    }
    return false;
  }

  /**
   * @param {(HTMLTableRowElement[])=} visibleRows
   * @return {void}
   */
  clearNonvisibleRows(visibleRows) {
    let rows = visibleRows;
    if (visibleRows == null) {
      rows = this.getVisibleRows();
    }
    const tbody = this.getTableBody();
    const len = tbody.rows.length;
    if (rows.length === len) {
      return;
    }
    let firstRowIndex = Infinity;
    let lastRowIndex = -Infinity;
    if (rows.length) {
      firstRowIndex = rows[0].sectionRowIndex;
      lastRowIndex = rows[rows.length - 1].sectionRowIndex;
    }
    for (let i = 0; i < len; i += 1) {
      if (i < firstRowIndex || i > lastRowIndex) {
        const row = tbody.rows.item(i);
        while (row.lastChild) {
          row.removeChild(row.lastChild);
        }
      }
    }
  }

  getVisibleRows() {
    const tbody = this.getTableBody();
    const len = tbody.rows.length;
    let foundFirstVisibleRow = false;
    const rows = [];
    for (let i = 0; i < len; i += 1) {
      const row = tbody.rows.item(i);
      if (this.isRowVisible(row)) {
        foundFirstVisibleRow = true;
        rows.push(row);
      } else if (foundFirstVisibleRow) {
        return rows;
      }
    }
    return rows;
  }

  performLazyRender() {
    const visibleRows = this.getVisibleRows();
    visibleRows.forEach((row) => {
      this.refreshRow(row.sectionRowIndex);
    });
    this.clearNonvisibleRows(visibleRows);
  }

  /**
   * @param {function(any, number=, any[]=)} filter
   * @return {void}
   */
  setFilter(filter) {
    this.filter = filter;
    this.refreshFilter();
  }

  refreshFilter() {
    if (this.filter) {
      this.filteredDatasource = this.datasource.filter(this.filter);
    } else {
      this.filteredDatasource = null;
    }
  }

  /**
   * Get filtered datasource
   * @return {any[]}
   */
  getDatasource() {
    if (this.filter) {
      if (!this.filteredDatasource) {
        this.refreshFilter();
      }
      return this.filteredDatasource;
    }
    return this.datasource;
  }

  /**
   * Update number of rows in table
   * @param {boolean=} refresh Refresh new rows
   * @return {void}
   */
  updateRowCount(refresh) {
    const tbody = this.getTableBody();
    const rowLength = tbody.rows.length;

    const datasource = this.getDatasource();
    let rowsToDisplay = datasource.length;
    if (this.pageLimit) {
      let offset = this.page * this.pageLimit;
      if (offset > rowsToDisplay) {
        // Datasource or filter likely changed
        // Reset to page 0
        this.page = 0;
        offset = 0;
      }
      rowsToDisplay -= offset;
      if (rowsToDisplay > this.pageLimit) {
        rowsToDisplay = this.pageLimit;
      }
    }

    const rowDifference = rowsToDisplay - rowLength;
    const newRows = [];

    if (rowDifference < 0) {
      // too many rows
      for (let i = rowLength - 1; i >= rowsToDisplay; i -= 1) {
        const row = tbody.rows.item(i);
        tbody.removeChild(row);
      }
    }
    if (rowDifference > 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < rowDifference; i += 1) {
        const row = document.createElement('tr');
        if (this.element.hasAttribute('mdw-row-focusable')) {
          row.setAttribute('tabindex', '-1');
        }
        newRows.push(row);
        fragment.appendChild(row);
      }
      tbody.appendChild(fragment);
    }
    if (refresh && rowDifference !== 0) {
      if (this.useLazyRendering) {
        this.performLazyRender();
      } else {
        newRows.forEach((row) => {
          this.refreshRow(row.sectionRowIndex);
        });
      }
    }
  }

  /** @return {void} */
  refreshRows() {
    if (this.useLazyRendering) {
      this.performLazyRender();
    } else {
      const tbody = this.getTableBody();
      const len = tbody.rows.length;
      for (let i = 0; i < len; i += 1) {
        this.refreshRow(i);
      }
    }
    if (this.tabindexRowData) {
      const row = this.getTableRowForData(this.tabindexRowData);
      if (row !== this.tabindexRow) {
        if (this.tabindexRow) {
          this.tabindexRow.setAttribute('tabindex', '-1');
        }
        if (row) {
          row.setAttribute('tabindex', '0');
        }
        if (document.activeElement === this.tabindexRow) {
          row.focus();
        }
        this.tabindexRow = row;
      }
    }
  }

  /** @return {void} */
  refresh() {
    this.refreshFilter();
    this.updateRowCount(false);
    this.updatePaginator();
    this.refreshRows();
  }

  /**
   * @param {HTMLTableRowElement} row
   * @return {any}
   */
  getDataForTableRow(row) {
    const index = (row.sectionRowIndex) + (this.page * this.pageLimit);
    return this.getDatasource()[index];
  }

  /**
   * @param {any} data
   * @return {HTMLTableRowElement} row
   */
  getTableRowForData(data) {
    const datasourceIndex = this.datasource.indexOf(data);
    if (datasourceIndex === -1) {
      return null;
    }
    const minIndex = this.page * this.pageLimit;
    return this.getTableBody().rows.item(datasourceIndex - minIndex);
  }

  /**
   * @param {number} rowIndex
   * @return {void}
   */
  refreshRow(rowIndex) {
    for (let columnIndex = 0; columnIndex < this.columns.length; columnIndex += 1) {
      this.refreshCell(columnIndex, rowIndex);
    }
  }

  /**
   * @param {number} columnIndex
   * @param {number} rowIndex
   * @return {void}
   */
  refreshCell(columnIndex, rowIndex) {
    const tableColumn = this.columns[columnIndex];
    const row = this.getTableBody().rows.item(rowIndex);
    let len = row.cells.length;
    while (len <= columnIndex) {
      // Generate cells
      const missingColumn = this.columns[len];
      const missingCell = row.insertCell();
      if (missingColumn.type) {
        missingCell.dataset.type = missingColumn.type;
      }
      missingCell.dataset.key = missingColumn.key;
      if (missingColumn.rowSelector) {
        missingCell.setAttribute('mdw-selector', '');
      }
      if (missingColumn.primaryColumn) {
        missingCell.setAttribute('mdw-primary-column', '');
      }
      len += 1;
    }
    const cell = row.cells.item(columnIndex);
    const data = this.getDataForTableRow(row);
    const value = data[tableColumn.key];
    if (tableColumn.rowSelector) {
      if (value) {
        if (!row.hasAttribute('mdw-selected')) {
          row.setAttribute('mdw-selected', '');
        }
      } else if (row.hasAttribute('mdw-selected')) {
        row.removeAttribute('mdw-selected');
      }
    }
    const formattedValue = tableColumn.formatter(value, data);
    tableColumn.renderer(cell, formattedValue, data);
  }

  /**
   * @param {HTMLTableCellElement|TableColumn|number|string} search
   * @return {TableColumn}
   */
  getColumn(search) {
    if (search instanceof TableColumn) {
      return search;
    }
    if (search instanceof HTMLTableCellElement) {
      return this.columns.find(column => column.element === search);
    }
    if (typeof search === 'string') {
      return this.columns.find(column => column.element.dataset.key === search);
    }
    return this.columns[search];
  }

  /** @return {HTMLTableElement} */
  getTable() {
    let table = this.element.getElementsByTagName('table')[0];
    if (!table) {
      table = document.createElement('table');
      const footer = this.element.getElementsByClassName('mdw-datatable__footer')[0];
      if (footer) {
        this.element.insertBefore(table, footer);
      } else {
        this.element.appendChild(table);
      }
    }
    return table;
  }
  /** @return {HTMLTableRowElement} */
  getHeaderRow() {
    let thead = this.element.getElementsByTagName('thead')[0];
    if (!thead) {
      const table = this.getTable();
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

  /** @return {HTMLTableSectionElement} */
  getTableBody() {
    if (this.tbody) {
      return this.tbody;
    }
    this.tbody = this.element.getElementsByTagName('tbody')[0];
    if (!this.tbody) {
      const table = this.getTable();
      this.tbody = document.createElement('tbody');
      table.appendChild(this.tbody);
    }
    return this.tbody;
  }

  /**
   * @param {number} columnIndex
   * @return {void}
   */
  refreshColumn(columnIndex) {
    const tbody = this.getTableBody();
    const rowLen = tbody.rows.length;
    for (let rowIndex = 0; rowIndex < rowLen; rowIndex += 1) {
      this.refreshCell(columnIndex, rowIndex);
    }
  }
}

export {
  DataTableAdapter,
};
