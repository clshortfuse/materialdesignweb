import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default class Chip extends Button {
  constructor() {
    super();
    this.outlined = true;
  }

  static elementName = 'mdw-chip';

  static styles = [...super.styles, styles];
}

Chip.prototype.suggestion = Chip.idlBoolean('suggestion');
