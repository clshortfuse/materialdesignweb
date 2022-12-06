import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';

import Container from './Container.js';
import styles from './TopAppBar.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */
/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class TopAppBar extends ScrollListenerMixin(AriaToolbarMixin(Container)) {
  static { this.autoRegister('mdw-top-app-bar'); }

  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'aria-label',
    ];
  }

  compose() {
    const composition = super.compose();

    const { html } = this;
    const { template } = composition;

    const slot = template.getElementById('slot');
    slot.setAttribute('onslotchange', '{onSlotChange}');

    return composition.append(
      styles,
      html`
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
      `,
    );
  }

  /** @type {Container['idlChangedCallback']} */
  idlChangedCallback(name, oldValue, newValue) {
    super.idlChangedCallback(name, oldValue, newValue);
    switch (name) {
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

  /**
   * @param {number} oldValue
   * @param {number} newValue
   */
  onScrollPositionChange(oldValue, newValue) {
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

  /** @override */
  // @ts-ignore @override
  get ariaActiveDescendantElement() {
    return this.refs.bar.ariaActiveDescendantElement;
  }

  set ariaActiveDescendantElement(value) {
    this.refs.bar.ariaActiveDescendantElement = value;
  }

  connectedCallback() {
    super.connectedCallback();
    this.startScrollListener(this.refs.bar.offsetParent);
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
TopAppBar.prototype._scrollDirection = /** @type {'up'|'down'} */ (TopAppBar.idl('_scrollDirection', { empty: 'down' }));
TopAppBar.prototype._visibleStart = TopAppBar.idl('_visibleStart', { type: 'float', default: 0 });
TopAppBar.prototype._translateY = TopAppBar.idl('_translateY', { type: 'float', empty: 0 });
TopAppBar.prototype._transition = TopAppBar.idl('_transition', { empty: 'none' });
TopAppBar.prototype._headlineOpacity = TopAppBar.idl('_headlineOpacity', { type: 'float', default: 0 });
