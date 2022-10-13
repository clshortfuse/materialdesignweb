import Icon from './Icon.js';
import Input from './Input.js';
import styles from './Switch.css' assert { type: 'css' };
import animationStyles from './SwitchAnimations.css' assert { type: 'css' };

export default class Switch extends Input {
  static elementName = 'mdw-switch';

  static styles = [...super.styles, styles, animationStyles];

  static fragments = [...super.fragments,
  /* html */ `
    <div id=track aria-hidden=true>
      <div id=thumb>
        <mdw-icon class=icon id=icon src={src}>{icon}</mdw-icon>
        <mdw-icon class=icon id=selected-icon src={selectedIconSrc}>{selectedIcon}</mdw-icon>
        <mdw-icon class=icon id=unselected-icon src={unselectedIconSrc}>{unselectedIcon}</mdw-icon>
      </div>
    </div>
  `];

  compose() {
    const fragment = super.compose();
    const input = fragment.getElementById('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('role', 'switch');
    fragment.getElementById('thumb').append(
      fragment.getElementById('overlay'),
      fragment.getElementById('ripple'),
    );
    fragment.getElementById('label').append(
      fragment.getElementById('track'),
    );
    return fragment;
  }
}

Switch.prototype.icon = Switch.idl('icon');
Switch.prototype.selectedIcon = Switch.idl('selectedIcon');
Switch.prototype.unselectedIcon = Switch.idl('unselectedIcon');

Switch.prototype.src = Switch.idl('src');
Switch.prototype.selectedSrc = Switch.idl('selectedSrc');
Switch.prototype.unselectedSrc = Switch.idl('unselectedSrc');
