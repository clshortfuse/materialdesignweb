import styles from './Checkbox.css' assert { type: 'css' };
import Input from './Input.js';

export default class Checkbox extends Input {
  static elementName = 'mdw-checkbox';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div id=container></div>
    `];

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

  compose() {
    const fragment = super.compose();
    const { html } = this;
    fragment.getElementById('container').append(
      html`<mdw-icon id=icon>${({ indeterminate, indeterminateIcon, icon }) => (indeterminate ? indeterminateIcon : icon)}</mdw-icon>`,
      fragment.getElementById('ripple'),
      fragment.getElementById('overlay'),
    );

    fragment.getElementById('label').append(
      fragment.getElementById('container'),
    );
    fragment.getElementById('control').setAttribute('type', 'checkbox');
    return fragment;
  }

  /**
   * @param {string} name
   * @param {string} newValue
   * @param {string} oldValue
   */
  idlChangedCallback(name, newValue, oldValue) {
    super.idlChangedCallback(name, newValue, oldValue);
    switch (name) {
      case 'indeterminate':
      case 'checked':
        // Screen readers do not report indeterminate state
        this.#input.setAttribute('aria-checked', this.indeterminate ? 'mixed' : String(this.checked));
        break;
      default:
    }
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'checkbox'; }
}

Checkbox.prototype.icon = Checkbox.idl('icon', { type: 'string', default: 'check' });
Checkbox.prototype.indeterminateIcon = Checkbox.idl('indeterminateIcon', { type: 'string', default: 'check_indeterminate_small' });
Checkbox.prototype.indeterminate = Checkbox.idl('indeterminate', { type: 'boolean', reflect: true });
