import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default class IconButton extends Button {
  static elementName = 'mdw-icon-button';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    template.getElementById('icon').append(
      template.getElementById('slot'),
    );
    return template;
  }

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

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
          this.#input.removeAttribute('aria-pressed');
        } else if (newValue === 'checkbox') {
          this.#input.setAttribute('aria-pressed', this.checked ? 'true' : 'false');
        }
        break;
      case 'selected':
        if (this.type !== 'checkbox') {
          this.#input.removeAttribute('aria-pressed');
        }
        this.#input.setAttribute('aria-pressed', newValue == null ? 'false' : 'true');

        break;
      default:
    }
  }
}

IconButton.getIdls().delete('icon');
