// https://www.w3.org/TR/wai-aria-practices/#menu

import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Icon from './Icon.js';
import Input from './Input.js';
import styles from './MenuItem.css' assert { type: 'css' };

export default class MenuItem extends Input {
  static elementName = 'mdw-menu-item';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=icon aria-hidden="true" icon={icon} src={src}></mdw-icon>
      <span id=trailing>
        <slot id=trailing-slot name=trailing role=note>{trailing}</slot>
        <mdw-icon id=trailing-icon aria-hidden="true" icon={trailingIcon} src={trailingSrc}></mdw-icon>
      </span>
    `,
  ];

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

  compose() {
    const fragment = super.compose();
    fragment.getElementById('label').append(
      fragment.getElementById('icon'),
      fragment.getElementById('trailing'),
    );
    const input = fragment.getElementById('input');
    input.setAttribute('type', 'button');
    input.setAttribute('role', 'menuitem');
    return fragment;
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
        this.refs.input.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
        return;
      case 'type':
        switch (newValue) {
          case null:
            this.refs.input.setAttribute('role', 'menuitem');
            break;
          case 'checkbox':
            this.refs.input.setAttribute('role', 'menuitemcheckbox');
            break;
          case 'radio':
            this.refs.input.setAttribute('role', 'menuitemradio');
            break;
          default:
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

MenuItem.prototype.icon = MenuItem.idlString('icon');
MenuItem.prototype.src = MenuItem.idlString('src');
MenuItem.prototype.trailing = MenuItem.idlString('trailing');
MenuItem.prototype.trailingIcon = MenuItem.idlString('trailing-icon');
MenuItem.prototype.trailingSrc = MenuItem.idlString('trailing-src');
