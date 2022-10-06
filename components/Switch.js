import Input from './Input.js';
import styles from './Switch.css' assert { type: 'css' };
import animationStyles from './SwitchAnimations.css' assert { type: 'css' };

export default class Switch extends Input {
  static elementName = 'mdw-switch';

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

  static styles = [...super.styles, styles, animationStyles];

  constructor() {
    super();
    if (!this.hasAttribute('type')) {
      this.type = 'checkbox';
      this.attributeChangedCallback('type', null, 'checkbox');
    }
    this.inputElement.setAttribute('role', 'switch');
    this.trackElement = this.shadowRoot.getElementById('track');
    this.thumbElement = this.shadowRoot.getElementById('thumb');
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.checkedIconElement = this.shadowRoot.getElementById('checked-icon');
    this.uncheckedIconElement = this.shadowRoot.getElementById('unchecked-icon');
    this.thumbElement.append(
      this.overlayElement,
      this.rippleElement,
    );
    this.labelElement.append(
      this.trackElement,
    );
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
        textContentElement = this.iconElement;
        break;
      case 'checked-icon':
        textContentElement = this.checkedIconElement;
        break;
      case 'unchecked-icon':
        textContentElement = this.uncheckedIconElement;
        break;
      case 'src':
        srcElement = this.iconElement;
        break;
      case 'checked-src':
        srcElement = this.checkedIconElement;
        break;
      case 'unchecked-src':
        srcElement = this.uncheckedIconElement;
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
