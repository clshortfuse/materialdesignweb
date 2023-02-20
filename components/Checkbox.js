import './CheckboxIcon.js';

import Inline from '../layout/Inline.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import styles from './Checkbox.css' assert { type: 'css' };

export default Inline
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .extend()
  .set({
    stateLayer: true,
    type: 'checkbox',
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
  .css(styles)
  .on('composed', ({ $, html }) => {
    $('#label').append(html`
      <div id=target errored={erroredState} selected={checked}>
        <mdw-checkbox-icon id=icon errored={erroredState} disabled={disabledState}
          icon={_determinateIcon} selected={checked}>
        </mdw-checkbox-icon>
        ${$('#ripple-container')}
        ${$('#state')}
      </div>
      ${$('#slot')}
    `);

    const control = $('#control');
    control.setAttribute('type', 'checkbox');
    // Indeterminate must be manually expressed for ARIA
    control.setAttribute('aria-checked', '{_ariaChecked}');
    $('#slot').removeAttribute('color');
    $('#slot').removeAttribute('ink');
  })
  .autoRegister('mdw-checkbox');
