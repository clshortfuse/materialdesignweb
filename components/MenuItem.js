// https://www.w3.org/TR/wai-aria-practices/#menu

import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Input from './Input.js';
import styles from './MenuItem.css' assert { type: 'css' };

export default class MenuItem extends Input {
  static elementName = 'mdw-menu-item';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=icon aria-hidden="true" src={src}>{icon}</mdw-icon>
      <span id=trailing>
        <slot id=trailing-slot name=trailing role=note>{trailing}</slot>
        <mdw-icon id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
      </span>
    `,
  ];

  static get template() {
    const template = super.template;
    template.getElementById('label').append(
      template.getElementById('icon'),
      template.getElementById('trailing'),
    );
    const control = template.getElementById('control');
    control.setAttribute('type', 'button');
    control.setAttribute('role', 'menuitem');
    return template;
  }

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

  /**
   * @param {MouseEvent} event
   * @this {MenuItem}
   * @return {void}
   */
  static onMouseMove(event) {
    if (!this) return;

    const previousFocus = document.activeElement;
    // Already focused
    if (previousFocus === this) return;

    if (this.getAttribute('aria-disabled') === 'true') return;
    this.focus();
    if (document.activeElement !== this
    && document.activeElement !== previousFocus
    && previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    // Menu items should always receive focus
    switch (name) {
      case 'disabled':
        this.#input.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
        break;
      default:
    }
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'type':
        switch (newValue) {
          default:
          case 'button':
            this.#input.setAttribute('role', 'menuitem');
            break;
          case 'checkbox':
            this.#input.setAttribute('role', 'menuitemcheckbox');
            break;
          case 'radio':
            this.#input.setAttribute('role', 'menuitemradio');
            break;
        }
        break;
      default:
    }
  }

  /**
   * @return {boolean} handled
   */
  openSubMenu() {
    const hasPopup = this.getAttribute('aria-haspopup');
    if (hasPopup !== 'menu' && hasPopup !== 'true') {
      return false;
    }

    // TODO: Open new menu
    return false;
  }

  connectedCallback() {
    super.connectedCallback();
    RovingTabIndex.attach(this);
    this.addEventListener('mousemove', MenuItem.onMouseMove);
  }

  /**
   * @return {void}
   */
  disconnectedCallback() {
    RovingTabIndex.detach(this);
  }
}

MenuItem.prototype.type = MenuItem.idl('type', { empty: 'button' });
MenuItem.prototype.icon = MenuItem.idl('icon');
MenuItem.prototype.src = MenuItem.idl('src');
MenuItem.prototype.trailing = MenuItem.idl('trailing');
MenuItem.prototype.trailingIcon = MenuItem.idl('trailingIcon');
MenuItem.prototype.trailingSrc = MenuItem.idl('trailingSrc');
