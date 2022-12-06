import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  static { this.autoRegister('mdw-nav-rail'); }

  compose() {
    const composition = super.compose();
    const { html } = this;
    const { template } = composition;
    return composition.append(
      styles,
      html`
        <slot id=start name=start></slot>
        <div id=group>${template.getElementById('template')}</div>
      `,
    );
  }
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idl('align'));
