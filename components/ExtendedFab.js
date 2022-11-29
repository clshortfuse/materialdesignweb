import Button from './Button.js';
import styles from './ExtendedFab.css' assert { type: 'css' };

export default class ExtendedFab extends Button {
  static { this.autoRegister(); }

  static elementName = 'mdw-extended-fab';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    return super.compose(
      styles,
      ...parts,
    );
  }
}

ExtendedFab.prototype.lowered = ExtendedFab.idl('lowered', 'boolean');
