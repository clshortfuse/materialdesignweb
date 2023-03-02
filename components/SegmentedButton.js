import './Icon.js';

import Button from './Button.js';
import styles from './SegmentedButton.css' assert { type: 'css' };

export default Button
  .extend()
  .observe({
    type: { empty: 'radio' },
    innerSegmentedButton: 'boolean',
  })
  .set({
    focusableOnDisabled: true,
  })
  .css(styles)
  .on({
    composed({ $, html, inline }) {
      const shape = $('#label');
      shape.append(html`
        <mdw-icon selected={checked} id=check-icon aria-hidden=true>check</mdw-icon>
      `);
      shape.setAttribute('selected', '{checked}');

      $('#icon').removeAttribute('_if');
      $('#icon').setAttribute('has-icon', '{hasIcon}');
      $('#icon').setAttribute('selected', '{checked}');
      $('#outline').setAttribute('inner-segmented-button', '{innerSegmentedButton}');

      const control = $('#control');
      control.setAttribute('type', 'radio');
      control.setAttribute('role', 'option');
      control.setAttribute('aria-checked', inline(
        ({ type, checked }) => (type === 'checkbox' ? `${(!!checked)}` : null),
      ));
      control.setAttribute('aria-selected', inline(
        ({ type, checked }) => (type === 'checkbox' ? null : `${!!checked}`),
      ));

      $('#state').setAttribute('state-disabled', 'focus');
    },
    constructed() {
      this.outlined = true;
    },
  })
  .autoRegister('mdw-segmented-button');
