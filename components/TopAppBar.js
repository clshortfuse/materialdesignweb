import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
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
    showAlways: 'boolean',
    size: { value: /** @type {'small'|'medium'|'large'|null} */ (null) },
    _visibleStart: { type: 'float', default: 0 },
    _translateY: { type: 'float', empty: 0 },
    _surfaceOffset: { type: 'float', empty: 0 },
    _surfaceSize: { type: 'float', empty: 0 },
    _duration: { type: 'float', empty: 0 },
    _easing: { empty: 'ease-in' },
    _headlineOpacity: { type: 'float', default: 0 },
    /** Convert to observable */
    ariaLabel: 'string',
    color: { empty: 'surface' },
  })
  .methods({
    /** Imperative call to recalculate layout */
    refreshSurfaceMetrics() {
      const { surface } = this.refs;
      this._surfaceOffset = surface.offsetTop;
      this._surfaceSize = surface.clientHeight;
    },
  })
  .observe({
    _scrollDirection: {
      /**
       * @param {'up'|'down'} oldValue
       * @param {'up'|'down'} newValue
       */
      changedCallback(oldValue, newValue) {
        if (this.showAlways) return;
        if (newValue === 'down') return;
        const offset = this.scrollListenerPositionY - this._surfaceOffset;
        const delta = offset - this._translateY;
        const visibility = delta / this._surfaceSize;

        // Don't move on partial visibility
        if (visibility < 1) return;

        // Align bottom
        this._translateY = offset - this._surfaceSize;
      },
    },
    _surfaceStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ _translateY, _duration, _easing }) {
        return {
          target: 'surface',
          styles: {
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
  .html/* html */`
    <slot id=leading name=leading on-slotchange={refreshTabIndexes}></slot>
    <div id=headline ink={ink} color={color} type-style={typeStyle} on-slotchange={refreshTabIndexes}>
      {headline}
      <slot id=headline-slot></slot>
    </div>
    <slot id=trailing name=trailing on-slotchange={refreshTabIndexes}></slot>
    <div mdw-if=${({ size }) => size === 'medium' || size === 'large'} id=companion aria-hidden=true size={size} color={color} raised={_raised}>
      <slot id=companion-slot name=companion size={size}>{headline}</span>
    </div>
  `
  .on({
    composed({ inline }) {
      const { surface, shape, leading, headline, trailing } = this.refs;
      shape.append(leading, headline, trailing);
      surface.append(shape);
      surface.setAttribute('size', '{size}');
      surface.setAttribute('role', 'toolbar');
      surface.setAttribute('aria-label', '{ariaLabel}');
      surface.setAttribute(
        'aria-labelledby',
        inline(({ ariaLabel }) => (ariaLabel ? null : 'headline')),
      );
      surface.setAttribute('raised', '{_raised}');
      shape.setAttribute('raised', '{_raised}');
    },
    scrollListenerPositionYChanged(oldValue, newValue) {
      const offset = newValue - this._surfaceOffset;
      this._raised = (offset > 0);
      if (this.size === 'medium' || this.size === 'large') {
        const max = this.refs.companion.scrollHeight;
        const min = (0.5 * max);
        this._headlineOpacity = Math.max(0, Math.min(1, (newValue - min) / (max - min)));
      }

      this._duration = 0;

      if (this.showAlways || offset < this._translateY) {
        // Align appbar.top with scroll position (top of screen)
        this._translateY = Math.max(0, offset);
      }

      this._scrollDirection = newValue > oldValue ? 'down' : 'up';
    },
  })
  .methods({
    onScrollIdle() {
      this.refreshSurfaceMetrics();
      if (this._headlineOpacity > 0) {
        // Fill in opacity on idle
        this._headlineOpacity = 1;
      }

      const offset = this.scrollListenerPositionY - this._surfaceOffset;
      const delta = offset - this._translateY;
      const visibility = delta / this._surfaceSize;

      if (visibility <= 0) return;
      if (visibility >= 1) return;
      if (visibility <= 0.5) {
        // Reveal all
        this._duration = 250;
        this._easing = 'ease-in';
        this._translateY = offset;
        this._headlineOpacity = 1;
      } else {
        this._duration = 200;
        this._easing = 'ease-out';
        this._translateY = offset - this._surfaceSize;
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
          this.refreshSurfaceMetrics();
        });
        resizeObserver.observe(surface);
      }
      this.refreshSurfaceMetrics();
    },
    disconnected() {
      this.clearScrollListener();
    },
  })
  .css/* css */`
    /* https://m3.material.io/components/bottom-app-bar/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      display: contents;

      z-index:2;
    }

    #surface {
      position: relative;

      margin: inherit; /** Pass through */

      padding: inherit; /** Pass through */

      filter: none; /* Never receive shadow */

      transform: translateY(0);

      z-index: 5;
      /* inset-inline: 0; */

      background-color: rgb(var(--mdw-bg));

      transition: grid-template-columns 100ms, background-color 100ms;

      will-change: transform;
    }

    #shape{
      position: initial;
      inset: initial;

      display: grid;

      align-items: center;
      gap: 12px;
      grid-auto-flow: row;
      grid-template-rows: minmax(64px,min-content);
      grid-template-columns: minmax(auto,1fr) minmax(0,auto) minmax(auto,1fr);
      overflow-x: clip; /* Clip oversized touch targets to avoid scroll-bars */
      overflow-y: visible;

      box-sizing: border-box;
      max-inline-size: calc(var(--mdw-content__max-width, 100%) + (2 * var(--mdw-content__padding, 16px) -  4px));
      margin-inline: auto;

      /* 16px from icon */
      /* inset = (button.width / 2) - (icon.width / 2) */
      /* paddingInline = 16px - inset */
      /* paddingInlineStart = 16px - ((48px / 2) - (24px / 2)) */
      /* paddingInlineEnd = 16px - ((48px / 2) - (30px / 2)) */

      padding-inline: calc(var(--mdw-content__padding, 16px) - 8px);

      pointer-events: auto;

      z-index: initial;

      background-color: transparent;

      color: rgb(var(--mdw-ink));
    }

    #leading {
      justify-self: flex-start;

      display: flex;
      align-items: center;

      grid-column: 1;
      grid-row: 1;
    }

    #headline {
      display: inline-block;

      overflow: clip hidden;

      max-inline-size: 100%;

      grid-column: 2;
      grid-row: 1;

      font: var(--mdw-typescale__title-large__font);
      letter-spacing: var(--mdw-typescale__title-large__letter-spacing);

      text-overflow: ellipsis;
      text-transform: none;
      white-space: nowrap;
      word-break: break-word;

      transition-duration: 200ms;
      transition-property: transform, opacity, color, background-color;
    }

    #trailing {
      justify-self: flex-end;

      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;

      grid-column: 3;
      grid-row: 1;

      color: var(--mdw-color__on-surface-variant);
    }

    /* Medium */
    #companion {
      position: relative;

      display: flex;
      align-items: flex-end;

      /**
       * Total Height = 112px
       * Bar = 12 + 40 + 12 (64)
       * Companion = 112px - 64
       * Companion Bottom = 20px
       * Companion = 28px
       * Shift up = 1lh - 28px
       */
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin-block-start: calc(28px - var(--mdw-typescale__headline-small__line-height));
      padding-block-end: 20px;
      padding-inline: 16px;

      background-color: rgb(var(--mdw-bg));

      box-shadow: none;

      font: var(--mdw-typescale__headline-small__font);
      letter-spacing: var(--mdw-typescale__headline-small__letter-spacing);
      white-space: nowrap;
    }

    #companion[size="large"] {
      /**
       * Total Height = 152px
       * Bar = 12 + 40 + 12 (64)
       * Companion = 152px - 64
       * Companion Bottom = 20px
       * Companion = 68px
       * Shift up = 2lh - 68px
       */

      min-block-size: calc(2 * var(--mdw-typescale__headline-medium__line-height));
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin-block-start: calc(68px - (2 * var(--mdw-typescale__headline-medium__line-height)));

      font: var(--mdw-typescale__headline-medium__font);
      letter-spacing: var(--mdw-typescale__headline-medium__letter-spacing);
      white-space: normal;
    }

    @supports(width: 1lh) {
      #companion {
        /* stylelint-disable-next-line declaration-property-value-disallowed-list */
        margin-block-start: calc(28px - 1lh);
      }

      #companion[size="large"] {
        min-block-size: 2lh;
        /* stylelint-disable-next-line declaration-property-value-disallowed-list */
        margin-block-start: calc(68px - 2lh);
      }
    }

    #companion-slot {
      display: block;
      overflow-x: clip;
      overflow-y: hidden;

      text-overflow: ellipsis;
      text-transform: none;
      word-break: break-word;
    }

    #companion-slot[size="large"] {
      max-block-size: calc(2 * var(--mdw-typescale__headline-medium__line-height));
    }

    @supports(-webkit-line-clamp: 2) {
      #companion-slot[size="large"] {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        max-block-size: none;
      }
    }

    #surface[size="small"] {
      gap: 4px;
      grid-template-columns: auto 1fr auto;
    }

    #headline:is([size="medium"],[size="large"]) {
      opacity: 0;

      will-change: opacity;
    }

    #surface:where([color="none"], [color="transparent"]),
    #companion:where([color="none"], [color="transparent"]) {
      background-color: transparent;
    }

    #surface[raised]:where([color="surface"],[color="none"],[color="transparent"]),
    #companion[raised]:where([color="surface"],[color="none"],[color="transparent"]) {
      background-color: rgb(var(--mdw-color__surface-container));
    }

  `
  .autoRegister('mdw-top-app-bar');
