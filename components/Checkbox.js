import styles from './Checkbox.css' assert { type: 'css' };
import iconStyles from './CheckboxIcon.css' assert { type: 'css' };
import Input from './Input.js';
import './Icon.js';

export default class Checkbox extends Input {
  static { this.autoRegister(); }

  static elementName = 'mdw-checkbox';

  static styles = [...super.styles, styles, iconStyles];

  static get template() {
    const template = super.template;
    const { html } = this;
    template.getElementById('label').append(
      html`
        <div id=checkbox-box class=checkbox-box>
          <mdw-icon id=checkbox-icon class=checkbox-icon selected={checked} indeterminate={indeterminate}>
            ${({ indeterminate, indeterminateIcon, icon }) => (indeterminate ? indeterminateIcon : icon)}
          </mdw-icon>
          ${template.getElementById('ripple')}
          ${template.getElementById('overlay')}
        </div>
      `,
    );
    const control = template.getElementById('control');
    control.setAttribute('type', 'checkbox');
    // Indeterminate must be manually expressed for ARIA
    control.setAttribute(
      'aria-checked',
      this.addInlineFunction(({ indeterminate, checked }) => (indeterminate ? 'mixed' : String(!!checked))),
    );
    return template;
  }

  /** @override */
  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'checkbox'; }
}

Checkbox.prototype.icon = Checkbox.idl('icon', { type: 'string', default: 'check' });
Checkbox.prototype.indeterminateIcon = Checkbox.idl('indeterminateIcon', { type: 'string', default: 'check_indeterminate_small' });
Checkbox.prototype.indeterminate = Checkbox.idl('indeterminate', { type: 'boolean', reflect: true });
