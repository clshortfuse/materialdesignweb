import { iterateArrayLike, iterateSomeOfArrayLike } from '../../core/dom';

import * as Button from '../../components/button/index';
import * as DataTable from '../../components/datatable/index';
import DataTableAdapterColumn from './column';

/**
 * @typedef {import('./column').DataTableAdapterColumnOptions<T>} DataTableAdapterColumnOptions<T>
 * @template T
 */

/**
 * Callback fired when value change is requested
 * Return truthy value to cancel updating object
 * @callback DataTableAdapterOnValueChangeRequestedCallback<T>
 * @param {T} object
 * @param {string} key
 * @param {any} value
 * @return {boolean} cancel
 * @template T
 */

/**
 * Callback fired when value is changed
 * @callback DataTableAdapterOnValueChangedCallback<T>
 * @param {T} object
 * @param {string} key
 * @param {any} value
 * @return {void}
 * @template T
 */

/**
 * @callback DataTableAdapterFilter<T>
 * @param {T} element
 * @param {number} [index]
 * @param {T[]} array
 * @return {any}
 * @template T
 */

/**
 * @callback DataTableAdapterSorter<T>
 * @param {T} a
 * @param {T} b
 * @return {number}
 * @template T
 */

/**
 * Constructor options for DataTableAdapter
 * @typedef DataTableAdapterOptions<T>
 * @prop {HTMLElement} options.datatable
 * @prop {T[]} options.datasource Object array
 * @prop {DataTableAdapterFilter<T>} [options.filter]
 * @prop {DataTableAdapterOnValueChangeRequestedCallback<T>} [options.onValueChangeRequested]
 * @prop {DataTableAdapterOnValueChangedCallback<T>} [options.onValueChanged]
 * @prop {DataTableAdapterSorter<T>} [options.sorter]
 * @template T
 */

/** @template {Object} T */
export default class DataTableAdapter {
  /** @param {DataTableAdapterOptions<T>} options */
  constructor(options) {
    this.element = options.datatable;
    this.datasource = options.datasource;
    this.filter = options.filter;
    this.sorter = options.sorter;
    this.onValueChangeRequested = options.onValueChangeRequested || (() => false);
    this.onValueChanged = options.onValueChanged || (() => {});

    this.onElementClickListener = (/** @type {MouseEvent|PointerEvent} */ event) => {
      this.handleClickInteraction(event);
    };
    // Use one click event listener to reduce overhead and allow dynamic content
    this.element.addEventListener('click', this.onElementClickListener);

    this.onElementScrollListener = () => {
      this.onElementScroll();
    };

    /** @type {HTMLTableRowElement} */
    this.tabindexRow = null;
    /** @type {Object} */
    this.tabindexRowData = null;
    this.element.addEventListener('mdw:tabindexchanged', (event) => {
      if (this.element.hasAttribute('mdw-row-focusable')) {
        this.tabindexRow = /** @type {HTMLTableRowElement} */ (event.target);
        this.tabindexRowData = this.getDataForTableRow(this.tabindexRow);
      }
    });
    DataTable.attach(this.element);
    this.scroller = DataTable.getScroller(this.element);
    this.element.setAttribute('mdw-datatable-adapter', '');
    /** @type {DataTableAdapterColumn<T>[]} */
    this.columns = [];
    this.page = 0;
    this.pageLimit = 0;
    this.debounceTimeMs = 0;
    this.throttleTimeMs = 0;
    this.useLazyRendering = false;
  }

  detach() {
    this.element.removeAttribute('mdw-datatable-adapter');
    this.element = null;
    this.datasource = null;
    this.filteredDatasource = null;
  }

  /**
   * @param {boolean} [forceRefresh=false]
   * @return {void}
   */
  performThrottledRender(forceRefresh = false) {
    this.performLazyRender(forceRefresh);
    if (this.throttledRenderPending) {
      this.throttledRenderPending = false;
      this.scheduleThrottledRender();
    }
  }

  /**
   * @param {boolean} [forceRefresh=false]
   * @return {void}
   */
  scheduleThrottledRender(forceRefresh = false) {
    if (this.throttleTimeMs < 17) {
      window.requestAnimationFrame(() => this.performThrottledRender(forceRefresh));
    } else {
      setTimeout(() => this.performThrottledRender(forceRefresh), this.throttleTimeMs);
    }
  }

