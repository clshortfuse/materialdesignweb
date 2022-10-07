import Chip from './Chip.js';
import styles from './FilterChip.css' assert { type: 'css' };
import Icon from './Icon.js';

export default class FilterChip extends Chip {
  static elementName = 'mdw-filter-chip';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon icon=check aria-hidden="true"></mdw-icon>
      <mdw-icon id=trailing-icon aria-hidden="true"></mdw-icon>
    `,
  ];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('label').append(
      fragment.getElementById('check-icon'),
      fragment.getElementById('trailing-icon'),
    );
    const input = fragment.getElementById('input');
    input.removeAttribute('role');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('type', 'checkbox');
    return fragment;
  }

  constructor() {
    super();

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
          this.refs.trailingIcon.setAttribute('icon', newValue);
        }
        break;
      case 'trailing-src':
        if (newValue == null) {
          this.refs.trailingIcon.removeAttribute('src');
        } else {
          this.refs.trailingIcon.setAttribute('src', newValue);
        }
        break;
      default:
    }
  }
}

FilterChip.prototype.refs = {
  ...Chip.prototype.refs,
  ...FilterChip.addRefs({
    trailingIcon: Icon,
  }),
};
