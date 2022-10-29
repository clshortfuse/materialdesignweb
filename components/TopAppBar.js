import * as AriaToolbar from '../aria/toolbar.js';

import Container from './Container.js';
import styles from './TopAppBar.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */
/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class TopAppBar extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-top-app-bar';

  static ariaRole = 'toolbar';

  static styles = [...super.styles, styles];

  static get template() {
    const template = super.template;
    /** @type {import('./CustomElement.js').HTMLTemplater<TopAppBar>} */
    const html = this.html;
    template.append(/* html */html`
      <div id=leading><slot id=leading-slot name=leading onslotchange={static.onSlotChange}></slot></div>
      <div id=headline>{headline}</div>
      <div id=trailing><slot id=trailing-slot name=trailing onslotchange={static.onSlotChange}></slot></div>
      <div id=second-headline><span>{headline}</span></div>
    `);

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

        this._onScreen = (newValue >= this._translateY && newValue <= this._translateY + this.scrollHeight);
        this._scrollDirection = newValue > oldValue ? 'down' : 'up';

        if (newValue <= 0) {
          this._translateY = 0;
        } else if (newValue < this._translateY) {
          // TODO: Consider position sticky instead?
          this._translateY = newValue;
        }
        break;
      case '_scrollDirection':
        if (!this._onScreen && newValue === 'up') {
          this._translateY = this._scrollPosition - this.scrollHeight;
        }
        break;
      case '_translateY':
        if (this.#rafRequested) return;
        window.requestAnimationFrame(this.onRaF.bind(this));
        this.#rafRequested = true;
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
  startScrollListener(offsetParent = this.offsetParent) {
    if (!offsetParent) return false;
    this.#offsetParent = new WeakRef(this.offsetParent);
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
TopAppBar.prototype._scrollPosition = TopAppBar.idl('_scrollPosition', { type: 'float', empty: 0 });
TopAppBar.prototype._scrollDirection = /** @type {'up'|'down'} */ (TopAppBar.idl('_scrollDirection', { type: 'string', empty: 'down' }));
TopAppBar.prototype._onScreen = TopAppBar.idl('_onScreen', { type: 'boolean', default: true });
TopAppBar.prototype._translateY = TopAppBar.idl('_translateY', { type: 'float', empty: 0 });
