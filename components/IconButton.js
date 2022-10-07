import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default class IconButton extends Button {
  static elementName = 'mdw-icon-button';

  static styles = [...super.styles, styles];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('icon').append(
      fragment.getElementById('slot'),
    );
    return fragment;
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    if (this.type !== 'checkbox') return;
    if (this.disabled) return;
    /** @type {{host:IconButton}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.toggleAttribute('checked', this.checked);
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputKeyDown(event) {
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

  constructor() {
    super();
    this.icon = '';
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
          this.refs.input.removeAttribute('aria-pressed');
        } else if (newValue === 'checkbox') {
          this.refs.input.setAttribute('aria-pressed', this.checked ? 'true' : 'false');
        }
        break;
      case 'checked':
        if (this.type !== 'checkbox') {
          this.refs.input.removeAttribute('aria-pressed');
        }
        this.refs.input.setAttribute('aria-pressed', newValue == null ? 'false' : 'true');

        break;
      default:
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const { input } = this.refs;
    input.addEventListener('change', IconButton.onInputChange, { passive: true });
    input.addEventListener('keydown', IconButton.onInputKeyDown);
  }
}
