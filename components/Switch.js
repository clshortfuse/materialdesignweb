import './Icon.js';
import Inline from '../layout/Inline.js';
import InputMixin from '../mixins/InputMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';

import styles from './Switch.css' assert { type: 'css' };
import animationStyles from './SwitchAnimations.css' assert { type: 'css' };

export default Inline
  .mixin(StateMixin)
  // Switches have their own pressed animation (No ripple)
  .mixin(SurfaceMixin)
  .mixin(InputMixin)
  .extend()
  .set({
    type: 'checkbox',
    stateLayer: true,
  })
  .observe({
    icon: 'string',
    selectedIcon: 'string',
    unselectedIcon: 'string',
    src: 'string',
    selectedSrc: 'string',
    unselectedSrc: 'string',
  })
  .css(
    styles,
    animationStyles,
  )
  .on({
    composed({ html }) {
      const { shape: trackShape, state, outline, slot, label, control } = this.refs;
      trackShape.id = 'track-shape';
      trackShape.setAttribute('selected', '{checked}');
      trackShape.setAttribute('disabled', '{disabledState}');
      trackShape.setAttribute('aria-hidden', 'true');

      state.classList.add('moving-target');

      outline.removeAttribute('_if');
      outline.setAttribute('selected', '{checked}');

      slot.removeAttribute('color');
      slot.removeAttribute('ink');
      label.append(html`
        ${slot}
        <div id="track" selected={checked} pressed={pressedState}>
          ${trackShape}
          <div id=thumb selected={checked} pressed={pressedState} disabled={disabledState}>
            <div id=thumb-shape class=shape selected={checked}
            icon=${({ icon, src, unselectedIcon, unselectedSrc }) => Boolean(icon || src || unselectedIcon || unselectedSrc)}></div>
            <mdw-icon class=icon id=icon src={src} selected={checked}>{icon}</mdw-icon>
            <mdw-icon class=icon id=selected-icon src={selectedIconSrc} selected={checked}>{selectedIcon}</mdw-icon>
            <mdw-icon class=icon id=unselected-icon src={unselectedIconSrc} selected={checked}>{unselectedIcon}</mdw-icon>
            ${state}
          </div>
        </div>
      `);

      control.setAttribute('type', 'checkbox');
      control.setAttribute('role', 'switch');
    },
  })
  .autoRegister('mdw-switch');
