import styles from './NavDrawer.css' assert { type: 'css' };
import NavRail from './NavRail.js';

export default class NavDrawer extends NavRail {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-drawer';

  static styles = [...super.styles, styles];
}
