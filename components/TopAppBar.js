import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import ResizeObserverMixin from '../mixins/ResizeObserverMixin.js';
import ScrollListenerMixin from '../mixins/ScrollListenerMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

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
  .html/* html */`
    <div id=content>
      <slot id=leading name=leading on-slotchange={refreshTabIndexes}></slot>
      <div id=headline ink={ink} color={color} type-style={typeStyle} on-slotchange={refreshTabIndexes}>
        {headline}
        <slot id=headline-slot></slot>
      </div>
      <slot id=trailing name=trailing on-slotchange={refreshTabIndexes}></slot>
    </div>
    <div mdw-if=${({ size }) => size === 'medium' || size === 'large'} id=companion aria-hidden=true size={size} color={color} raised={_raised}>
      <slot id=companion-slot name=companion size={size}>{headline}</span>
    </div>
  `
  .on({
    composed({ inline }) {
      const { surface, content } = this.refs;
      surface.append(content);
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
  .css/* css */`
    /* https://m3.material.io/components/bottom-app-bar/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      display: contents;

      z-index:2;
    }

    #surface {
      position: sticky;
      inset-block-start: 0;

      filter: none; /* Never receive shadow */

      z-index: 5;
      /* inset-inline: 0; */

      background-color: rgb(var(--mdw-bg));

      transition: grid-template-columns 100ms, background-color 100ms;
    }

    #content{
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

      transition: background-color 100ms;
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

    #surface[hide-on-scroll] {
      position: relative;

      inset-block-start: 0;

      transform: translateY(0);

      will-change: transform, position;
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
