import './Icon.js';

import RippleMixin from '../mixins/RippleMixin.js';

import Container from './Container.js';
import styles from './NavItem.css' assert { type: 'css' };

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

/** @implements {Omit<HTMLAnchorElement,DeprecatedHTMLAnchorElementProperties>} */
export default class NavItem extends RippleMixin(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-item';

  static delegatesFocus = true;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  /** @type {import('../core/Composition.js').Compositor<this>} */
  compose(...parts) {
    const composition = super.compose(...parts, styles);
    const html = this.html;
    const template = composition.template;
    template.append(html`
      <div id=indicator aria-hidden=true>
        ${template.getElementById('state')}
        ${template.getElementById('ripple')}
      </div>
      <mdw-icon id=icon aria-hidden=true src={src}>{icon}</mdw-icon>
      <a id=anchor aria-labelledby=slot aria-describedby=badge href=${({ href }) => href ?? '#'} aria-label=${({ ariaLabel }) => ariaLabel}>
        ${template.getElementById('slot')}
      </a>
      <span aria-hidden=true id=badge type-style=label-small color=error badge={badge} aria-current=${({ active }) => (active ? 'page' : null)}></mdw-container>
    `);
    return composition;
  }

  #anchor = /** @type {HTMLAnchorElement} */ (this.refs.anchor);

  /** @type {Container['attributeChangedCallback']} */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'aria-label':
        this.idlChangedCallback('ariaLabel', oldValue, newValue);
        break;
      default:
    }
  }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    this.#anchor.focus(options);
  }

  connectedCallback() {
    super.connectedCallback();

    // this.removeEventListener('click', this.onRippleClick);
    this.removeEventListener('mousedown', this.onRippleMouseDown);
    this.removeEventListener('touchstart', this.onRippleTouchStart);
    this.removeEventListener('keydown', this.onRippleKeyDown);
  }
}

NavItem.prototype.active = NavItem.idl('active', 'boolean');
NavItem.prototype.icon = NavItem.idl('icon');
NavItem.prototype.src = NavItem.idl('src');
NavItem.prototype.href = NavItem.idl('href');
NavItem.prototype.badge = NavItem.idl('badge');
