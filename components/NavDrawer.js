import styles from './NavDrawer.css' assert { type: 'css' };
import NavRail from './NavRail.js';

export default class NavDrawer extends NavRail {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-drawer';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    return super.compose(...parts, styles);
  }
}
