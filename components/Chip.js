import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default class Chip extends Button {
  constructor() {
    super();
    this.setAttribute('outlined', '');
  }

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'suggestion',
  ];

  static elementName = 'mdw-chip';

  static styles = [...super.styles, styles];
}
