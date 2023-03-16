import styles from './NavBarItem.css' assert { type: 'css' };
import NavItem from './NavItem.js';

export default NavItem
  .extend()
  .css(styles)
  .autoRegister('mdw-nav-bar-item');
