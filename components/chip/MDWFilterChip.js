import MDWChip from './MDWChip.js';
import styles from './MDWFilterChip.css' assert { type: 'css' };

export default class MDWFilterChip extends MDWChip {
  constructor() {
    super();

    this.checkIconElement = this.shadowRoot.getElementById('check-icon');
    this.trailingIconElement = this.shadowRoot.getElementById('trailing-icon');
    this.labelElement.append(
      this.checkIconElement,
      this.trailingIconElement,
    );

    this.inputElement.removeAttribute('role');
    this.inputElement.autocomplete = 'off';
    if (!this.hasAttribute('type')) {
      this.type = 'checkbox';
      this.attributeChangedCallback('type', null, 'checkbox');
    }

    // this.labelElement.append(...this.buttonElement.children);
    // Aria will use aria-labelledby instead
    // Fallback with wrapped HTMLLabelElement

    if (this.getAttribute('trailing-icon') === '') {
      this.setAttribute('trailing-icon', 'dropdown');
      this.attributeChangedCallback('trailing-icon', null, 'dropdown');
    }
  }

  static elementName = 'mdw-filter-chip';

  static styles = [...super.styles, styles];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'trailing-icon':
        if (newValue) {
          this.trailingIconElement.setAttribute('icon', newValue);
        }
        break;
      case 'trailing-src':
        if (newValue == null) {
          this.trailingIconElement.removeAttribute('src');
        } else {
          this.trailingIconElement.setAttribute('src', newValue);
        }
        break;
      default:
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon icon=check aria-hidden="true"></mdw-icon>
      <mdw-icon id=trailing-icon aria-hidden="true"></mdw-icon>
    `,
  ];

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputClick(event) {
    /** @type {{host:MDWFilterChip}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;

    this.checked = false;
    host.toggleAttribute('checked', false);
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputKeydown(event) {
    if (event.key !== 'Spacebar' && event.key !== ' ') return;
    /** @type {{host:MDWFilterChip}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;
    event.preventDefault();

    this.checked = false;
    host.toggleAttribute('checked', false);
    event.preventDefault();
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    /** @type {{host:MDWFilterChip}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    host.toggleAttribute('checked', this.checked);
  }

  connectedCallback() {
    super.connectedCallback();
    this.inputElement.addEventListener('click', MDWFilterChip.onInputClick);
    this.inputElement.addEventListener('change', MDWFilterChip.onInputChange);
    this.inputElement.addEventListener('keydown', MDWFilterChip.onInputKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.inputElement.removeEventListener('click', MDWFilterChip.onInputClick);
    this.inputElement.removeEventListener('change', MDWFilterChip.onInputChange);
    this.inputElement.removeEventListener('keydown', MDWFilterChip.onInputKeydown);
  }
}
