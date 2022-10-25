import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default class SegmentedButton extends Button {
  static elementName = 'mdw-segmented-button';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon _if={icon} id=check-icon aria-hidden=true>check</mdw-icon>
    `,
  ];

  static get template() {
    const template = super.template;
    template.getElementById('label').append(
      template.getElementById('check-icon'),
    );
    const control = template.getElementById('control');
    control.setAttribute('type', 'radio');
    control.setAttribute('role', 'option');
    template.getElementById('overlay').setAttribute('overlay-disabled', 'focus');
    return template;
  }

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

  constructor() {
    super();
    this.outlined = true;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Listboxes should always receive focus
    if (name === 'disabled') {
      this.#input.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** @type {Button['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (name === 'checked' || name === 'type') {
      const attribute = this.type === 'checkbox' ? 'aria-checked' : 'aria-selected';
      this.#input.setAttribute(attribute, this.checked ? 'true' : 'false');
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

SegmentedButton.prototype.type = SegmentedButton.idl('type', { empty: 'radio' });
