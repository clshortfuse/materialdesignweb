import MDWButton from './MDWButton.js';
import styles from './MDWIconButton.css' assert { type: 'css' };

export default class MDWIconButton extends MDWButton {
  constructor() {
    super();
    this.setAttribute('mdw-icon', '');
    // Move slot into icon
    const slot = this.shadowRoot.querySelector('slot');
    slot.remove();
    this.iconElement.append(slot);
  }

  static elementName = 'mdw-icon-button';

  static get styles() { return [...super.styles, styles]; }
}
