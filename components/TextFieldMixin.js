import './Icon.js';
import styles from './TextFieldMixin.css' assert { type: 'css' };

/** @typedef {import('./Control.js').default} Control */

/** @param {typeof import('./Control.js').default} Base */
export function TextFieldMixin(Base) {
  class TextField extends Base {
    static styles = [...super.styles, styles];

    static get template() {
      const template = super.template;
      /** @type {HTMLTemplater<TextField>} */
      const html = this.html;
      const control = template.getElementById('control');
      control.setAttribute('type', 'text');
      control.setAttribute('placeholder', '{placeholder}');
      control.setAttribute('aria-labelledby', 'label-text');
      control.classList.add('inline');
      template.getElementById('label').append(html`
        <mdw-icon _if={icon} id=icon aria-hidden=true>{icon}</mdw-icon>
        <span _if={inputPrefix} class=inline id=prefix aria-hidden=true>{inputPrefix}</span>
        <span _if={inputSuffix} class=inline id=suffix aria-hidden=true>{inputSuffix}</span>
        <mdw-icon _if={trailingIcon} id=trailing-icon aria-hidden=true>{trailingIcon}</mdw-icon>
        <div _if={filled} id=indicator></div>
        <div id=outline>
          <div id=gap>
            <div _if={label} id=label-text>
              {label}
              ${template.getElementById('slot')}
            </div>
          </div>
        </div>
      `);
      template.append(html`
        <div _if={shouldShowSupporting} id=supporting>
          {computeSupportingText}
          <slot id=supporting-slot name=supporting></slot>
        </div>
      `);

      template.getElementById('ripple').remove();
      return template;
    }

    /** @type {Control['idlChangedCallback']} */
    idlChangedCallback(name, oldValue, newValue) {
      super.idlChangedCallback(name, oldValue, newValue);
      switch (name) {
        case 'value':
        case '_badInput':
          this._populated = this.value || this._badInput;
          break;
        default:
      }
    }

    shouldShowSupporting() {
      const { _invalid, error, supporting } = this;
      return _invalid || ((error ?? supporting) != null);
    }

    computeSupportingText() {
      const { error, _validationMessage, supporting } = this;
      return (error || _validationMessage || supporting) ?? '';
    }
  }

  TextField.prototype.type = TextField.idl('type', { empty: 'text' });
  TextField.prototype.icon = TextField.idl('icon');
  TextField.prototype.label = TextField.idl('label');
  TextField.prototype.filled = TextField.idl('filled', 'boolean');
  TextField.prototype.outlined = TextField.idl('outlined', 'boolean');
  TextField.prototype.inputPrefix = TextField.idl('inputPrefix');
  TextField.prototype.inputSuffix = TextField.idl('inputSuffix');
  TextField.prototype.trailingIcon = TextField.idl('trailingIcon');
  TextField.prototype.supporting = TextField.idl('supporting');
  TextField.prototype.error = TextField.idl('error');
  TextField.prototype._populated = TextField.idl('_populated', { attr: 'populated', type: 'boolean' });
  return TextField;
}
