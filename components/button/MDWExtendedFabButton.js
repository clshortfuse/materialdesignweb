import MDWButton from './MDWButton.js';
import styles from './MDWExtendedFabButton.css' assert { type: 'css' };

export default class MDWExtendedFabButton extends MDWButton {
  static elementName = 'mdw-extended-fab-button';

  static get styles() { return [...super.styles, styles]; }
}
