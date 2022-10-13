import Chip from './Chip.js';
import styles from './FilterChip.css' assert { type: 'css' };
import Icon from './Icon.js';

export default class FilterChip extends Chip {
  static elementName = 'mdw-filter-chip';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon aria-hidden="true">check</mdw-icon>
      <mdw-icon id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
    `,
  ];

  constructor() {
    super();

    // this.labelElement.append(...this.buttonElement.children);
    // Aria will use aria-labelledby instead
    // Fallback with wrapped HTMLLabelElement

    if (this.trailingIcon === '') {
      this.trailingIcon = 'dropdown';
    }
  }

  compose() {
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
}

FilterChip.prototype.trailingIcon = FilterChip.idl('trailingIcon');
FilterChip.prototype.trailingSrc = FilterChip.idl('trailingSrc');
