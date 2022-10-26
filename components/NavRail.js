import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-rail';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <slot id=start name=start></slot>
      <div id=group></div>
    `,
  ];

  static get template() {
    const template = super.template;
    template.getElementById('group').append(
      template.getElementById('slot'),
    );
    return template;
  }
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idl('align'));
