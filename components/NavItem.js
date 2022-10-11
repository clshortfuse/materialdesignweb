import Icon from './Icon.js';
import styles from './NavItem.css' assert { type: 'css' };
import Ripple from './Ripple.js';

/** @typedef {'charset'|'coords'|'name'|'shape'} DeprecatedHTMLAnchorElementProperties */
/** @implements {Omit<HTMLAnchorElement,DeprecatedHTMLAnchorElementProperties>} */
export default class NavItem extends Ripple {
  static elementName = 'mdw-nav-item';

  static styles = [...super.styles, styles];

  static delegatesFocus = true;

  static fragments = [
    ...super.fragments,
    /* html */ `
      <div id=indicator aria-hidden=true></div>
      <mdw-icon id=icon aria-hidden=true icon={icon} src={src}></mdw-icon>
      <a id=anchor href="#" aria-labelledby=slot aria-describedby=badge></a>
    `,
  ];

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  compose() {
    const fragment = super.compose();
    const { html } = this;
    fragment.getElementById('indicator').append(
      fragment.getElementById('overlay'),
      fragment.getElementById('ripple'),
    );
    fragment.getElementById('anchor').append(
      fragment.getElementById('slot'),
    );
    fragment.append(html`
      <span aria-hidden=true id=badge type-style=label-small color=error badge={badge} aria-current=${({ active }) => (active ? 'page' : null)}></mdw-container>
    `);
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
        if (newValue == null) {
          this.refs.anchor.removeAttribute('aria-label');
        } else {
          this.refs.anchor.setAttribute('aria-label', newValue);
        }
        break;
      case 'href':
        this.refs.anchor.href = newValue ?? '#';
        break;
      default:
    }
  }

  /** @type {HTMLElement['focus']} */
  focus(options = undefined) {
    super.focus(options);
    this.refs.anchor?.focus(options);
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

NavItem.prototype.refs = {
  ...Ripple.prototype.refs,
  ...NavItem.addRefs({
    anchor: 'a',
    icon: Icon,
  }),
};
