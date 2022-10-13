import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends ExtendedFab {
  static elementName = 'mdw-fab';

  static styles = [...super.styles, styles];

  constructor() {
    super();
    if (this.icon == null) {
      this.icon = this.textContent ?? '';
    }
  }

  compose() {
    const fragment = super.compose();
    fragment.getElementById('icon').append(
      fragment.getElementById('slot'),
    );
    return fragment;
  }
}

/** @type {'small'|'large'} */
Fab.prototype.fabSize = Fab.idl('fabSize');
