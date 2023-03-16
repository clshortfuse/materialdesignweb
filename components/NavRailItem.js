import NavItem from './NavItem.js';
import styles from './NavRailItem.css' assert { type: 'css' };

export default NavItem
  .extend()
  .css(styles)
  .autoRegister('mdw-nav-rail-item');
