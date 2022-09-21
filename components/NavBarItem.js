import styles from './NavBarItem.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @implements {HTMLAnchorElement} */
export default class NavBarItem extends Ripple {
  static delegatesFocus = true;

  static elementName = 'mdw-nav-bar-item';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */ `
      <a id=anchor href="#" aria-labelledby=slot>
        <div id=indicator>
          <mdw-container id=badge type-style=label-small color=error></mdw-container>
          <mdw-icon id=icon aria-hidden=true></mdw-icon>
        </div>
      </a>
    `,
  ];

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
    // Menu items should always receive focus
    switch (name) {
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
      case 'selected':
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
    super.attributeChangedCallback(name, oldValue, newValue);
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

NavBarItem.prototype.selected = NavBarItem.idlBoolean('selected');
NavBarItem.prototype.icon = NavBarItem.idlString('icon');
NavBarItem.prototype.src = NavBarItem.idlString('src');
NavBarItem.prototype.href = NavBarItem.idlString('href');
NavBarItem.prototype.badge = NavBarItem.idlString('badge');