  onElementScroll() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = null;
    }
    if (this.throttledRenderPending) {
      // Will perform in the future
      return;
    }
    if (this.debounceTimeMs) {
      this.debounceTimeout = setTimeout(() => {
        this.scheduleThrottledRender();
        this.throttledRenderPending = true;
      }, this.debounceTimeMs);
    } else {
      this.scheduleThrottledRender();
      this.throttledRenderPending = true;
    }
  }

  buildScrollListener() {
    this.scroller.addEventListener('scroll', this.onElementScrollListener);
  }

  destroyScrollListener() {
    this.scroller.removeEventListener('scroll', this.onElementScrollListener);
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @return {void}
   */
  handleClickInteraction(event) {
    const { target } = event;
    if (target instanceof HTMLInputElement) {
      if (target.type === 'checkbox') {
        event.stopPropagation();
        const currentCell = this.getTableCell(target);
        if (currentCell.tagName.toLowerCase() === 'th') {
          this.setCheckOnAllRows(target.checked, currentCell.cellIndex);
          this.setHasSelection(target.checked);
          return;
        }
        const currentRow = this.getTableRow(target);
        const object = this.getDataForTableRow(currentRow);
        if (this.onValueChangeRequested(object, currentCell.dataset.key, target.checked)) {
          event.preventDefault();
          return;
        }
        object[currentCell.dataset.key] = target.checked;
        this.onValueChanged(object, currentCell.dataset.key, target.checked);
        if (currentCell.hasAttribute('mdw-selector')) {
          if (target.checked) {
            currentRow.setAttribute('aria-selected', 'true');
            this.setHasSelection(true);
          } else {
            currentRow.removeAttribute('aria-selected');
            const selectedRows = this.getSelectedRows();
            this.setHasSelection(selectedRows.length !== 0);
          }
        }
      }
      return;
    }
    const currentCell = this.getTableCell(/** @type {HTMLElement} */ (target));
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
      }
    }
  }

  /**
   * Overridable sorting method
   * @param {HTMLTableHeaderCellElement} [tableHeaderCell] null if none
   * @param {boolean} [ascending=false]
   * @return {void}
   */
  updateSortColumn(tableHeaderCell, ascending) {
    if (!tableHeaderCell) {
      this.sorter = null;
      this.refresh();
      return;
    }
    if (tableHeaderCell.cellIndex === -1) {
      // Header not attached to row!
      return;
    }
    const index = tableHeaderCell.cellIndex;
    const tableColumn = this.columns[index];
    const direction = ascending ? 1 : -1;
    this.sorter = ((/** @type {T} */ a, /** @type {T} */ b) => {
      const valueA = a[tableColumn.key];
      const valueB = b[tableColumn.key];
      if (valueA == null) {
        if (valueB == null) {
          return 0;
        }
        return -1 * direction;
      }
      if (valueB == null) {
        return direction;
      }
      if (tableColumn.type === 'number') {
        return (parseFloat(valueA) - parseFloat(valueB)) * direction;
      }
      if (tableColumn.type === 'checkbox') {
        return ((valueA ? 1 : 0) - (valueB ? 1 : 0)) * direction;
      }
      if (valueA.localeCompare) {
        return valueA.localeCompare(valueB) * direction;
      }
      // eslint-disable-next-line eqeqeq
      if (valueA == valueB) {
        return 0;
      }
      return (valueA - valueB) * direction;
    });
    this.refresh();
  }

  /**
   * @param {HTMLTableHeaderCellElement} [sortedTableHeaderCell] null if none
   * @param {boolean} [ascending=false]
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
    iterateArrayLike(this.element.getElementsByTagName('th'), (otherTableHeader) => {
      if (otherTableHeader !== sortedTableHeaderCell) {
        otherTableHeader.removeAttribute('mdw-sorted');
      }
    });
  }

  /**
   * @param {boolean} value
   * @param {number} columnIndex
   * @return {void}
   */
  setCheckOnAllRows(value, columnIndex) {
    const column = this.columns[columnIndex];
    this.datasource.forEach((object) => {
      object[column.key] = value; // eslint-disable-line no-param-reassign
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

  /** @return {T[]} */
  getSelectedRows() {
    const selectorColumn = this.columns.filter(column => column.rowSelector)[0];
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
   * @param {T[]} datasource Object array
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
   * @param {DataTableAdapterColumnOptions<T>} options
   * @return {DataTableAdapterColumn<T>}
   */
  addColumn(options) {
    const tableColumn = new DataTableAdapterColumn(options);
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
    this.previousPageButton.setAttribute('aria-disabled', (min === 0 ? 'true' : 'false'));
    this.nextPageButton.setAttribute('aria-disabled', (max === total ? 'true' : 'false'));
  }

  /**
   * @param {Object} options
   * @param {boolean} [options.disabled=false]
   * @param {number} [options.limit=10]
   * @param {number[]} [options.limits=[10,25,50,100]]
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
      select.value = (options.limit && options.limit.toString()) || '10';
      const dropdownIcon = document.createElement('div');
      dropdownIcon.classList.add('mdw-textfield__icon');
      dropdownIcon.setAttribute('mdw-dropdown', '');
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
        this.previousPageButton = document.createElement('a');
        this.previousPageButton.classList.add('mdw-button');
        this.previousPageButton.classList.add('material-icons');
        this.previousPageButton.setAttribute('mdw-icon', '');
        this.previousPageButton.textContent = 'chevron_left';
        this.paginationControls.appendChild(this.previousPageButton);
        Button.attach(this.previousPageButton);

        this.nextPageButton = document.createElement('a');
        this.nextPageButton.classList.add('mdw-button');
        this.nextPageButton.classList.add('material-icons');
        this.nextPageButton.setAttribute('mdw-icon', '');
        this.nextPageButton.textContent = 'chevron_right';
        this.paginationControls.appendChild(this.nextPageButton);
        Button.attach(this.nextPageButton);
      } else {
        this.previousPageButton = buttons[0];
        this.nextPageButton = buttons[1];
      }
      this.previousPageButton.addEventListener('click', () => {
        if (this.previousPageButton.getAttribute('aria-disabled') === 'true') {
          return;
        }
        this.page -= 1;
        this.updateRowCount(false);
        this.updatePaginator();
        this.refreshRows();
      });
      this.nextPageButton.addEventListener('click', () => {
        if (this.nextPageButton.getAttribute('aria-disabled') === 'true') {
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
    /** @type {HTMLElement} */
    let footer = (this.element.getElementsByClassName('mdw-datatable__footer')[0]);
    if (!footer && create) {
      footer = document.createElement('div');
      footer.classList.add('mdw-datatable__footer');
      this.element.appendChild(footer);
    }
    return footer;
  }

  /**
   * @param {HTMLTableRowElement} el
   * @param {?number} viewportTop
   * @param {?number} viewportBottom
   * @return {boolean}
   */
  isRowVisible(
    el,
    viewportTop = this.scroller.scrollTop,
    viewportBottom = this.scroller.scrollTop + this.scroller.offsetHeight
  ) {
    const rowTop = el.offsetTop;
    const rowBottom = rowTop + el.offsetHeight;
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
   * @param {(HTMLTableRowElement[])} visibleRows
   * @return {void}
   */
  clearNonvisibleRows(visibleRows) {
    const tbody = this.getTableBody();
    if (visibleRows.length === tbody.rows.length) {
      return;
    }
    let firstRowIndex = Infinity;
    let lastRowIndex = -Infinity;
    if (visibleRows.length) {
      firstRowIndex = visibleRows[0].sectionRowIndex;
      lastRowIndex = visibleRows[visibleRows.length - 1].sectionRowIndex;
    }
    iterateArrayLike(tbody.rows, (row, index) => {
      if (index >= firstRowIndex && index <= lastRowIndex) {
        return;
      }
      if (row.lastChild) {
        // Store row height to prevent layout shifting
        row.style.setProperty('height', `${row.offsetHeight || 0}px`);
      }
      while (row.lastChild) {
        row.removeChild(row.lastChild);
      }
    });
  }

  /**
   * @return {HTMLTableRowElement[]}
   */
  getLazyRenderRows() {
    const tbody = this.getTableBody();
    const len = tbody.rows.length;
    /** @type {HTMLTableRowElement[]} */
    const rows = [];
    const minRowCount = window.screen.height / 48;
    if (len <= minRowCount) {
      iterateArrayLike(tbody.rows, (row) => {
        rows.push(row);
      });
      return rows;
    }
    let foundFirstVisibleRow = false;
    let startIndex = 0;
    let endIndex = 0;
    const viewportTop = this.scroller.scrollTop;
    const viewportBottom = viewportTop + this.scroller.offsetHeight;
    iterateSomeOfArrayLike(tbody.rows, (row, index) => {
      if (this.isRowVisible(row, viewportTop, viewportBottom)) {
        if (!foundFirstVisibleRow) {
          foundFirstVisibleRow = true;
          startIndex = index;
        }
        endIndex = index;
      } else if (foundFirstVisibleRow) {
        return true;
      }
      return false;
    });

    while ((endIndex - startIndex) + 1 < minRowCount) {
      if (startIndex === 0) {
        endIndex += 1;
      } else if (endIndex === len - 1) {
        startIndex -= 1;
      } else {
        startIndex -= 1;
        endIndex += 1;
      }
    }
    for (let i = startIndex; i <= endIndex; i += 1) {
      rows.push(tbody.rows.item(i));
    }

    return rows;
  }

  /**
   * @param {boolean} forceRefresh
   * @return {void}
   */
  performLazyRender(forceRefresh = false) {
    const visibleRows = this.getLazyRenderRows();
    visibleRows.forEach((row) => {
      if (forceRefresh || !row.cells.length) {
        this.refreshRow(row.sectionRowIndex);
      }
    });
    this.clearNonvisibleRows(visibleRows);
  }

  /**
   * @param {DataTableAdapterFilter<T>} filter
   * @return {void}
   */
  setFilter(filter) {
    this.filter = filter;
    this.refreshFilter();
  }

  /**
   * @param {DataTableAdapterSorter<T>} sorter
   * @return {void}
   */
  setSorter(sorter) {
    this.sorter = sorter;
    this.refreshFilter();
  }

  refreshFilter() {
    if (this.filter && this.sorter) {
      this.filteredDatasource = this.datasource.filter(this.filter).sort(this.sorter);
    } else if (this.filter) {
      this.filteredDatasource = this.datasource.filter(this.filter);
    } else if (this.sorter) {
      this.filteredDatasource = this.datasource.slice(0).sort(this.sorter);
    } else {
      this.filteredDatasource = null;
    }
  }

  /**
   * Get filtered datasource
   * @return {T[]}
   */
  getDatasource() {
    if (this.filter || this.sorter) {
      if (this.filteredDatasource == null) {
        this.refreshFilter();
      }
      return this.filteredDatasource;
    }
    return this.datasource;
  }

  /**
   * Update number of rows in table
   * @param {boolean} [refresh=false] Refresh new rows
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
        this.scheduleThrottledRender(true);
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
      this.performLazyRender(true);
    } else {
      const tbody = this.getTableBody();
      iterateArrayLike(tbody.rows, (row, index) => {
        this.refreshRow(index);
      });
    }
    if (this.tabindexRowData) {
      const row = this.getTableRowForData(this.tabindexRowData);
      if (row !== this.tabindexRow) {
        if (this.tabindexRow) {
          this.tabindexRow.setAttribute('tabindex', '-1');
        }
        if (row) {
          if (document.activeElement === this.tabindexRow) {
            row.focus();
          }
          DataTable.updateTabIndex(row, false);
        }
        this.tabindexRow = row;
      }
    }
    if (this.useLazyRendering) {
      this.scheduleThrottledRender();
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
   * @return {T}
   */
  getDataForTableRow(row) {
    const index = (row.sectionRowIndex) + (this.page * this.pageLimit);
    return this.getDatasource()[index];
  }

  /**
   * @param {T} data
   * @return {HTMLTableRowElement} row
   */
  getTableRowForData(data) {
    const datasourceIndex = this.getDatasource().indexOf(data);
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
    const row = this.getTableBody().rows.item(rowIndex);
    row.style.removeProperty('height');
    this.columns.forEach((column, columnIndex) => {
      this.refreshCell(columnIndex, rowIndex);
    });
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
      if (row.getAttribute('aria-selected') !== (value ? 'true' : 'false')) {
        row.setAttribute('aria-selected', (value ? 'true' : 'false'));
      }
    }
    const formattedValue = tableColumn.formatter(value, data);
    tableColumn.renderer(cell, formattedValue, data);
  }

  /**
   * @param {HTMLTableCellElement|DataTableAdapterColumn<T>|number|string} search
   * @return {DataTableAdapterColumn<T>}
   */
  getColumn(search) {
    if (search instanceof DataTableAdapterColumn) {
      return search;
    }
    if (search instanceof HTMLTableCellElement) {
      return this.columns.filter(column => column.element === search)[0];
    }
    if (typeof search === 'string') {
      return this.columns.filter(column => column.element.dataset.key === search)[0];
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
    iterateArrayLike(tbody.rows, (row, rowIndex) => {
      this.refreshCell(columnIndex, rowIndex);
    });
  }
}
