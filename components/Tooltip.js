import Container from './Container.js';
import styles from './Tooltip.css' assert { type: 'css' };

export default class Tooltip extends Container {
  static elementName = 'mdw-tooltip';

  static ariaRole = 'tooltip';

  static { this.autoRegister(); }

  static styles = [...super.styles, styles];
}

Tooltip.prototype.open = Tooltip.idl('open', 'boolean');
