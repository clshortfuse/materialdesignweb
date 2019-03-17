/**
 * @callback DataTableAdapterColumnFormatter<T>
 * @param {any} value
 * @param {T=} object
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
 * @property {(string|DocumentFragment)=} name
 * @property {string=} type
 * @property {boolean=} rowSelector
 * @property {string=} tooltip
 * @property {boolean=} sortable
 * @property {boolean=} primaryColumn
 * @property {HTMLElement=} customSortIcon
 * @property {string=} innerHTML
 * @property {DocumentFragment=} fragment
 * @property {DataTableAdapterColumnRenderer<T>=} renderer
 * @property {DataTableAdapterColumnFormatter<T>=} formatter
 * @template T
 */


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
      this.element.setAttribute('mdw-sortable', '');
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
      this.renderer = DataTableAdapterColumn.defaultCheckboxRenderer;
    } else {
      this.renderer = DataTableAdapterColumn.defaultCellRenderer;
    }
    this.formatter = options.formatter || (value => value);
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
