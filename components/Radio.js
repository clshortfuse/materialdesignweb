import Input from './Input.js';
import styles from './Radio.css' assert { type: 'css' };

export default class Radio extends Input {
  static elementName = 'mdw-radio';

  static styles = [...super.styles, styles];

  static fragments = [...super.fragments,
  /* html */ `
    <div id=icon></div>
  `];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('icon').append(
      fragment.getElementById('ripple'),
      fragment.getElementById('overlay'),
    );
    fragment.getElementById('label').append(
      fragment.getElementById('icon'),
    );
    return fragment;
  }

  constructor() {
    super();
    if (!this.hasAttribute('type')) {
      this.type = 'radio';
      this.attributeChangedCallback('type', null, 'radio');
    }
  }
}

Radio.prototype.refs = {
  ...Input.prototype.refs,
  ...Radio.addRefNames('icon'),
};
