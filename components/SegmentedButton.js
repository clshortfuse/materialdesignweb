import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default class SegmentedButton extends Button {
  static ariaRole = 'none';

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

  static elementName = 'mdw-segmented-button';

  static styles = [...super.styles, styles];

  /**
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputClick(event) {
    /** @type {{host:SegmentedButton}} */ // @ts-ignore Coerce
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
    /** @type {{host:SegmentedButton}} */ // @ts-ignore Coerce
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
    /** @type {{host:SegmentedButton}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    host.toggleAttribute('checked', this.checked);
  }

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon icon=check aria-hidden="true"></mdw-icon>
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    RovingTabIndex.attach(this);
    this.inputElement.addEventListener('click', SegmentedButton.onInputClick);
    this.inputElement.addEventListener('change', SegmentedButton.onInputChange);
    this.inputElement.addEventListener('keydown', SegmentedButton.onInputKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    RovingTabIndex.detach(this);
    this.inputElement.removeEventListener('click', SegmentedButton.onInputClick);
    this.inputElement.removeEventListener('change', SegmentedButton.onInputChange);
    this.inputElement.removeEventListener('keydown', SegmentedButton.onInputKeydown);
  }
}
