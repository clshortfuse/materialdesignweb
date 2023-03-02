import './RadioIcon.js';

import Inline from '../layout/Inline.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';

import styles from './Radio.css' assert { type: 'css' };

export default Inline
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .extend()
  .set({
    type: 'radio',
    stateLayer: true,
  })
  .css(styles)
  .on({
    composed({ html }) {
      const { label, rippleContainer, state, slot, control } = this.refs;
      label.append(html`
        <div id=target errored={erroredState} selected={checked}>
          <mdw-radio-icon id=icon errored={erroredState} disabled={disabledState}
            selected={checked} focused={focusedState} hovered={hoveredState}></mdw-radio-icon>
          ${rippleContainer}
          ${state}
        </div>
        ${slot}
      `);

      control.setAttribute('type', 'radio');
      slot.removeAttribute('color');
      slot.removeAttribute('ink');
    },
  })
  .autoRegister('mdw-radio');
