import './Icon.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default class SegmentedButton extends Button
  .extend()
  .observe({
    type: { empty: 'radio' },
  })
  .css(styles)
  .on({
    composed({ $, html, inline }) {
      $('#label').append(html`
        <mdw-icon _if={icon} id=check-icon aria-hidden=true>check</mdw-icon>
      `);

      const control = $('#control');
      control.setAttribute('type', 'radio');
      control.setAttribute('role', 'option');
      control.setAttribute('aria-checked', inline(
        ({ type, checked }) => (type === 'checkbox' ? String(!!checked) : null),
      ));
      control.setAttribute('aria-selected', inline(
        ({ type, checked }) => (type !== 'checkbox' ? String(!!checked) : null),
      ));

      $('#state').setAttribute('state-disabled', 'focus');
    },
    constructed() {
      this.outlined = true;
    },
  }) {
  /** @type {InstanceType<typeof Button>['attributeChangedCallback']} */
  attributeChangedCallback(name, oldValue, newValue) {
    // Listboxes should always receive focus
    if (name === 'disabled') {
      this.refs.control.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
      return;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }
}

SegmentedButton.autoRegister('mdw-segmented-button');
