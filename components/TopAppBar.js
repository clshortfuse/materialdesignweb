import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './TopAppBar.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(SurfaceMixin) // TopAppBars are non-shaped surfaces
  .mixin(AriaToolbarMixin)
  .mixin(ScrollListenerMixin)
  .extend()
  .set({
    elevated: true,
  })
  .observe({
    headline: 'string',
    _raised: 'boolean', // Change to raw value instead of computed
    hideOnScroll: 'boolean',
    size: { value: /** @type {'small'|'medium'|'large'|null} */ (null) },
    _cssPosition: {
      /** @type {'sticky'|'relative'} */
      empty: 'relative',
    },
    _visibleStart: { type: 'float', default: 0 },
    _translateY: { type: 'float', empty: 0 },
    _duration: { type: 'float', empty: 0 },
    _easing: { empty: 'ease-in' },
    _headlineOpacity: { type: 'float', default: 0 },
    ariaLabel: {
      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      changedCallback(oldValue, newValue) {
        if (newValue == null) {
          this.refs.surface.removeAttribute('aria-label');
          if (!this.hasAttribute('aria-labelledby')) {
            this.refs.surface.setAttribute('aria-labelledby', 'headline');
          }
        } else {
          this.refs.surface.setAttribute('aria-label', newValue);
          if (!this.hasAttribute('aria-labelledby')) {
            this.refs.surface.removeAttribute('aria-labelledby');
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
        this._translateY = this._scrollPositionY - this.refs.surface.scrollHeight;
      },
    },
    _surfaceStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ hideOnScroll, _cssPosition, _translateY, _duration, _easing }) {
        if (!hideOnScroll) {
          return null;
        }
        return {
          target: 'surface',
          styles: {
            position: _cssPosition,
            transform: `translateY(${_translateY}px)`,
          },
          timing: {
            duration: _duration,
            easing: _easing,
          },
        };
      },
    },
  })
  .css(styles)
  .html/* html */`
    <div id=leading><slot id=leading-slot name=leading on-slotchange={refreshTabIndexes}></div>
    <div id=headline style={computeHeadlineStyle} size={size}>
      {headline}
      <slot id=slot ink={ink} color={color} type-style={typeStyle} on-slotchange={refreshTabIndexes}></slot>
    </div>
    <div id=trailing><slot id=trailing-slot name=trailing on-slotchange={refreshTabIndexes}></div>
  `
  .on({
    composed({ template, html }) {
      this.refs.surface.setAttribute('size', '{size}');
      this.refs.surface.setAttribute('hide-on-scroll', '{hideOnScroll}');
      // Add to template Root
      template.append(html`
        <div _if=${({ size }) => size === 'medium' || size === 'large'} id=companion aria-hidden=true size={size}>
           <div _if={showSurfaceTint} id=companion-tint raised={_raised} class="surface-tint" color={color}></div>
           <span id=companion-text size={size}>{headline}</span>
        </div>
      `);
    },
  })
  .on('_scrollPositionYChanged', (oldValue, newValue, element) => {
    element._raised = (newValue > 0);
    if (element.size === 'medium' || element.size === 'large') {
      const max = element.refs.companion.scrollHeight;
      const min = (0.5 * max);
      element._headlineOpacity = Math.max(0, Math.min(1, (newValue - min) / (max - min)));
    }

    if (!element.hideOnScroll) return;

    element._duration = 0;
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
      element._visibleStart = (newValue - element._translateY) / element.refs.surface.scrollHeight;
    }

    element._scrollDirection = newValue > oldValue ? 'down' : 'up';
  })
  .expressions({
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
      if (this._scrollPositionY < (this.refs.surface.scrollHeight)) return;
      if (_visibleStart <= 0.5) {
        // Reveal all
        this._duration = 250;
        this._easing = 'ease-in';
        this._cssPosition = 'relative';
        this._translateY = this._scrollPositionY;
        this._headlineOpacity = 1;
      } else {
        this._duration = 200;
        this._easing = 'ease-out';
        this._cssPosition = 'relative';
        this._translateY = this._scrollPositionY - this.refs.surface.scrollHeight;
      }
    },
  })
  .define({
    ariaActiveDescendantElement: {
      get() {
        // @ts-ignore Accessibility Object Model
        return this.refs.surface.ariaActiveDescendantElement;
      },
      set(value) {
        // @ts-ignore Accessibility Object Model
        this.refs.surface.ariaActiveDescendantElement = value;
      },
    },
  })
  .on('connected', ({ element }) => {
    // @ts-ignore Skip cast
    element.startScrollListener(element.refs.surface.offsetParent ?? window);
  })
  .on('disconnected', ({ element }) => {
    element.clearScrollListener();
  })
  .autoRegister('mdw-top-app-bar');
