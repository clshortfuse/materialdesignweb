import './Icon.js';
import InputMixin from '../mixins/InputMixin.js';

import Container from './Container.js';
import styles from './Switch.css' assert { type: 'css' };
import animationStyles from './SwitchAnimations.css' assert { type: 'css' };

export default Container
  .mixin(InputMixin)
  .extend()
  .define({
    type() { return 'checkbox'; },
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
  .on('composed', ({ $, html }) => {
    $('#label').append(html`
      <div id=track selected={checked} aria-hidden=true>
        <div id=thumb>
          <mdw-icon class=icon id=icon src={src}>{icon}</mdw-icon>
          <mdw-icon class=icon id=selected-icon src={selectedIconSrc}>{selectedIcon}</mdw-icon>
          <mdw-icon class=icon id=unselected-icon src={unselectedIconSrc}>{unselectedIcon}</mdw-icon>
          ${$('#state')}
          ${$('#ripple')}
        </div>
      </div>
    `);

    const control = $('#control');
    control.setAttribute('type', 'checkbox');
    control.setAttribute('role', 'switch');
  })
  .autoRegister('mdw-switch');
