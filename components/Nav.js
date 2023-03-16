import styles from './Nav.css' assert { type: 'css' };
import NavItem from './NavItem.js';
import Surface from './Surface.js';

export default Surface
  .extend()
  .css(styles)
  .set({
    elevated: true,
    color: 'surface',
  })
  .events({
    '~click'(event) {
      // Abort if not child
      if (event.target === this) return;
      if (event.target instanceof NavItem === false) return;
      for (const el of this.querySelectorAll('*')) {
        if (el instanceof NavItem === false) continue;
        el.active = (el === event.target);
      }
    },
  })
  .autoRegister('mdw-nav');
