import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default class SegmentedButton extends Button {
  static elementName = 'mdw-segmented-button';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=check-icon aria-hidden="true">check</mdw-icon>
    `,
  ];

  constructor() {
    super();
    this.outlined = true;
    this.setAttribute('mdw-overlay-disabled', 'focus');
  }

  compose() {
    const fragment = super.compose();
    fragment.getElementById('label').append(
      fragment.getElementById('check-icon'),
    );
    const input = fragment.getElementById('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('role', 'option');
    return fragment;
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Listboxes should always receive focus
    if (name === 'disabled') {
      this.refs.input.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** @type {Button['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (name === 'checked' || name === 'type') {
      const attribute = this.type === 'checkbox' ? 'aria-checked' : 'aria-selected';
      this.refs.input.setAttribute(attribute, this.checked ? 'true' : 'false');
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
