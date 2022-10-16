import Icon from './Icon.js';
import Input from './Input.js';
import styles from './TextInput.css' assert { type: 'css' };

export default class TextInput extends Input {
  static elementName = 'mdw-text-input';

  static styles = [...super.styles, styles];

  #iconElement = this.refs.icon;

  #trailingIconElement = this.refs.trailingIcon;

  constructor() {
    super();
    if (this.icon == null) {
      // perf: Drop from DOM if not used
      this.#iconElement.remove();
    }
    if (this.trailingIcon == null) {
      this.#trailingIconElement.remove();
    }
  }

  compose() {
    const fragment = super.compose();
    const { html } = this;
    const input = fragment.getElementById('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', '{placeholder}');
    fragment.getElementById('label').append(
      html`
        <mdw-icon id=icon aria-hidden=true>{icon}</mdw-icon>
        <span id=prefix aria-hidden=true>{inputPrefix}</span>
        <span id=suffix aria-hidden=true>{inputSuffix}</span>
        <mdw-icon id=trailing-icon aria-hidden=true>{trailingIcon}</mdw-icon>
        <div id=indicator></div>
        <div id=outline>
          <div id=gap></div>
        </div>
      `,
    );
    fragment.getElementById('gap').append(
      fragment.getElementById('slot'),
    );
    fragment.append(html`
      <div id=supporting>${({ supporting, error }) => (error || supporting) ?? ''}</div>
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
        this.refs.label.append(this.#iconElement);
      } else if (newValue == null) {
        this.#iconElement.remove();
      }
    }
    if (name === 'trailing-icon') {
      if (oldValue == null) {
        this.refs.label.append(this.#trailingIconElement);
      } else if (newValue == null) {
        this.#trailingIconElement.remove();
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
    if (name === 'value') {
      this.toggleAttribute('populated', !!newValue);
    }
  }
}

TextInput.prototype.icon = TextInput.idl('icon');
TextInput.prototype.inputPrefix = TextInput.idl('inputPrefix');
TextInput.prototype.inputSuffix = TextInput.idl('inputSuffix');
TextInput.prototype.trailingIcon = TextInput.idl('trailingIcon');
TextInput.prototype.supporting = TextInput.idl('supporting');
TextInput.prototype.error = TextInput.idl('error');

TextInput.prototype.refs = {
  ...Input.prototype.refs,
  ...TextInput.addRefNames('label', 'icon'),
  ...TextInput.addRefs({
    label: 'label',
    icon: Icon,
    trailingIcon: { id: 'trailing-icon', type: Icon },
  }),
};
