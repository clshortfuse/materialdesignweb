import CustomElement from '../core/CustomElement.js';
import { ELEMENT_STYLER_TYPE } from '../core/customTypes.js';
import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';
import DelegatesFocusMixin from '../mixins/DelegatesFocusMixin.js';
import SemiStickyMixin from '../mixins/SemiStickyMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .mixin(AriaToolbarMixin)
  .mixin(SemiStickyMixin)
  .mixin(DelegatesFocusMixin)
  .observe({
    _raised: 'boolean',
    _headlineOpacity: { type: 'float', default: 0 },
    headline: 'string',
    size: { value: /** @type {'small'|'medium'|'large'|null} */ (null) },
    color: { empty: 'surface' },
  })
  .observe({
    _hostRaisedStyle: {
      ...ELEMENT_STYLER_TYPE,
      get({ _raised, color }) {
        if (!_raised) return null;
        if (color !== 'none' && color !== 'surface') return null;
        return {
          styles: {
            backgroundColor: 'rgb(var(--mdw-color__surface-container))',
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
  .expressions({
    _companionIf({ size }) {
      return size === 'medium' || size === 'large';
    },
  })
  .html`
    <slot id=leading name=leading on-slotchange={refreshTabIndexes}></slot>
    <div id=headline ink={ink} color={color} type-style={typeStyle} on-slotchange={refreshTabIndexes}>
      {headline}
      <slot id=headline-slot></slot>
    </div>
    <slot id=trailing name=trailing on-slotchange={refreshTabIndexes}></slot>
    <div mdw-if={_companionIf} id=companion aria-hidden=true size={size} color={color} raised={_raised}>
      <slot id=companion-slot name=companion size={size}>{headline}</span>
    </div>
  `
  .on({
    _scrollListenerPositionYChanged(oldValue, newValue) {
      this._raised = (newValue > this._semiStickyOffsetY);
      if (this.size === 'medium' || this.size === 'large') {
        const max = this.refs.companion.scrollHeight;
        const min = (0.5 * max);
        this._headlineOpacity = Math.max(0, Math.min(1, (newValue - min) / (max - min)));
      }
    },
    _scrollListenerLastIdleChanged() {
      if (this._headlineOpacity > 0) {
        // Fill in opacity on idle
        this._headlineOpacity = 1;
      }
    },
    _semiStickyTranslateYChanged(oldValue, newValue) {
      if (newValue === 0) {
        this._headlineOpacity = 1;
      }
    },
  })
  .css`
    /* https://m3.material.io/components/bottom-app-bar/specs */
    :host {
      --mdw-shape__size: 0;
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);

      position: sticky;
      inset-block-start: 0;

      display: grid;

      align-items: center;
      gap: 12px;

      grid-auto-flow: row;
      grid-template-rows: minmax(64px,min-content);
      grid-template-columns: minmax(auto,1fr) minmax(0,auto) minmax(auto,1fr);
      overflow-x: clip; /* Clip oversized touch targets to avoid scroll-bars */
      overflow-y: visible;

      box-sizing: border-box;

      /* 16px from icon */
      /* inset = (button.width / 2) - (icon.width / 2) */
      /* paddingInline = 16px - inset */
      /* paddingInlineStart = 16px - ((48px / 2) - (24px / 2)) */
      /* paddingInlineEnd = 16px - ((48px / 2) - (30px / 2)) */

      padding-inline: var(--mdw-page__padding-inline, 16px);

      pointer-events: auto;

      transform: translateY(0);
      z-index: 5;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      transition: grid-template-columns 100ms, background-color 100ms;
      will-change: transform;
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

    :host(:where([color="none"], [color="transparent"])),
    #companion:where([color="none"], [color="transparent"]) {
      background-color: transparent;
    }

    #companion[raised]:where([color="surface"],[color="none"],[color="transparent"]) {
      background-color: rgb(var(--mdw-color__surface-container));
    }
  `
  .autoRegister('mdw-top-app-bar');
