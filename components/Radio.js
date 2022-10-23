import Input from './Input.js';
import styles from './Radio.css' assert { type: 'css' };

export default class Radio extends Input {
  static elementName = 'mdw-radio';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div id=icon></div>
    `];

  static get template() {
    const template = super.template;
    template.getElementById('icon').append(
      template.getElementById('ripple'),
      template.getElementById('overlay'),
    );
    template.getElementById('label').append(
      template.getElementById('icon'),
    );
    template.getElementById('control').setAttribute('type', 'radio');
    return template;
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'radio'; }
}
