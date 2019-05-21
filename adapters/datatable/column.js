import * as Attributes from '../../core/aria/attributes';
import * as DataTableColumnHeader from '../../components/datatable/columnheader';
import * as Selection from '../../components/selection/index';
import { setTextNode } from '../../core/dom';

/**
 * @callback DataTableAdapterColumnFormatter<T>
 * @param {any} value
 * @param {T} [object]
 * @return {any}
 * @template T
 */

/**
 * @callback DataTableAdapterColumnRenderer<T>
 * @param {HTMLTableCellElement} cell,
 * @param {any} value
 * @param {T} data
 * @return {void}
 * @template T
 */

/**
 * Constructor options for DataTableAdapterColumn
 * @typedef DataTableAdapterColumnOptions<T>
 * @property {string} key
 * @property {(string|DocumentFragment)} [name='']
 * @property {'checkbox'|'text'|'number'} [type]
 * @property {boolean} [rowSelector]
 * @property {string} [tooltip]
 * @property {boolean} [sortable]
 * @property {boolean} [primaryColumn]
 * @property {HTMLElement} [customSortIcon]
 * @property {string} [innerHTML]
 * @property {DocumentFragment} [fragment]
 * @property {DataTableAdapterColumnRenderer<T>} [renderer]
 * @property {DataTableAdapterColumnFormatter<T>} [formatter]
 * @template T
 */

/** @return {HTMLElement} */
function constructTableCheckbox() {
  const element = document.createElement('div');
  element.className = 'mdw-selection';
  element.setAttribute('aria-checked', 'false');
  const input = document.createElement('div');
  input.className = 'mdw-selection__input mdw-datatable__widget';
  const icon = document.createElement('div');
  icon.className = 'mdw-selection__icon';
  icon.setAttribute('mdw-checkbox', '');
  element.appendChild(input);
  element.appendChild(icon);
  Selection.attach(element);
  return element;
}

/**
 * @template T
 */
export default class DataTableAdapterColumn {
  /** @param {DataTableAdapterColumnOptions<T>} options */
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
      this.element.setAttribute('aria-sort', 'none');
      let sortIcon = options.customSortIcon;
      if (!sortIcon) {
        sortIcon = document.createElement('div');
        sortIcon.classList.add('mdw-datatable__sort-icon');
        sortIcon.classList.add('material-icons');
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
      tooltip.className = 'mdw-tooltip mdw-theme';
      tooltip.setAttribute('mdw-surface', 'background 700');
      tooltip.setAttribute('mdw-dark', '');
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

    this.type = options.type;
    switch (options.type) {
      case 'number':
        this.element.setAttribute('mdw-number', '');
        break;
      case 'text':
        this.element.setAttribute('mdw-text', '');
        break;
      case 'checkbox':
      default:
    }

    if (this.rowSelector && this.type === 'checkbox') {
      const checkboxLabel = constructTableCheckbox();
      this.element.appendChild(checkboxLabel);
      this.element.classList.add('mdw-autofocus-widget');
    }

    if (options.renderer) {
      this.renderer = options.renderer;
    } else if (options.type === 'checkbox') {
      this.renderer = DataTableAdapterColumn.defaultCheckboxRenderer;
    } else {
      this.renderer = DataTableAdapterColumn.defaultCellRenderer;
    }
    this.formatter = options.formatter || (value => value);
    DataTableColumnHeader.attach(this.element);
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @param {any} value
   * @return {void}
   */
  static defaultCheckboxRenderer(cell, value) {
    if (!cell.classList.contains('mdw-autofocus-widget')) {
      cell.classList.add('mdw-autofocus-widget');
    }
    let selectionElement = cell.getElementsByClassName('mdw-selection')[0];
    const checked = !!value;
    if (!selectionElement) {
      selectionElement = constructTableCheckbox();
      cell.appendChild(selectionElement);
    }
    Attributes.setChecked(selectionElement, checked);
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
    setTextNode(cell, stringValue);
  }
}
