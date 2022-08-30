import MDWButton from '../button/MDWButton.js';

import styles from './MDWChip.css' assert { type: 'css' };

export default class MDWChip extends MDWButton {
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
