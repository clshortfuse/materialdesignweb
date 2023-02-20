import styles from './Nav.css' assert { type: 'css' };
import NavItem from './NavItem.js';
import Surface from './Surface.js';

export default Surface
  .extend()
  .css(styles)
  .define({
    /** @return {NodeListOf<InstanceType<NavItem>>} */
    childNavItems() {
      return (this.querySelectorAll(NavItem.elementName));
    },
  })
  .set({
    elevated: true,
  })
  .events({
    '~click'(event) {
      // Abort if not child
      if (event.target === this) return;
      if (event.target instanceof NavItem === false) return;
      for (const el of this.childNavItems) {
        el.active = (el === event.target);
      }
    },
  })
  .autoRegister('mdw-nav');
