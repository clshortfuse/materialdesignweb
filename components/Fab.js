import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends ExtendedFab {
  static elementName = 'mdw-fab';

  static styles = [...super.styles, styles];

  static compose() {
    const fragment = super.compose();
    fragment.getElementById('icon').append(
      fragment.getElementById('slot'),
    );
    return fragment;
  }

  constructor() {
    super();
    this.icon = '';
  }
}

Fab.prototype.size = /** @type {'small'|'large'} */ (Fab.idlString('size'));
