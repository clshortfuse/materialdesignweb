import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default Nav
  .extend()
  .observe({
    align: { value: /** @type {'start'|'center'|'end'} */ (null) },
  })
  .css(styles)
  .on('composed', ({ $, html }) => {
    const nav = $('#nav');
    nav.prepend(html`<slot id=start name=start></slot>`);
    nav.append(html`
      <div id=group>${$('#slot')}</div>
    `);
  })
  .autoRegister('mdw-nav-rail');
