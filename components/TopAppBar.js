import * as AriaToolbar from '../aria/toolbar.js';

import Container from './Container.js';
import CustomElement from './CustomElement.js';
import styles from './TopAppBar.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */
/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class TopAppBar extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-top-app-bar';

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    /** @type {import('./CustomElement.js').HTMLTemplater<TopAppBar>} */
    const html = this.html;
    template.append(/* html */html`
      <div id="bar" role=toolbar aria-labelledby=headline style=${this.computeBarStyle}>
        <div id=leading><slot id=leading-slot name=leading onslotchange={static.onSlotChange}></slot></div>
        <div id=headline>{headline}</div>
        <div id=trailing><slot id=trailing-slot name=trailing onslotchange={static.onSlotChange}></slot></div>
      </div>
      <div _if=${({ size }) => size === 'medium' || size === 'large'} id=companion aria-hidden=true><span id=companion-text>{headline}</span></div>
    `);

    const bar = template.getElementById('bar');
    bar.prepend(template.getElementById('elevation'));
    const slot = template.getElementById('slot');
    slot.setAttribute('onslotchange', '{static.onSlotChange}');
    template.getElementById('headline').append(slot);
    return template;
  }

  /** @type {WeakRef<Element>} */
  #offsetParent;

  /** @type {EventListener} */
  #scrollListener;

  #rafRequested = false;

  /**
   * @param {TopAppBar} instance
   * @return {string}
   */
  static computeBarStyle({ hideOnScroll, _cssPosition, _translateY }) {
    if (!hideOnScroll) return '';
    return `
      position: ${_cssPosition};
      transform: translateY(${_translateY}px);
    `;
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChange(event) {
    /** @type {{host:TopAppBar}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    if (host.kbdNav === 'arrow') {
      AriaToolbar.attach(host);
    }
  }

  /** @type {CustomElement['attributeChangedCallback']} */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    switch (name) {
      case 'aria-label':
        if (newValue == null) {
          this.refs.bar.removeAttribute(name);
          if (!this.hasAttribute('aria-labelledby')) {
            this.refs.bar.setAttribute('aria-labelledby', 'headline');
          }
        } else {
          this.refs.bar.setAttribute(name, newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            this.refs.bar.removeAttribute('aria-labelledby');
          }
        }
        break;
      default:
    }
  }

  onRaF() {
    this.style.setProperty('transform', `translateY(${this._translateY}px)`);
    this.#rafRequested = false;
  }

  /**
   * @param {string} name
   * @param {any} oldValue
   * @param {any} newValue
   * @return {void}
   */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case '_scrollPosition':
        this.raised = (newValue > 0);

        if (!this.hideOnScroll) return;

        // TODO: Watch for scroll stop and hide or reveal appbar if partially visible

        if (newValue <= 0) {
          // Set at rest (top of parent, but allow overscroll)
          this._cssPosition = 'static';
          this._translateY = 0;
        } else if (newValue < this._translateY) {
          // Align appbar.top with scroll position (top of screen)
          this._cssPosition = 'sticky';
          this._translateY = 0;
        }

        this._onScreen = this._cssPosition === 'sticky'
         || (newValue >= this._translateY && newValue <= this._translateY + this.refs.bar.scrollHeight);
        this._scrollDirection = newValue > oldValue ? 'down' : 'up';
        break;
      case '_scrollDirection':
        if (newValue === 'down') {
          if (this._cssPosition !== 'sticky') return;
          // Was sticky, switch to static and let appbar scroll away
          this._cssPosition = 'static';
          this._translateY = this._scrollPosition;
          return;
        }
        if (this._onScreen) return;
        // Align appbar.bottom with scroll position (top of screen)
        this._translateY = this._scrollPosition - this.refs.bar.scrollHeight;
        break;
      default:
    }
  }

  /** @param {Event} event */
  onParentScroll(event) {
    this._scrollPosition = /** @type {Element} */ (event.currentTarget).scrollTop;
  }

  /**
   * @param {Element} [offsetParent]
   * @return {boolean}
   */
  startScrollListener(offsetParent = this.hideOnScroll ? this.refs.bar.offsetParent : this.offsetParent) {
    if (!offsetParent) return false;
    this.#offsetParent = new WeakRef(offsetParent);
    this.#scrollListener = this.onParentScroll.bind(this);
    offsetParent.addEventListener('scroll', this.#scrollListener);
    return true;
  }

  /**
   * @param {Element} offsetParent
   * @return {boolean}
   */
  clearScrollListener(offsetParent = this.#offsetParent?.deref()) {
    if (!offsetParent) return false;
    if (!this.#scrollListener) return false;
    offsetParent.removeEventListener('scroll', this.#scrollListener);
    return true;
  }

  connectedCallback() {
    this.startScrollListener();
    if (this.kbdNav === 'arrow') {
      AriaToolbar.attach(this);
    }
  }

  disconnectedCallback() {
    this.clearScrollListener();
    AriaToolbar.detach(this);
  }
}

TopAppBar.prototype.kbdNav = TopAppBar.idl('kbdNav', { empty: 'arrow' });
TopAppBar.prototype.headline = TopAppBar.idl('headline');
TopAppBar.prototype.raised = TopAppBar.idl('raised', 'boolean');
TopAppBar.prototype.hideOnScroll = TopAppBar.idl('hideOnScroll', 'boolean');
TopAppBar.prototype.size = /** @type {'small'|'medium'|'large'|null} */ TopAppBar.idl('size');
TopAppBar.prototype._cssPosition = TopAppBar.idl('_cssPosition', { empty: 'static' });
TopAppBar.prototype._scrollPosition = TopAppBar.idl('_scrollPosition', { type: 'float', empty: 0 });
TopAppBar.prototype._scrollDirection = /** @type {'up'|'down'} */ (TopAppBar.idl('_scrollDirection', { empty: 'down' }));
TopAppBar.prototype._onScreen = TopAppBar.idl('_onScreen', { default: true });
TopAppBar.prototype._translateY = TopAppBar.idl('_translateY', { type: 'float', empty: 0 });
