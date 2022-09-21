import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends ExtendedFab {
  constructor() {
    super();
    this.icon = '';
    this.iconElement.appendChild(this.slotElement);
  }

  static elementName = 'mdw-fab';

  static styles = [...super.styles, styles];
}

Fab.prototype.size = /** @type {'small'|'large'} */ (Fab.idlString('size'));
