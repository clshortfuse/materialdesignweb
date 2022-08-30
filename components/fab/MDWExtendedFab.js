import MDWButton from '../button/MDWButton.js';

import styles from './MDWExtendedFab.css' assert { type: 'css' };

export default class MDWExtendedFab extends MDWButton {
  static elementName = 'mdw-extended-fab';

  static idlBooleanAttributes = [
    ...super.idlBooleanAttributes,
    'lowered',
  ];

  static styles = [...super.styles, styles];
}
