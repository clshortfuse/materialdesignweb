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
        <mdw-icon class=icon id=checked-icon src={checkedIconSrc}>{checkedIcon}</mdw-icon>
        <mdw-icon class=icon id=unchecked-icon src={uncheckedIconSrc}>{uncheckedIcon}</mdw-icon>
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

Switch.prototype.icon = Switch.idlString('icon');
Switch.prototype.checkedIcon = Switch.idlString('checked-icon');
Switch.prototype.uncheckedIcon = Switch.idlString('unchecked-icon');

Switch.prototype.src = Switch.idlString('src');
Switch.prototype.checkedSrc = Switch.idlString('checked-src');
Switch.prototype.uncheckedSrc = Switch.idlString('unchecked-src');
