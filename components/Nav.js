import Container from './Container.js';
import styles from './Nav.css' assert { type: 'css' };
import NavItem from './NavItem.js';

export default class Nav extends Container {
  static { this.autoRegister('mdw-nav'); }

  compose() {
    const composition = super.compose();

    const { html } = this;
    const { template } = composition;

    return composition.append(
      styles,
      html`
        <nav id="nav">
          ${template.getElementById('elevation')}
          ${template.getElementById('slot')}
        </nav>
      `,
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
