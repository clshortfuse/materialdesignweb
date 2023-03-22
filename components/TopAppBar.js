import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './TopAppBar.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(SurfaceMixin) // TopAppBars are non-shaped surfaces
  .mixin(AriaToolbarMixin)
  .mixin(ScrollListenerMixin)
  .mixin(ResizeObserverMixin)
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
    /** Convert to observable */
    ariaLabel: 'string',
    color: { empty: 'surface' },
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
          this._translateY = this.scrollListenerPositionY;
          return;
        }
        if (this._visibleStart < 1) return;
        // Align appbar.bottom with scroll position (top of screen)
        this._translateY = this.scrollListenerPositionY - this.refs.surface.scrollHeight;
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
    _headlineStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ size, _headlineOpacity }) {
        if (size !== 'medium' && size !== 'large') return null;
        return {
          target: 'headline',
          styles: {
            opacity: _headlineOpacity ?? 0,
          },
          timing: {
            duration: 200,
          },
        };
      },
    },
  })
  .css(styles)
  .html/* html */`
    <slot id=leading name=leading on-slotchange={refreshTabIndexes}></slot>
    <div id=headline ink={ink} color={color} type-style={typeStyle} on-slotchange={refreshTabIndexes}>
      {headline}
      <slot id=headline-slot></slot>
    </div>
    <slot id=trailing name=trailing on-slotchange={refreshTabIndexes}></slot>
    <div _if=${({ size }) => size === 'medium' || size === 'large'} id=companion aria-hidden=true size={size}>
      <div _if={showSurfaceTint} id=companion-tint raised={_raised} class=surface-tint color={color}></div>
      <slot id=companion-slot name=companion size={size}>{headline}</span>
    </div>
  `
  .on({
    composed({ inline }) {
      const { surface, leading, headline, trailing } = this.refs;
      surface.append(leading, headline, trailing);
      surface.setAttribute('size', '{size}');
      surface.setAttribute('hide-on-scroll', '{hideOnScroll}');
      surface.setAttribute('role', 'toolbar');
      surface.setAttribute('aria-label', '{ariaLabel}');
      surface.setAttribute(
        'aria-labelledby',
        inline(({ ariaLabel }) => (ariaLabel ? null : 'headline')),
      );
    },
    scrollListenerPositionYChanged(oldValue, newValue) {
      this._raised = (newValue > 0);
      if (this.size === 'medium' || this.size === 'large') {
        const max = this.refs.companion.scrollHeight;
        const min = (0.5 * max);
        this._headlineOpacity = Math.max(0, Math.min(1, (newValue - min) / (max - min)));
      }

      if (!this.hideOnScroll) return;

      this._duration = 0;
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
        this._visibleStart = (newValue - this._translateY) / this.refs.surface.scrollHeight;
      }

      this._scrollDirection = newValue > oldValue ? 'down' : 'up';
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
      if (this.scrollListenerPositionY < (this.refs.surface.scrollHeight)) return;
      if (_visibleStart <= 0.5) {
        // Reveal all
        this._duration = 250;
        this._easing = 'ease-in';
        this._cssPosition = 'relative';
        this._translateY = this.scrollListenerPositionY;
        this._headlineOpacity = 1;
      } else {
        this._duration = 200;
        this._easing = 'ease-out';
        this._cssPosition = 'relative';
        this._translateY = this.scrollListenerPositionY - this.refs.surface.scrollHeight;
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
  .on({
    connected() {
      const { surface } = this.refs;
      if (surface.offsetParent) {
        this.startScrollListener(surface.offsetParent ?? window);
      } else {
        const resizeObserver = new ResizeObserver(() => {
          this.startScrollListener(surface.offsetParent ?? window);
          resizeObserver.disconnect();
        });
        resizeObserver.observe(surface);
      }
    },
    disconnected() {
      this.clearScrollListener();
    },
  })
  .autoRegister('mdw-top-app-bar');
