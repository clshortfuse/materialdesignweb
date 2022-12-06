import Button from './Button.js';
import styles from './ExtendedFab.css' assert { type: 'css' };

export default class ExtendedFab extends Button {
  static { this.autoRegister('mdw-extended-fab'); }

  compose() {
    return super.compose().append(styles);
  }
}

ExtendedFab.prototype.lowered = ExtendedFab.idl('lowered', 'boolean');
