import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default Nav
  .extend()
  .observe({
    align: { value: /** @type {'start'|'center'|'end'} */ (null) },
  })
  .css(styles)
  .on({
    composed({ html }) {
      const { slot } = this.refs;
      slot.before(html`<slot id=start name=start></slot>`);
      slot.setAttribute('align', '{align}');
    },
  })
  .autoRegister('mdw-nav-rail');
