import Container from './Container.js';
import styles from './Nav.css' assert { type: 'css' };
import NavItem from './NavItem.js';

export default class Nav extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav';

  static ariaRole = 'navigation';

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    return super.compose(
      styles,
      ...parts,
    );
  }

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {Nav}
   * @return {void}
   */
  onNavClick(event) {
    // Abort if not child
    if (event.target === this) return;
    if (event.target instanceof NavItem === false) return;
    for (const el of this.childNavItems) {
      el.active = (el === event.target);
    }
  }

  /** @return {NodeListOf<NavItem>} */
  get childNavItems() {
    return this.querySelectorAll(NavItem.elementName);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onNavClick);
  }
}
