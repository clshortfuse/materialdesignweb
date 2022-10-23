import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default class Fab extends ExtendedFab {
  static elementName = 'mdw-fab';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    template.getElementById('icon').append(
      template.getElementById('slot'),
    );
    return template;
  }

  constructor() {
    super();
    // Used for styling
    this.toggleAttribute('icon', true);
  }
}

/** @type {'small'|'large'} */
Fab.prototype.fabSize = Fab.idl('fabSize');

Fab.getIdls().delete('icon');
