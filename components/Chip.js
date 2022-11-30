import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default class Chip extends Button {
  static { this.autoRegister(); }

  static elementName = 'mdw-chip';

  compose() {
    return super.compose().append(styles);
  }

  constructor() {
    super();
    this.outlined = true;
  }
}

Chip.prototype.suggestion = Chip.idl('suggestion', 'boolean');
