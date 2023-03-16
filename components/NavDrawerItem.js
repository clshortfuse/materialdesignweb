import styles from './NavDrawerItem.css' assert { type: 'css' };
import NavItem from './NavItem.js';

export default NavItem
  .extend()
  .css(styles)
  .on({
    composed({ html }) {
      const { badge } = this.refs;
      badge.before(html`<span id="badge-text">{badge}</span>`);
      badge.remove();
    },
  })
  .autoRegister('mdw-nav-drawer-item');
