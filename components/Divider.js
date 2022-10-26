import Container from './Container.js';
import styles from './Divider.css' assert { type: 'css' };

export default class Divider extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-divider';

  static styles = [...super.styles, styles];
}
