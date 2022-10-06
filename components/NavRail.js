import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  static elementName = 'mdw-nav-rail';

  static fragments = [
    ...super.fragments,
    /* html */ `
      <slot id=start name=start></slot>
      <div id=group></div>
    `,
  ];

  static styles = [...super.styles, styles];

  constructor() {
    super();
    this.groupElement = this.shadowRoot.getElementById('group');
    this.groupElement.append(this.slotElement);
  }
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idlString('align'));
