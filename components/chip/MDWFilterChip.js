import * as AriaCheckbox from '../../core/aria/checkbox.js';

import MDWChip from './MDWChip.js';
import styles from './MDWFilterChip.css' assert { type: 'css' };

export default class MDWFilterChip extends MDWChip {
  constructor() {
    super();
    if (!this.hasAttribute('mdw-icon')) {
      this.setAttribute('mdw-icon', 'check');
      super.attributeChangedCallback('mdw-icon', null, 'check');
    }
  }

  static elementName = 'mdw-filter-chip';

  static get styles() { return [...super.styles, styles]; }

  connectedCallback() {
    super.connectedCallback();
    if (this.getAttribute('role') === 'checkbox') {
      AriaCheckbox.attach(this);
    }
  }

  disconnectedCallback() {
    AriaCheckbox.detach(this);
    super.disconnectedCallback();
  }
}
