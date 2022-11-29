import Nav from './Nav.js';
import styles from './NavBar.css' assert { type: 'css' };

export default class NavBar extends Nav {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-bar';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    return super.compose(
      styles,
      ...parts,
    );
  }
}
