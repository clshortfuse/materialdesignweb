import Container from './Container.js';
import styles from './Nav.css' assert { type: 'css' };
import NavItem from './NavItem.js';

export default Container
  .extend()
  .css(styles)
  .define({
    /** @return {NodeListOf<InstanceType<NavItem>>} */
    childNavItems() {
      return (this.querySelectorAll(NavItem.elementName));
    },
  })
  .on('composed', ({ template, $, html }) => template.append(html`
    <nav id="nav">
      ${$('#elevation')}
      ${$('#slot')}
    </nav>
  `))
  .events({
    click(event) {
      // Abort if not child
      if (event.target === this) return;
      if (event.target instanceof NavItem === false) return;
      for (const el of this.childNavItems) {
        el.active = (el === event.target);
      }
    },
  })
  .autoRegister('mdw-nav');
