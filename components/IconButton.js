import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default class IconButton extends Button {
  static { this.autoRegister(); }

  static elementName = 'mdw-icon-button';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    const icon = template.getElementById('icon');
    icon.append(template.getElementById('slot'));
    icon.setAttribute('style', '{static.computeIconStyle}');
    const control = template.getElementById('control');
    control.setAttribute('aria-pressed', '{static.computeAriaPressed}');

    return template;
  }

  constructor() {
    super();
    this.toggleAttribute('icon', true);
  }

  /** @this {IconButton} */
  static computeIconStyle() {
    return this.iconSize !== '24px' ? `--mdw-icon__size:${this.iconSize}` : null;
  }

  /**
   * @param {IconButton} instance
   * @return {string?}
   */
  static computeAriaPressed({ type, _checked }) {
    if (type !== 'checkbox') return null;
    return _checked ? 'true' : 'false';
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onControlKeyDown(event) {
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

IconButton.getIdls().delete('icon');
IconButton.prototype.iconSize = IconButton.idl('iconSize', { empty: '24px' });
