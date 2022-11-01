import Chip from './Chip.js';
import styles from './FilterChip.css' assert { type: 'css' };
import './Icon.js';

export default class FilterChip extends Chip {
  static { this.autoRegister(); }

  static elementName = 'mdw-filter-chip';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.getElementById('label').append(html`
      <mdw-icon id=check-icon aria-hidden="true">check</mdw-icon>
      <mdw-icon id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
    `);
    const control = template.getElementById('control');
    control.removeAttribute('role');
    control.setAttribute('autocomplete', 'off');
    control.setAttribute('type', 'checkbox');
    return template;
  }

  constructor() {
    super();

    // this.labelElement.append(...this.buttonElement.children);
    // Aria will use aria-labelledby instead
    // Fallback with wrapped HTMLLabelElement

    if (this.trailingIcon === '') {
      this.trailingIcon = 'dropdown';
    }
  }
}

FilterChip.prototype.type = FilterChip.idl('type', { empty: 'checkbox' });
FilterChip.prototype.trailingIcon = FilterChip.idl('trailingIcon');
FilterChip.prototype.trailingSrc = FilterChip.idl('trailingSrc');
