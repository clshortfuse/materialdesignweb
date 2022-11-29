import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-rail';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    const composition = super.compose(
      styles,
      ...parts,
    );
    const html = this.html;
    const { template } = composition;
    template.append(html`
      <slot id=start name=start></slot>
      <div id=group>${template.getElementById('template')}</div>
    `);
    return composition;
  }
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idl('align'));
