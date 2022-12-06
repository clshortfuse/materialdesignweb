import Container from './Container.js';
import styles from './Divider.css' assert { type: 'css' };

export default class Divider extends Container {
  static { this.autoRegister('mdw-divider'); }

  compose() {
    return super.compose().append(styles);
  }
}

Divider.prototype.vertical = Divider.idl('vertical', 'boolean');
