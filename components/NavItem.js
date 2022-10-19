import styles from './NavItem.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */

/** @implements {Omit<HTMLAnchorElement,DeprecatedHTMLAnchorElementProperties>} */
export default class NavItem extends Ripple {
  static elementName = 'mdw-nav-item';

  static styles = [...super.styles, styles];

  static delegatesFocus = true;

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  #anchor = /** @type {HTMLAnchorElement} */ (this.refs.anchor);

  compose() {
    const fragment = super.compose();
    const { html } = this;

    fragment.append(html`
      <div id=indicator aria-hidden=true></div>
      <mdw-icon id=icon aria-hidden=true src={src}>{icon}</mdw-icon>
      <a id=anchor aria-labelledby=slot aria-describedby=badge href=${({ href }) => href ?? '#'} aria-label=${({ ariaLabel }) => ariaLabel}></a>
      <span aria-hidden=true id=badge type-style=label-small color=error badge={badge} aria-current=${({ active }) => (active ? 'page' : null)}></mdw-container>
    `);

    fragment.getElementById('anchor').append(
      fragment.getElementById('slot'),
    );

    fragment.getElementById('indicator').append(
      fragment.getElementById('overlay'),
      fragment.getElementById('ripple'),
    );

    return fragment;
  }

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
