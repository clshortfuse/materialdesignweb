import './Icon.js';
import { addInlineFunction } from '../core/template.js';
import InputMixin from '../mixins/InputMixin.js';

import styles from './Checkbox.css' assert { type: 'css' };
import iconStyles from './CheckboxIcon.css' assert { type: 'css' };
import Container from './Container.js';

export default class Checkbox extends InputMixin(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-checkbox';

  /** @type {Container['compose']} */
  compose(...parts) {
    const composition = super.compose(
      styles,
      iconStyles,
      ...parts,
    );

    const template = composition.template;
    const { html } = this;
    template.getElementById('label').append(
      html`
        <div id=checkbox-box class=checkbox-box>
          <mdw-icon id=checkbox-icon class=checkbox-icon selected={checked} indeterminate={indeterminate}>
            ${({ indeterminate, indeterminateIcon, icon }) => (indeterminate ? indeterminateIcon : icon)}
          </mdw-icon>
          ${template.getElementById('ripple')}
          ${template.getElementById('state')}
        </div>
      `,
    );
    const control = template.getElementById('control');
    control.setAttribute('type', 'checkbox');
    // Indeterminate must be manually expressed for ARIA
    control.setAttribute(
      'aria-checked',
      addInlineFunction(({ indeterminate, checked }) => (indeterminate ? 'mixed' : String(!!checked))),
    );
    return composition;
  }

  /** @override */
  // @ts-ignore @override
  get type() { return 'checkbox'; }
}

Checkbox.prototype.icon = Checkbox.idl('icon', { type: 'string', default: 'check' });
Checkbox.prototype.indeterminateIcon = Checkbox.idl('indeterminateIcon', { type: 'string', default: 'check_indeterminate_small' });
Checkbox.prototype.indeterminate = Checkbox.idl('indeterminate', { type: 'boolean' });
