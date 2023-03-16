import './RadioIcon.js';

import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import RippleMixin from '../mixins/RippleMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

import styles from './Radio.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(RippleMixin)
  .mixin(InputMixin)
  .mixin(TouchTargetMixin)
  .extend()
  .set({
    type: 'radio',
    stateLayer: true,
  })
  .css(styles)
  .on({
    composed({ html }) {
      const { label, rippleContainer, state, control, touchTarget } = this.refs;
      label.append(html`
        ${touchTarget}
        ${control}
        <div id=radio errored={erroredState} selected={checked}>
          <mdw-radio-icon id=icon errored={erroredState} disabled={disabledState}
            selected={checked} focused={focusedState} hovered={hoveredState}></mdw-radio-icon>
          ${state}
          ${rippleContainer}
        </div>
        <slot id=slot></slot>
      `);

      control.setAttribute('type', 'radio');
    },
  })
  .autoRegister('mdw-radio');
