import Nav from './Nav.js';
import styles from './NavDrawer.css' assert { type: 'css' };

export default class NavDrawer extends Nav {
  static elementName = 'mdw-nav-drawer';

  static styles = [...super.styles, styles];
}
