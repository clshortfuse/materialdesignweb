import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default class Chip extends Button {
  static { this.autoRegister(); }

  static elementName = 'mdw-chip';

  /** @type {Button['compose']} */
  compose(...parts) {
    return super.compose(
      styles,
      ...parts,
    );
  }

  constructor() {
    super();
    this.outlined = true;
  }
}

Chip.prototype.suggestion = Chip.idl('suggestion', 'boolean');
