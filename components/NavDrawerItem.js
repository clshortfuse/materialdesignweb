import styles from './NavDrawerItem.css' assert { type: 'css' };
import NavItem from './NavItem.js';

export default NavItem
  .extend()
  .css(styles)
  .on({
    composed({ html }) {
      this.refs.badge.replaceWith(html`<span id="badge-text">{badge}</span>`);
    },
  })
  .autoRegister('mdw-nav-drawer-item');
