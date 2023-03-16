import './CheckboxIcon.js';

import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

import styles from './Checkbox.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .mixin(TouchTargetMixin)
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
      return (indeterminate ? 'mixed' : `${!!checked}`);
    },
    _determinateIcon({ indeterminate, indeterminateIcon, icon }) {
      return (indeterminate ? indeterminateIcon : icon);
    },
  })
  .css(styles)
  .on({
    composed({ html }) {
      const { label, control, state, rippleContainer, touchTarget } = this.refs;
      label.append(html`
        ${touchTarget}
        ${control}
        <div id=checkbox errored={erroredState} selected={checked}>
          <mdw-checkbox-icon id=icon errored={erroredState} disabled={disabledState}
            icon={_determinateIcon} selected={checked}>
          </mdw-checkbox-icon>
          ${state}
          ${rippleContainer}
        </div>
        <slot id=slot></slot>
      `);

      control.setAttribute('type', 'checkbox');
      // Indeterminate must be manually expressed for ARIA
      control.setAttribute('aria-checked', '{_ariaChecked}');
    },
  })
  .autoRegister('mdw-checkbox');
