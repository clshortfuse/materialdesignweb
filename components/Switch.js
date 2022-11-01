import Input from './Input.js';
import styles from './Switch.css' assert { type: 'css' };
import animationStyles from './SwitchAnimations.css' assert { type: 'css' };
import './Icon.js';

export default class Switch extends Input {
  static { this.autoRegister(); }

  static elementName = 'mdw-switch';

  static styles = [...super.styles, styles, animationStyles];

  static get template() {
    const template = super.template;
    const html = this.html;
    template.getElementById('label').append(html`
      <div id=track aria-hidden=true>
        <div id=thumb>
          <mdw-icon class=icon id=icon src={src}>{icon}</mdw-icon>
          <mdw-icon class=icon id=selected-icon src={selectedIconSrc}>{selectedIcon}</mdw-icon>
          <mdw-icon class=icon id=unselected-icon src={unselectedIconSrc}>{unselectedIcon}</mdw-icon>
          ${template.getElementById('overlay')}
          ${template.getElementById('ripple')}
        </div>
      </div>
    `);
    const control = template.getElementById('control');
    control.setAttribute('type', 'checkbox');
    control.setAttribute('role', 'switch');
    return template;
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'checkbox'; }
}

Switch.prototype.icon = Switch.idl('icon');
Switch.prototype.selectedIcon = Switch.idl('selectedIcon');
Switch.prototype.unselectedIcon = Switch.idl('unselectedIcon');

Switch.prototype.src = Switch.idl('src');
Switch.prototype.selectedSrc = Switch.idl('selectedSrc');
Switch.prototype.unselectedSrc = Switch.idl('unselectedSrc');
