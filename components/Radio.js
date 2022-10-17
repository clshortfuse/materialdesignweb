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

  compose() {
    const fragment = super.compose();
    fragment.getElementById('icon').append(
      fragment.getElementById('ripple'),
      fragment.getElementById('overlay'),
    );
    fragment.getElementById('label').append(
      fragment.getElementById('icon'),
    );
    fragment.getElementById('control').setAttribute('type', 'radio');
    return fragment;
  }

  // @ts-ignore @override
  // eslint-disable-next-line class-methods-use-this
  get type() { return 'radio'; }
}
