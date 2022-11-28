import './Icon.js';
import { addInlineFunction } from '../core/template.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default class SegmentedButton extends Button {
  static { this.autoRegister(); }

  static elementName = 'mdw-segmented-button';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.getElementById('label').append(html`
      <mdw-icon _if={icon} id=check-icon aria-hidden=true>check</mdw-icon>
    `);
    const control = template.getElementById('control');
    control.setAttribute('type', 'radio');
    control.setAttribute('role', 'option');
    control.setAttribute('aria-checked', addInlineFunction(
      (/** @type {SegmentedButton} */ { type, checked }) => (type === 'checkbox' ? String(!!checked) : null),
    ));
    control.setAttribute('aria-selected', addInlineFunction(
      (/** @type {SegmentedButton} */ { type, checked }) => (type !== 'checkbox' ? String(!!checked) : null),
    ));
    template.getElementById('state').setAttribute('state-disabled', 'focus');
    return template;
  }

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

  constructor() {
    super();
    this.outlined = true;
  }

  /** @type {Button['attributeChangedCallback']} */
  attributeChangedCallback(name, oldValue, newValue) {
    // Listboxes should always receive focus
    if (name === 'disabled') {
      this.#input.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }
}

SegmentedButton.prototype.type = SegmentedButton.idl('type', { empty: 'radio' });
