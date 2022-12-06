import Container from './Container.js';
import styles from './Tooltip.css' assert { type: 'css' };

export default class Tooltip extends Container {
  static { this.autoRegister('mdw-tooltip'); }

  static ariaRole = 'tooltip';

  compose() {
    return super.compose().append(styles);
  }
}

Tooltip.prototype.open = Tooltip.idl('open', 'boolean');
