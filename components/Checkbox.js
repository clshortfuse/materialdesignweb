import './Icon.js';
import InputMixin from '../mixins/InputMixin.js';

import styles from './Checkbox.css' assert { type: 'css' };
import iconStyles from './CheckboxIcon.css' assert { type: 'css' };
import Container from './Container.js';

export default Container
  .mixin(InputMixin)
  .extend()
  .define({
    type() { return 'checkbox'; },
  })
  .observe({
    icon: { value: 'check' },
    indeterminateIcon: { value: 'check_indeterminate_small' },
    /** Reflected property */
    indeterminate: 'boolean',
  })
  .observe({
    _ariaChecked({ indeterminate, checked }) {
      return (indeterminate ? 'mixed' : String(!!checked));
    },
    _determinateIcon({ indeterminate, indeterminateIcon, icon }) {
      return (indeterminate ? indeterminateIcon : icon);
    },
  })
  .css(styles, iconStyles)
  .on('composed', ({ $, html }) => {
    $('#label').append(
      html`
        <div id=checkbox-box class=checkbox-box>
          <mdw-icon id=checkbox-icon class=checkbox-icon selected={checked} indeterminate={indeterminate}>
            {_determinateIcon}
          </mdw-icon>
          ${$('#ripple')}
          ${$('#state')}
        </div>
      `,
    );

    const control = $('#control');
    control.setAttribute('type', 'checkbox');
    // Indeterminate must be manually expressed for ARIA
    control.setAttribute('aria-checked', '{_ariaChecked}');
  })
  .autoRegister('mdw-checkbox');
