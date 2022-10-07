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
        <mdw-icon class=icon id=icon></mdw-icon>
        <mdw-icon class=icon id=checked-icon></mdw-icon>
        <mdw-icon class=icon id=unchecked-icon></mdw-icon>
      </div>
    </div>
  `];

  static compose() {
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

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    let textContentElement;
    let srcElement;
    switch (name) {
      case 'icon':
        textContentElement = this.refs.icon;
        break;
      case 'checked-icon':
        textContentElement = this.refs.checkedIcon;
        break;
      case 'unchecked-icon':
        textContentElement = this.refs.uncheckedIcon;
        break;
      case 'src':
        srcElement = this.refs.icon;
        break;
      case 'checked-src':
        srcElement = this.refs.checkedIcon;
        break;
      case 'unchecked-src':
        srcElement = this.refs.uncheckedIcon;
        break;
      default:
    }

    if (textContentElement) {
      textContentElement.textContent = newValue;
    } else if (srcElement) {
      if (newValue == null) {
        srcElement.removeAttribute('src');
      } else {
        srcElement.setAttribute('src', newValue);
      }
    }
  }
}

Switch.prototype.icon = Switch.idlString('icon');
Switch.prototype.checkedIcon = Switch.idlString('checked-icon');
Switch.prototype.uncheckedIcon = Switch.idlString('unchecked-icon');

Switch.prototype.src = Switch.idlString('src');
Switch.prototype.checkedSrc = Switch.idlString('checked-src');
Switch.prototype.uncheckedSrc = Switch.idlString('unchecked-src');

Switch.prototype.refs = {
  ...Input.prototype.refs,
  ...Switch.addRefs({
    track: 'div',
    thumb: 'div',
    icon: Icon,
    checkedIcon: Icon,
    uncheckedIcon: Icon,
    overlay: null,
    ripple: null,
  }),
};
