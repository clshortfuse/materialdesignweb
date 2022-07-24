import MDWExtendedFabButton from './MDWExtendedFabButton.js';
import styles from './MDWFabButton.css' assert { type: 'css' };

export default class MDWFabButton extends MDWExtendedFabButton {
  constructor() {
    super();
    this.setAttribute('mdw-icon', '');
    // Move slot into icon
    const slot = this.shadowRoot.querySelector('slot');
    slot.remove();
    this.iconElement.append(slot);
  }

  static elementName = 'mdw-fab-button';

  static get styles() { return [...super.styles, styles]; }
}
