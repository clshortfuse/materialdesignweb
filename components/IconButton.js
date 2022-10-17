import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default class IconButton extends Button {
  static elementName = 'mdw-icon-button';

  static styles = [...super.styles, styles];

  constructor() {
    super();
    this.toggleAttribute('icon', true);
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

  compose() {
    const fragment = super.compose();
    fragment.getElementById('icon').append(
      fragment.getElementById('slot'),
    );
    return fragment;
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
      case 'type':
        if (newValue === null) {
          this.refs.control.removeAttribute('aria-pressed');
        } else if (newValue === 'checkbox') {
          this.refs.control.setAttribute('aria-pressed', this.checked ? 'true' : 'false');
        }
        break;
      case 'selected':
        if (this.type !== 'checkbox') {
          this.refs.control.removeAttribute('aria-pressed');
        }
        this.refs.control.setAttribute('aria-pressed', newValue == null ? 'false' : 'true');

        break;
      default:
    }
  }
}

IconButton.idlMap.delete('icon');
