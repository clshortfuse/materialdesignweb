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
  .on('composed', ({ $, html }) => {
    $('#label').append(html`
      <div id=target errored={erroredState} selected={checked}>
        <mdw-radio-icon id=icon errored={erroredState} disabled={disabledState}
          selected={checked} focused={focusedState} hovered={hoveredState}></mdw-radio-icon>
        ${$('#ripple-container')}
        ${$('#state')}
      </div>
      ${$('#slot')}
    `);

    const control = $('#control');
    control.setAttribute('type', 'radio');
    $('#slot').removeAttribute('color');
    $('#slot').removeAttribute('ink');
  })
  .autoRegister('mdw-radio');
