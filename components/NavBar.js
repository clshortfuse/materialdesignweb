import Container from './Container.js';
import styles from './NavBar.css' assert { type: 'css' };
import NavBarItem from './NavBarItem.js';

/** @implements {HTMLElement} */
export default class NavBar extends Container {
  static ariaRole = 'navigation';

  static elementName = 'mdw-nav-bar';

  static styles = [...super.styles, styles];

  /**
   * @param {PointerEvent|MouseEvent} event
   * @this {NavBar}
   * @return {void}
   */
  static onNavBarClick(event) {
    // Abort if not child
    if (event.target === this) return;
    for (const el of this.childNavBarItems) {
      el.selected = (el === event.target);
    }
  }

  /** @return {NodeListOf<NavBarItem>} */
  get childNavBarItems() {
    return this.querySelectorAll(NavBarItem.elementName);
  }

  connectedCallback() {
    this.addEventListener('click', NavBar.onNavBarClick);
  }
}
