import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default class SegmentedButton extends Button {
  static elementName = 'mdw-segmented-button';

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon icon=check aria-hidden="true"></mdw-icon>
    `,
  ];

  static styles = [...super.styles, styles];

  constructor() {
    super();
    this.checkIconElement = this.shadowRoot.getElementById('check-icon');
    this.outlined = true;
    this.setAttribute('mdw-overlay-disabled', 'focus');
    if (!this.hasAttribute('type')) {
      this.type = 'radio';
      this.attributeChangedCallback('type', null, 'radio');
    }
    this.inputElement.setAttribute('role', 'option');
    this.labelElement.appendChild(this.checkIconElement);
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Listboxes should always receive focus
    if (name === 'disabled') {
      this.inputElement.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'checked' || name === 'type') {
      const attribute = this.type === 'checkbox' ? 'aria-checked' : 'aria-selected';
      this.inputElement.setAttribute(attribute, this.checked ? 'true' : 'false');
    }
  }

  connectedCallback() {
    super.connectedCallback();
    RovingTabIndex.attach(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    RovingTabIndex.detach(this);
  }
}
