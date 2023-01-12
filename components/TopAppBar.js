import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';

import Container from './Container.js';
import styles from './TopAppBar.css' assert { type: 'css' };

export default Container
  .mixin(AriaToolbarMixin)
  .mixin(ScrollListenerMixin)
  .extend()
  .observe({
    headline: 'string',
    raised: 'boolean',
    hideOnScroll: 'boolean',
    size: { value: /** @type {'small'|'medium'|'large'|null} */ (null) },
    _cssPosition: {
      /** @type {'sticky'|'relative'} */
      empty: 'relative',
    },
    _visibleStart: { type: 'float', default: 0 },
    _translateY: { type: 'float', empty: 0 },
    _transition: { empty: 'none' },
    _headlineOpacity: { type: 'float', default: 0 },
    ariaLabel: {
      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      changedCallback(oldValue, newValue) {
        if (newValue == null) {
          this.refs.bar.removeAttribute('aria-label');
          if (!this.hasAttribute('aria-labelledby')) {
            this.refs.bar.setAttribute('aria-labelledby', 'headline');
          }
        } else {
          this.refs.bar.setAttribute('aria-label', newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            this.refs.bar.removeAttribute('aria-labelledby');
          }
        }
      },
    },
  })
  .observe({
    _scrollDirection: {
      /**
       * @param {'up'|'down'} oldValue
       * @param {'up'|'down'} newValue
       */
      changedCallback(oldValue, newValue) {
        if (newValue === 'down') {
          if (this._cssPosition !== 'sticky') return;
          // Was sticky, switch to relative and let appbar scroll away
          this._cssPosition = 'relative';
          this._translateY = this._scrollPositionY;
          return;
        }
        if (this._visibleStart < 1) return;
        // Align appbar.bottom with scroll position (top of screen)
        this._translateY = this._scrollPositionY - this.refs.bar.scrollHeight;
      },
    },
  })
  .css(styles)
  .on('composed', ({ template, $, html }) => {
    const slot = $('#slot');
    slot.setAttribute('on-slotchange', '{refreshTabIndexes}');
    return template.append(
      html`
        <div id="bar" role=toolbar aria-labelledby=headline style={computeBarStyle}>
          ${$('#elevation')}
          <div id=leading><slot id=leading-slot name=leading on-slotchange={refreshTabIndexes}></slot></div>
          <div id=headline style={computeHeadlineStyle}>
            {headline}
            ${slot}
          </div>
          <div id=trailing><slot id=trailing-slot name=trailing on-slotchange={refreshTabIndexes}></slot></div>
        </div>
        <div _if=${({ size }) => size === 'medium' || size === 'large'}
          id=companion aria-hidden=true><span id=companion-text>{headline}</span></div>
      `,
    );
  })
  .on('_scrollPositionYChanged', (oldValue, newValue, element) => {
    element.raised = (newValue > 0);
    if (element.size === 'medium' || element.size === 'large') {
      const max = element.refs.companion.scrollHeight;
      const min = (0.5 * max);
      element._headlineOpacity = Math.max(0, Math.min(1, (newValue - min) / (max - min)));
    }

    if (!element.hideOnScroll) return;

    element._transition = 'none';
    if (newValue <= 0) {
      // Set at rest (top of parent, but allow overscroll)
      element._cssPosition = 'relative';
      element._translateY = 0;
      element._visibleStart = 0;
    } else if (newValue < element._translateY) {
      // Align appbar.top with scroll position (top of screen)
      element._cssPosition = 'sticky';
      element._translateY = 0;
      element._visibleStart = 0;
    } else if (element._cssPosition !== 'sticky') {
      element._visibleStart = (newValue - element._translateY) / element.refs.bar.scrollHeight;
    }

    element._scrollDirection = newValue > oldValue ? 'down' : 'up';
  })
  .expressions({
    computeBarStyle({ hideOnScroll, _cssPosition, _translateY, _transition }) {
      if (!hideOnScroll) {
        return '';
      }
      return `
        position: ${_cssPosition};
        transform: translateY(${_translateY}px);
        transition: ${_transition};
      `;
    },
    computeHeadlineStyle({ size, _headlineOpacity }) {
      if (size !== 'medium' && size !== 'large') return '';
      return `opacity: ${_headlineOpacity}`;
    },
  })
  .methods({
    onScrollIdle() {
      const _visibleStart = this._visibleStart;
      if (this._headlineOpacity > 0) {
        // Fill in opacity on idle
        this._headlineOpacity = 1;
      }
      if (_visibleStart <= 0) return;
      if (_visibleStart >= 1) return;
      if (this._scrollPositionY < (this.refs.bar.scrollHeight)) return;
      if (_visibleStart <= 0.5) {
        // Reveal all
        this._cssPosition = 'relative';
        this._translateY = this._scrollPositionY;
        this._transition = 'transform 250ms ease-in';
        this._headlineOpacity = 1;
      } else {
        this._cssPosition = 'relative';
        this._translateY = this._scrollPositionY - this.refs.bar.scrollHeight;
        this._transition = 'transform 200ms ease-out';
      }
    },
  })
  .define({
    ariaActiveDescendantElement: {
      get() {
        // @ts-ignore Accessibility Object Model
        return this.refs.bar.ariaActiveDescendantElement;
      },
      set(value) {
        // @ts-ignore Accessibility Object Model
        this.refs.bar.ariaActiveDescendantElement = value;
      },
    },
  })
  .on('connected', ({ element }) => {
    // @ts-ignore Skip cast
    element.startScrollListener(element.refs.bar.offsetParent);
  })
  .on('disconnected', ({ element }) => {
    element.clearScrollListener();
  })
  .autoRegister('mdw-top-app-bar');
