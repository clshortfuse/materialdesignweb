import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';
import MDWButton from '../button/MDWButton.js';

import styles from './MDWSegmentedButton.css' assert { type: 'css' };

export default class MDWSegmentedButton extends MDWButton {
  static ariaRole = 'none';

  constructor() {
    super();
    this.outlined = true;
    this.setAttribute('mdw-overlay-disabled', 'focus');
    if (!this.hasAttribute('type')) {
      this.type = 'radio';
    }
    this.inputElement.setAttribute('role', 'option');
    this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Listboxes should always receive focus
    if (name === 'disabled') return;
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'checked') {
      this.setAttribute('aria-checked', newValue == null ? 'false' : 'true');
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
    console.log('MDWSegmentedButton.onClick', this.checked);
    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;
    /** @type {{host:MDWSegmentedButton}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    this.checked = false;
    host.toggleAttribute('checked', false);
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    console.log('MDWSegmentedButton.onInputChange', this.checked);
    /** @type {{host:MDWSegmentedButton}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      console.log('preventing default');
      event.preventDefault();
      return;
    }
    host.toggleAttribute('checked', this.checked);
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputFocus(event) {
    console.log('MDWSegmentedButton.onInputFocus', this.checked, this.value);
    // event.preventDefault();
  }

  connectedCallback() {
    super.connectedCallback();
    RovingTabIndex.attach(this);
    this.inputElement.addEventListener('click', MDWSegmentedButton.onInputClick, { passive: true });
    this.inputElement.addEventListener('change', MDWSegmentedButton.onInputChange);
    // this.inputElement.addEventListener('focus', MDWSegmentedButton.onInputFocus);
    // this.addEventListener('keydown', MDWSegmentedButton.onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    RovingTabIndex.detach(this);
    this.removeEventListener('click', MDWSegmentedButton.onClick);
    // this.removeEventListener('keydown', MDWSegmentedButton.onKeyDown);
  }
}
