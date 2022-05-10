import * as DataTableColumnHeader from '../../components/datatable/columnheader.js';
import * as Selection from '../../components/selection/index.js';
import * as Attributes from '../../core/aria/attributes.js';
import { setTextNode } from '../../core/dom.js';

/**
 * @template {Record<string, any>} T
 * @template {(keyof T & string)|string} K
 * @template {any} [R=any]
 * @callback DataTableAdapterColumnFormatter<T,K,R>
 * @param {K extends keyof T ? T[K] : undefined} value
 * @param {T} [object]
 * @return {R}
 */

/**
 * @template {Record<string, any>} T
 * @callback DataTableAdapterColumnSorter<T>
 * @param {T} a
 * @param {T} b
 * @return {number}
 */

/**
 * @template {Record<string, any>} T
 * @template {any} V
 * @callback DataTableAdapterColumnRenderer<T,V>
 * @param {HTMLTableCellElement} cell
 * @param {V} value
 * @param {T} data
 * @return {void}
 */

/**
 * Constructor options for DataTableAdapterColumn
 * @template {Record<string, any>} T
 * @template {(keyof T & string)|string} K
 * @template {any} [R=any]
 * @typedef DataTableAdapterColumnOptions<T,K>
 * @prop {K} key
 * @prop {(string|DocumentFragment)} [name='']
 * @prop {'number'|'text'|'checkbox'} [type]
 * @prop {boolean} [rowSelector]
 * @prop {string} [tooltip]
 * @prop {boolean} [sortable]
 * @prop {boolean} [primaryColumn]
 * @prop {HTMLElement} [customSortIcon]
 * @prop {string} [innerHTML]
 * @prop {DocumentFragment} [fragment]
 * @prop {(value:K extends keyof T ? T[K] : undefined, object:T) => R} [formatter]
 * @prop {(cell: HTMLTableCellElement, value: R, data: T) => any} [renderer]
 * @prop {DataTableAdapterColumnSorter<T>} [sorter]
 */

/** @return {HTMLElement} */
function constructTableCheckbox() {
  const element = document.createElement('div');
  element.className = 'mdw-selection';
  element.setAttribute('aria-checked', 'false');
  const input = element.appendChild(document.createElement('div'));
  input.className = 'mdw-selection__input mdw-datatable__widget';
  const icon = element.appendChild(document.createElement('div'));
  icon.className = 'mdw-selection__icon';
  icon.setAttribute('mdw-checkbox', '');
  Selection.attach(element);
  return element;
}

/**
 * @template {Record<string, any>} T
 * @template {(keyof T & string)|string} K
 */
export default class DataTableAdapterColumn {
  /** @param {DataTableAdapterColumnOptions<T,K>} options */
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
        sortIcon = document.createElement('span');
        sortIcon.className = 'mdw-datatable__sort-icon material-icons';
        sortIcon.textContent = 'arrow_downward';
      }
      this.element.prepend(sortIcon);
    }
    if (options.tooltip) {
      const wrapper = document.createElement('span');
      wrapper.className = 'mdw-tooltip__wrapper';
      const target = wrapper.appendChild(document.createElement('span'));
      target.className = 'mdw-tooltip__target';
      target.append(options.name || '');
      const tooltip = wrapper.appendChild(document.createElement('span'));
      tooltip.className = 'mdw-tooltip mdw-theme';
      tooltip.setAttribute('mdw-surface', 'background 700');
      tooltip.setAttribute('mdw-dark', '');
      tooltip.textContent = options.tooltip;
      this.element.appendChild(wrapper);
    } else if (options.name) {
      this.element.append(options.name);
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
      // case 'checkbox':
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
    this.formatter = options.formatter || ((/** @type {any} */ value) => value);
    this.sorter = options.sorter;
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
    const checked = !!value;
    const selectionElement = cell.getElementsByClassName('mdw-selection')[0]
      || cell.appendChild(constructTableCheckbox());
    Attributes.setChecked(selectionElement, checked);
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @param {any} value
   * @return {void}
   */
  static defaultCellRenderer(cell, value) {
    const stringValue = (value == null) ? '' : value.toString();
    setTextNode(cell, stringValue);
  }
}
