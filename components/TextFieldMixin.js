import Control from './Control.js';
import Icon from './Icon.js';
import styles from './TextFieldMixin.css' assert { type: 'css' };

/**
 * @param {typeof Control} Base
 */
export function TextFieldMixin(Base) {
  const TextField = class extends Base {
    static elementName = 'mdw-textbase';

    static styles = [...super.styles, styles];

    #icon = /** @type {Icon} */ (this.refs.icon);

    #trailingIcon = /** @type {Icon} */ (this.refs['trailing-icon']);

    #label = /** @type {HTMLLabelElement} */ (this.refs.label);

    constructor() {
      super();
      if (this.icon == null) {
      // perf: Drop from DOM if not used
        this.#icon.remove();
      }
      if (this.trailingIcon == null) {
        this.#trailingIcon.remove();
      }
    }

    compose() {
      const fragment = super.compose();
      const { html } = this;
      const control = fragment.getElementById('control');
      control.setAttribute('type', 'text');
      control.setAttribute('placeholder', '{placeholder}');
      control.setAttribute('aria-labelledby', 'label-text');
      control.classList.add('inline');
      fragment.getElementById('label').append(
        html`
          <mdw-icon id=icon aria-hidden=true>{icon}</mdw-icon>
          <span class=inline id=prefix aria-hidden=true>{inputPrefix}</span>
          <span class=inline id=suffix aria-hidden=true>{inputSuffix}</span>
          <mdw-icon id=trailing-icon aria-hidden=true>{trailingIcon}</mdw-icon>
          <div id=indicator></div>
          <div id=outline>
            <div id=gap>
              <div id=label-text>{label}</div>
            </div>
          </div>
        `,
      );
      fragment.getElementById('label-text').append(
        fragment.getElementById('slot'),
      );
      fragment.append(html`
        <div id=supporting>${({ error, _validationMessage, supporting }) => (error || _validationMessage || supporting) ?? ''}</div>
      `);

      fragment.getElementById('ripple').remove();
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
      if (name === 'icon') {
        if (oldValue == null) {
          this.#label.append(this.#icon);
        } else if (newValue == null) {
          this.#icon.remove();
        }
      }
      if (name === 'trailing-icon') {
        if (oldValue == null) {
          this.#label.append(this.#trailingIcon);
        } else if (newValue == null) {
          this.#trailingIcon.remove();
        }
      }
    }

    /**
     * @param {string} name
     * @param {string?} oldValue
     * @param {string?} newValue
     */
    idlChangedCallback(name, oldValue, newValue) {
      super.idlChangedCallback(name, oldValue, newValue);
      if (oldValue == null && newValue == null) return;
      switch (name) {
        case 'value':
        case '_badInput':
          this._populated = this.value || this._badInput;
          break;
        default:
      }
    }
  };
  TextField.prototype.type = TextField.idl('type', { empty: 'text' });
  TextField.prototype.icon = TextField.idl('icon');
  TextField.prototype.label = TextField.idl('label');
  TextField.prototype.inputPrefix = TextField.idl('inputPrefix');
  TextField.prototype.inputSuffix = TextField.idl('inputSuffix');
  TextField.prototype.trailingIcon = TextField.idl('trailingIcon');
  TextField.prototype.supporting = TextField.idl('supporting');
  TextField.prototype.error = TextField.idl('error');
  TextField.prototype._populated = TextField.idl('_populated', { attr: 'populated', type: 'boolean' });
  return TextField;
}
