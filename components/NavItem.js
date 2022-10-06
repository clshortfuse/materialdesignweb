import styles from './NavItem.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */
/** @implements {Omit<HTMLAnchorElement,DeprecatedHTMLAnchorElementProperties>} */
export default class NavItem extends Ripple {
  static elementName = 'mdw-nav-item';

  static delegatesFocus = true;

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div id=indicator aria-hidden=true></div>
      <mdw-icon id=icon aria-hidden=true></mdw-icon>
      <a id=anchor href="#" aria-labelledby=slot aria-describedby=badge></a>
      <span aria-hidden=true id=badge type-style=label-small color=error></mdw-container>
    `,
  ];

  static styles = [...super.styles, styles];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  constructor() {
    super();
    this.anchorElement = /** @type {HTMLAnchorElement} */ (this.shadowRoot.getElementById('anchor'));
    this.indicatorElement = this.shadowRoot.getElementById('indicator');
    this.iconElement = this.shadowRoot.getElementById('icon');
    this.badgeElement = this.shadowRoot.getElementById('badge');
    this.indicatorElement.append(
      this.overlayElement,
      this.rippleElement,
    );
    this.anchorElement.append(this.slotElement);
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
        if (newValue == null) {
          this.anchorElement.removeAttribute('aria-label');
        } else {
          this.anchorElement.setAttribute('aria-label', newValue);
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
      case 'href':
        this.anchorElement.href = newValue ?? '#';
        break;
      case 'active':
        if (newValue == null) {
          this.anchorElement.removeAttribute('aria-current');
        } else {
          this.anchorElement.setAttribute('aria-current', 'page');
        }
        break;
      case 'badge':
        if (newValue == null) {
          this.badgeElement.removeAttribute('badge');
        } else {
          this.badgeElement.setAttribute('badge', newValue);
        }
        break;
      default:
    }
  }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    this.anchorElement?.focus(options);
  }

  connectedCallback() {
    super.connectedCallback();

    // this.removeEventListener('click', Ripple.onRippleClick);
    this.removeEventListener('mousedown', Ripple.onRippleMouseDown);
    this.removeEventListener('touchstart', Ripple.onRippleTouchStart);
    this.removeEventListener('keydown', Ripple.onRippleKeyDown);
  }
}

NavItem.prototype.active = NavItem.idlBoolean('active');
NavItem.prototype.icon = NavItem.idlString('icon');
NavItem.prototype.src = NavItem.idlString('src');
NavItem.prototype.href = NavItem.idlString('href');
NavItem.prototype.badge = NavItem.idlString('badge');
