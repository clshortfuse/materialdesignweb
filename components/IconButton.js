import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default class IconButton extends TooltipTriggerMixin(Button) {
  static { this.autoRegister(); }

  static elementName = 'mdw-icon-button';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;

    template.getElementById('slot').remove();
    template.getElementById('tooltip-slot').removeAttribute('name');
    // icon.append(template.getElementById('slot'));
    const icon = template.getElementById('icon');
    icon.setAttribute('style', '{computeIconStyle}');

    const control = template.getElementById('control');
    control.setAttribute('aria-pressed', '{computeAriaPressed}');
    control.setAttribute('aria-labelledby', 'toolbar');

    return template;
  }

  /** @return {string?} */
  computeAriaPressed() {
    const { type, _checked } = this;
    if (type !== 'checkbox') return null;
    return _checked ? 'true' : 'false';
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  onControlKeyDown(event) {
    if (event.key !== 'Enter') return;
    if (this.type !== 'checkbox') return;
    event.stopPropagation();
    event.preventDefault();
    if (this.disabled) return;

    // Simulate click
    const clickEvent = new Event('click', { bubbles: true, cancelable: true, composed: true });
    if (!this.dispatchEvent(clickEvent)) return;

    // Toggle check and signal
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
