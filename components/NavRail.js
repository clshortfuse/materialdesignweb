import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  static { this.autoRegister('mdw-nav-rail'); }

  compose() {
    const composition = super.compose();
    const { html } = this;
    const { template } = composition;
    const nav = template.getElementById('nav');
    nav.prepend(html`<slot id=start name=start></slot>`);
    nav.append(
      html`
        <div id=group>${template.getElementById('slot')}</div>
      `,
    );
    return composition.append(
      styles,
    );
  }
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idl('align'));
