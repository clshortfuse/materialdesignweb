import styles from './NavDrawer.css' assert { type: 'css' };
import NavRail from './NavRail.js';

export default NavRail
  .extend()
  .css(styles)
  .autoRegister('mdw-nav-drawer');
