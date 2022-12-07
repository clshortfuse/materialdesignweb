import styles from './Divider.css' assert { type: 'css' };
import Text from './Text.js';

export default class Divider extends Text {
  static { this.autoRegister('mdw-divider'); }

  compose() {
    const composition = super.compose();
    composition.template.getElementById('slot').remove();
    return composition.append(styles);
  }
}

Divider.prototype.vertical = Divider.idl('vertical', 'boolean');
