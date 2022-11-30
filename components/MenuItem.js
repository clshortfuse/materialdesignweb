// https://www.w3.org/TR/wai-aria-practices/#menu

import './Icon.js';
import { addInlineFunction } from '../core/template.js';
import InputMixin from '../mixins/InputMixin.js';

import Container from './Container.js';
import styles from './MenuItem.css' assert { type: 'css' };

export default class MenuItem extends InputMixin(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-menu-item';

  compose() {
    const composition = super.compose().append(
      styles,
    );

    const { html } = this;
    const { template } = composition;
    template.getElementById('label').append(html`
      <mdw-icon _if={icon} id=icon aria-hidden="true" src={src}>{icon}</mdw-icon>
      <span id=trailing>
        <slot id=trailing-slot name=trailing role=note>{trailing}</slot>
        <mdw-icon _if=${({ trailingIcon, trailingSrc }) => trailingIcon || trailingSrc}
        id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
      </span>
    `);

    const control = template.getElementById('control');
    control.setAttribute('type', 'button');
    control.setAttribute('role', addInlineFunction(({ type }) => {
      switch (type) {
        case 'checkbox':
          return 'menuitemcheckbox';
        case 'radio':
          return 'menuitemradio';
        default:
        case 'button':
          return 'menuitem';
      }
    }));

    return composition;
  }

  #input = /** @type {HTMLInputElement} */ (this.refs.control);

  /** @type {Container['attributeChangedCallback']} */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    // Menu items should always receive focus
    switch (name) {
      case 'disabled':
        this.#input.setAttribute('aria-disabled', newValue == null ? 'false' : 'true');
        break;
      default:
    }
  }

  /**
   * @param {MouseEvent} event
   * @this {MenuItem}
   * @return {void}
   */
  onMouseMove(event) {
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
    this.addEventListener('mousemove', this.onMouseMove);
  }
}

MenuItem.prototype.type = MenuItem.idl('type', { empty: 'button' });
MenuItem.prototype.icon = MenuItem.idl('icon');
MenuItem.prototype.src = MenuItem.idl('src');
MenuItem.prototype.trailing = MenuItem.idl('trailing');
MenuItem.prototype.trailingIcon = MenuItem.idl('trailingIcon');
MenuItem.prototype.trailingSrc = MenuItem.idl('trailingSrc');
