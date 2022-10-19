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

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'checkbox'; }
}

Checkbox.prototype.icon = Checkbox.idl('icon', { type: 'string', empty: 'check', default: 'check' });
Checkbox.prototype.indeterminateIcon = Checkbox.idl('indeterminateIcon', { type: 'string', empty: 'check_indeterminate_small', default: 'check_indeterminate_small' });
Checkbox.prototype.indeterminate = Checkbox.idl('indeterminate', { type: 'boolean', reflect: true });
