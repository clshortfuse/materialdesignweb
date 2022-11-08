import * as AriaToolbar from '../aria/toolbar.js';

import Container from './Container.js';
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
    /** @type {HTMLTemplater<TopAppBar>} */
    const html = this.html;
    const slot = template.getElementById('slot');
    slot.setAttribute('onslotchange', '{static.onSlotChange}');

    template.append(html`
      <div id="bar" role=toolbar aria-labelledby=headline style=${this.computeBarStyle}>
        ${template.getElementById('elevation')}
        <div id=leading><slot id=leading-slot name=leading onslotchange={static.onSlotChange}></slot></div>
        <div id=headline>
          {headline}
          ${slot}
        </div>
        <div id=trailing><slot id=trailing-slot name=trailing onslotchange={static.onSlotChange}></slot></div>
      </div>
      <div _if=${({ size }) => size === 'medium' || size === 'large'}
        id=companion aria-hidden=true><span id=companion-text>{headline}</span></div>
    `);
    return template;
  }

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

  /** @type {WeakRef<Element|Window>} */
  #scrollingElement;

  /** @type {EventListener} */
  #scrollListener;

  /** @type {Container['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
      case '_scrollPosition':
        this.raised = (newValue > 0);

        if (!this.hideOnScroll) return;

        // TODO: Watch for scroll stop and hide or reveal appbar if partially visible

        if (newValue <= 0) {
          // Set at rest (top of parent, but allow overscroll)
          this._cssPosition = 'relative';
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
          // Was sticky, switch to relative and let appbar scroll away
          this._cssPosition = 'relative';
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

  /** @type {Container['attributeChangedCallback']} */
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

  /** @param {Event} event */
  onParentScroll(event) {
    this._scrollPosition = (event.currentTarget === window)
      ? window.scrollY
      : /** @type {Element} */ (event.currentTarget).scrollTop;
  }

  /**
   * @param {Element|Window} [scrollingElement]
   * @return {boolean}
   */
  startScrollListener(scrollingElement) {
    if (!scrollingElement) {
      // eslint-disable-next-line no-param-reassign
      scrollingElement = this.hideOnScroll
        ? this.refs.bar.offsetParent
        : this.offsetParent;
      if (scrollingElement === document.body) {
        // eslint-disable-next-line no-param-reassign
        scrollingElement = window;
      }
      if (!scrollingElement) return false;
    }
    this.#scrollingElement = new WeakRef(scrollingElement);
    this.#scrollListener = this.onParentScroll.bind(this);
    scrollingElement.addEventListener('scroll', this.#scrollListener);
    return true;
  }

  /**
   * @param {Element|Window} scrollingElement
   * @return {boolean}
   */
  clearScrollListener(scrollingElement = this.#scrollingElement?.deref()) {
    if (!scrollingElement) return false;
    if (!this.#scrollListener) return false;
    scrollingElement.removeEventListener('scroll', this.#scrollListener);
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
TopAppBar.prototype._cssPosition = TopAppBar.idl('_cssPosition', { empty: 'relative' });
TopAppBar.prototype._scrollPosition = TopAppBar.idl('_scrollPosition', { type: 'float', empty: 0 });
TopAppBar.prototype._scrollDirection = /** @type {'up'|'down'} */ (TopAppBar.idl('_scrollDirection', { empty: 'down' }));
TopAppBar.prototype._onScreen = TopAppBar.idl('_onScreen', { default: true });
TopAppBar.prototype._translateY = TopAppBar.idl('_translateY', { type: 'float', empty: 0 });
