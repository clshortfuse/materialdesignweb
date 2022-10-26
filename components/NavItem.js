import styles from './NavItem.css' assert { type: 'css' };
import Ripple from './Ripple.js';
import './Icon.js';

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

/** @implements {Omit<HTMLAnchorElement,DeprecatedHTMLAnchorElementProperties>} */
export default class NavItem extends Ripple {
  static { this.autoRegister(); }

  static elementName = 'mdw-nav-item';

  static delegatesFocus = true;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    /** @type {NavItem['html']} */
    const html = this.html;
    template.append(html`
      <div id=indicator aria-hidden=true></div>
      <mdw-icon id=icon aria-hidden=true src={src}>{icon}</mdw-icon>
      <a id=anchor aria-labelledby=slot aria-describedby=badge href=${({ href }) => href ?? '#'} aria-label=${({ ariaLabel }) => ariaLabel}></a>
      <span aria-hidden=true id=badge type-style=label-small color=error badge={badge} aria-current=${({ active }) => (active ? 'page' : null)}></mdw-container>
    `);

    template.getElementById('anchor').append(
      template.getElementById('slot'),
    );

    template.getElementById('indicator').append(
      template.getElementById('overlay'),
      template.getElementById('ripple'),
    );

    return template;
  }

  #anchor = /** @type {HTMLAnchorElement} */ (this.refs.anchor);

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
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

    // this.removeEventListener('click', Ripple.onRippleClick);
    this.removeEventListener('mousedown', Ripple.onRippleMouseDown);
    this.removeEventListener('touchstart', Ripple.onRippleTouchStart);
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
  }
}

NavItem.prototype.active = NavItem.idl('active', 'boolean');
NavItem.prototype.icon = NavItem.idl('icon');
NavItem.prototype.src = NavItem.idl('src');
NavItem.prototype.href = NavItem.idl('href');
NavItem.prototype.badge = NavItem.idl('badge');
