import MDWExtendedFab from './MDWExtendedFab.js';
import styles from './MDWFab.css' assert { type: 'css' };

export default class MDWFab extends MDWExtendedFab {
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
