// https://www.w3.org/TR/wai-aria-practices/#menu

import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Input from './Input.js';
import styles from './MenuItem.css' assert { type: 'css' };

export default class MenuItem extends Input {
  static ariaRole = 'none';

  static elementName = 'mdw-menu-item';

  constructor() {
    super();
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.trailingElement = this.shadowRoot.getElementById('trailing');
    this.trailingIconElement = this.shadowRoot.getElementById('trailing-icon');
    this.trailingSlotElement = this.shadowRoot.getElementById('trailing-slot');
    this.labelElement.append(
      this.iconElement,
      this.trailingElement,
    );
    if (!this.hasAttribute('type')) {
      this.type = 'button';
      this.inputElement.setAttribute('role', 'menuitem');
    }
  }

  static fragments = [
    ...super.fragments,
    /* html */`
      <mdw-icon id=icon aria-hidden="true"></mdw-icon>
      <span id=trailing>
        <slot id=trailing-slot name=trailing role=note></slot>
        <mdw-icon id=trailing-icon aria-hidden="true"></mdw-icon>
      </span>
    `,
  ];

  static styles = [...super.styles, styles];

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Menu items should always receive focus
    switch (name) {
      case 'disabled':
        this.inputElement.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
        return;
      case 'type':
        switch (newValue) {
          case null:
            this.inputElement.setAttribute('role', 'menuitem');
            break;
          case 'checkbox':
            this.inputElement.setAttribute('role', 'menuitemcheckbox');
            break;
          case 'radio':
            this.inputElement.setAttribute('role', 'menuitemradio');
            break;
          default:
        }
        break;
      case 'icon':
      case 'src':
        if (newValue == null) {
          this.iconElement.removeAttribute(name);
        } else {
          this.iconElement.setAttribute(name, newValue);
        }
        break;
      case 'trailing':
        this.trailingSlotElement.textContent = newValue;
        break;
      case 'trailing-icon':
        if (newValue == null) {
          this.trailingIconElement.removeAttribute('icon');
        } else {
          this.trailingIconElement.setAttribute('icon', newValue);
        }
        break;
      case 'trailing-src':
        if (newValue == null) {
          this.trailingIconElement.removeAttribute('src');
        } else {
          this.trailingIconElement.setAttribute('src', newValue);
        }
        break;
      default:
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

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
   * @param {MouseEvent|PointerEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputClick(event) {
    /** @type {{host:MenuItem}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;

    this.checked = false;
    host.toggleAttribute('checked', false);
  }

  /**
   * @param {KeyboardEvent} event
   * @this {HTMLInputElement}
   * @return {void}
   */
  static onInputKeydown(event) {
    if (event.key !== 'Spacebar' && event.key !== ' ') return;
    /** @type {{host:MenuItem}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }

    if (this.type !== 'radio') return;
    if (this.required) return;
    if (!this.hasAttribute('checked')) return;
    event.preventDefault();

    this.checked = false;
    host.toggleAttribute('checked', false);
    event.preventDefault();
  }

  /**
   * @param {Event} event
   * @this {HTMLInputElement} this
   * @return {void}
   */
  static onInputChange(event) {
    /** @type {{host:MenuItem}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.hasAttribute('disabled')) {
      event.preventDefault();
      return;
    }
    host.toggleAttribute('checked', this.checked);
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
    this.inputElement.addEventListener('click', MenuItem.onInputClick);
    this.inputElement.addEventListener('change', MenuItem.onInputChange);
    this.inputElement.addEventListener('keydown', MenuItem.onInputKeydown);
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
