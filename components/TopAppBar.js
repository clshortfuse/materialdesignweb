import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';

import Container from './Container.js';
import styles from './TopAppBar.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */
/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class TopAppBar extends AriaToolbarMixin(Container) {
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
    slot.setAttribute('onslotchange', '{onSlotChange}');

    template.append(html`
      <div id="bar" role=toolbar aria-labelledby=headline style={computeBarStyle}>
        ${template.getElementById('elevation')}
        <div id=leading><slot id=leading-slot name=leading onslotchange={onSlotChange}></slot></div>
        <div id=headline style={computeHeadlineStyle}>
          {headline}
          ${slot}
        </div>
        <div id=trailing><slot id=trailing-slot name=trailing onslotchange={onSlotChange}></slot></div>
      </div>
      <div _if=${({ size }) => size === 'medium' || size === 'large'}
        id=companion aria-hidden=true><span id=companion-text>{headline}</span></div>
    `);
    return template;
  }

  static IDLE_TIMEOUT_MS = 500;

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

        if (this.size === 'medium' || this.size === 'large') {
          const max = this.refs.companion.scrollHeight;
          const min = (0.5 * max);
          this._headlineOpacity = Math.max(0, Math.min(1, (newValue - min) / (max - min)));
        }

        if (!this.hideOnScroll) return;

        this._transition = 'none';
        if (newValue <= 0) {
          // Set at rest (top of parent, but allow overscroll)
          this._cssPosition = 'relative';
          this._translateY = 0;
          this._visibleStart = 0;
        } else if (newValue < this._translateY) {
          // Align appbar.top with scroll position (top of screen)
          this._cssPosition = 'sticky';
          this._translateY = 0;
          this._visibleStart = 0;
        } else if (this._cssPosition !== 'sticky') {
          this._visibleStart = (newValue - this._translateY) / this.refs.bar.scrollHeight;
        }

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
        if (this._visibleStart < 1) return;
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

  computeBarStyle() {
    const { hideOnScroll, _cssPosition, _translateY, _transition } = this;
    if (!hideOnScroll) {
      return '';
    }
    return `
      position: ${_cssPosition};
      transform: translateY(${_translateY}px);
      transition: ${_transition};
    `;
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  onSlotChange(event) {
    /** @type {{host:TopAppBar}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.refreshTabIndexes();
  }

  /** @param {Partial<this>} data */
  computeHeadlineStyle({ size, _headlineOpacity }) {
    if (size !== 'medium' && size !== 'large') return '';
    return `opacity: ${_headlineOpacity}`;
  }

  onScrollIdle() {
    const _visibleStart = this._visibleStart;
    if (this._headlineOpacity > 0) {
      // Fill in opacity on idle
      this._headlineOpacity = 1;
    }
    if (_visibleStart <= 0) return;
    if (_visibleStart >= 1) return;
    if (this._scrollPosition < (this.refs.bar.scrollHeight)) return;
    if (_visibleStart <= 0.5) {
      // Reveal all
      this._cssPosition = 'relative';
      this._translateY = this._scrollPosition;
      this._transition = 'transform 250ms ease-in';
      this._headlineOpacity = 1;
    } else {
      this._cssPosition = 'relative';
      this._translateY = this._scrollPosition - this.refs.bar.scrollHeight;
      this._transition = 'transform 200ms ease-out';
    }
  }

  /** @param {Event} event */
  onParentScroll(event) {
    this._scrollPosition = (event.currentTarget === window)
      ? window.scrollY
      : /** @type {Element} */ (event.currentTarget).scrollTop;

    clearTimeout(this.scrollDebounce);
    this.scrollDebounce = setTimeout(() => this.onScrollIdle(), TopAppBar.IDLE_TIMEOUT_MS);
  }

  /**
   * @param {Element|Window} [scrollingElement]
   * @return {boolean}
   */
  startScrollListener(scrollingElement) {
    if (!scrollingElement) {
      // eslint-disable-next-line no-param-reassign
      scrollingElement = this.refs.bar.offsetParent;
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
    super.connectedCallback();
    this.startScrollListener();
  }

  disconnectedCallback() {
    this.clearScrollListener();
    super.disconnectedCallback();
  }
}

TopAppBar.prototype.headline = TopAppBar.idl('headline');
TopAppBar.prototype.raised = TopAppBar.idl('raised', 'boolean');
TopAppBar.prototype.hideOnScroll = TopAppBar.idl('hideOnScroll', 'boolean');
TopAppBar.prototype.size = /** @type {'small'|'medium'|'large'|null} */ TopAppBar.idl('size');
TopAppBar.prototype._cssPosition = TopAppBar.idl('_cssPosition', { empty: 'relative' });
TopAppBar.prototype._scrollPosition = TopAppBar.idl('_scrollPosition', { type: 'float', empty: 0 });
TopAppBar.prototype._scrollDirection = /** @type {'up'|'down'} */ (TopAppBar.idl('_scrollDirection', { empty: 'down' }));
TopAppBar.prototype._visibleStart = TopAppBar.idl('_visibleStart', { type: 'float', default: 0 });
TopAppBar.prototype._translateY = TopAppBar.idl('_translateY', { type: 'float', empty: 0 });
TopAppBar.prototype._transition = TopAppBar.idl('_transition', { empty: 'none' });
TopAppBar.prototype._headlineOpacity = TopAppBar.idl('_headlineOpacity', { type: 'float', default: 0 });
