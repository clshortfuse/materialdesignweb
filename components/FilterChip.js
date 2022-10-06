import Chip from './Chip.js';
import styles from './FilterChip.css' assert { type: 'css' };
import Icon from './Icon.js';

export default class FilterChip extends Chip {
  static elementName = 'mdw-filter-chip';

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon icon=check aria-hidden="true"></mdw-icon>
      <mdw-icon id=trailing-icon aria-hidden="true"></mdw-icon>
    `,
  ];

  static styles = [...super.styles, styles];

  constructor() {
    super();

    this.checkIconElement = /** @type {Icon} */ (this.shadowRoot.getElementById('check-icon'));
    this.trailingIconElement = /** @type {Icon} */ (this.shadowRoot.getElementById('trailing-icon'));
    this.labelElement.append(
      this.checkIconElement,
      this.trailingIconElement,
    );

    this.inputElement.removeAttribute('role');
    this.inputElement.autocomplete = 'off';
    if (!this.hasAttribute('type')) {
      this.type = 'checkbox';
      this.attributeChangedCallback('type', null, 'checkbox');
    }

    // this.labelElement.append(...this.buttonElement.children);
    // Aria will use aria-labelledby instead
    // Fallback with wrapped HTMLLabelElement

    if (this.getAttribute('trailing-icon') === '') {
      this.setAttribute('trailing-icon', 'dropdown');
      this.attributeChangedCallback('trailing-icon', null, 'dropdown');
    }
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'trailing-icon':
        if (newValue) {
          this.trailingIconElement.setAttribute('icon', newValue);
        }
        break;
      case 'trailing-src':
        if (newValue == null) {
          this.trailingIconElement.removeAttribute('src');
        } else {
          this.trailingIconElement.setAttribute('src', newValue);
        }
        break;
      default:
    }
  }
}
