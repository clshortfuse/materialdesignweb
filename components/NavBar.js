import Nav from './Nav.js';
import styles from './NavBar.css' assert { type: 'css' };

export default class NavBar extends Nav {
  static elementName = 'mdw-nav-bar';

  static styles = [...super.styles, styles];
}
