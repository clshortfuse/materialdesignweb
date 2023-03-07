import './Icon.js';
import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';
import TouchTargetMixin from '../mixins/TouchTargetMixin.js';

import styles from './Switch.css' assert { type: 'css' };
import animationStyles from './SwitchAnimations.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(InputMixin) // Label as root
  .mixin(ShapeMixin) // Surface as root
  .mixin(StateMixin)
  .mixin(TouchTargetMixin)
  // Switches have their own pressed animation (No ripple)
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
  .expressions({
    hasIcon({ icon, src, unselectedIcon, unselectedSrc }) {
      return Boolean(icon || src || unselectedIcon || unselectedSrc);
    },
  })
  .on({
    composed({ html }) {
      const { shape: track, state, outline, label, control, touchTarget } = this.refs;
      track.id = 'track';
      track.setAttribute('selected', '{checked}');
      track.setAttribute('disabled', '{disabledState}');
      track.setAttribute('aria-hidden', 'true');

      state.classList.add('moving-target');

      outline.removeAttribute('_if');
      outline.setAttribute('selected', '{checked}');

      touchTarget.append(control);
      label.append(html`
        ${touchTarget}
        <div id="switch" selected={checked} pressed={pressedState} icon={hasIcon}>
          ${track}
          <div id=thumb selected={checked} pressed={pressedState} disabled={disabledState}>
            <div id=thumb-shape class=shape selected={checked}
            icon={hasIcon}></div>
            <mdw-icon class=icon id=icon src={src} selected={checked}>{icon}</mdw-icon>
            <mdw-icon class=icon id=selected-icon src={selectedIconSrc} selected={checked}>{selectedIcon}</mdw-icon>
            <mdw-icon class=icon id=unselected-icon src={unselectedIconSrc} selected={checked}>{unselectedIcon}</mdw-icon>
            ${state}
          </div>
        </div>
        <slot id=slot></slot>
      `);

      control.setAttribute('type', 'checkbox');
      control.setAttribute('role', 'switch');
    },
  })
  .autoRegister('mdw-switch');
