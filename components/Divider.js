import Container from './Container.js';
import styles from './Divider.css' assert { type: 'css' };

export default class Divider extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-divider';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    return super.compose(
      styles,
      ...parts,
    );
  }
}
