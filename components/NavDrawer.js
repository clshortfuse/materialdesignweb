import styles from './NavDrawer.css' assert { type: 'css' };
import NavRail from './NavRail.js';

export default class NavDrawer extends NavRail {
  static { this.autoRegister('mdw-nav-drawer'); }

  compose() {
    return super.compose().append(styles);
  }
}
