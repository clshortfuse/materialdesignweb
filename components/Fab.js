import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends ExtendedFab {
  constructor() {
    super();
    this.setAttribute('icon', '');
    this.iconElement.appendChild(this.slotElement);
  }

  static idlStringAttributes = [
    ...super.idlStringAttributes,
    'size',
  ];

  static elementName = 'mdw-fab';

  static styles = [...super.styles, styles];
}
