import Nav from './Nav.js';
import styles from './NavRail.css' assert { type: 'css' };

export default class NavRail extends Nav {
  constructor() {
    super();
    this.groupElement = this.shadowRoot.getElementById('group');
    this.groupElement.append(this.slotElement);
  }

  static elementName = 'mdw-nav-rail';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <slot id=start name=start></slot>
      <div id=group></div>
    `,
  ];
}

NavRail.prototype.align = /** @type {'start'|'center'|'end'} */ (NavRail.idlString('align'));
