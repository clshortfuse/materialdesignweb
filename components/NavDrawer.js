import styles from './NavDrawer.css' assert { type: 'css' };
import NavRail from './NavRail.js';

export default NavRail
  .extend()
  .css(styles)
  .observe({
    shapeEnd: {
      type: 'boolean',
      empty: true,
    },
  })
  .autoRegister('mdw-nav-drawer');
