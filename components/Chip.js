import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default class Chip extends Button {
  static elementName = 'mdw-chip';

  static styles = [...super.styles, styles];

  constructor() {
    super();
    this.outlined = true;
  }
}

Chip.prototype.suggestion = Chip.idl('suggestion', 'boolean');
