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
    indeterminate: { type: 'boolean' },
  })
  .expressions({
    computeDeterminateIcon({ indeterminate, indeterminateIcon, icon }) {
      return (indeterminate ? indeterminateIcon : icon);
    },
    // TODO: Abstract into observed ariaChecked property
    computeAriaChecked({ indeterminate, checked }) {
      return (indeterminate ? 'mixed' : String(!!checked));
    },
  })
  .css(styles, iconStyles)
  .on('composed', ({ $, html }) => {
    $('#label').append(
      html`
        <div id=checkbox-box class=checkbox-box>
          <mdw-icon id=checkbox-icon class=checkbox-icon selected={checked} indeterminate={indeterminate}>
            {computeDeterminateIcon}
          </mdw-icon>
          ${$('#ripple')}
          ${$('#state')}
        </div>
      `,
    );

    const control = $('#control');
    control.setAttribute('type', 'checkbox');
    // Indeterminate must be manually expressed for ARIA
    control.setAttribute('aria-checked', '{computeAriaChecked}');
  })
  .autoRegister('mdw-checkbox');