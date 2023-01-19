import './Icon.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default Button
  .extend()
  .observe({
    type: { empty: 'radio' },
  })
  .setStatic({
    focusableOnDisabled: true,
  })
  .css(styles)
  .on({
    composed({ $, html, inline }) {
      $('#label').append(html`
        <mdw-icon selected={checked} id=check-icon aria-hidden=true>check</mdw-icon>
      `);

      $('#icon').setAttribute('selected', '{checked}');

      const control = $('#control');
      control.setAttribute('type', 'radio');
      control.setAttribute('role', 'option');
      control.setAttribute('aria-checked', inline(
        ({ type, checked }) => (type === 'checkbox' ? String(!!checked) : null),
      ));
      control.setAttribute('aria-selected', inline(
        ({ type, checked }) => (type === 'checkbox' ? null : String(!!checked)),
      ));

      $('#state').setAttribute('state-disabled', 'focus');
    },
    constructed() {
      this.outlined = true;
    },
  })
  .autoRegister('mdw-segmented-button');
