/**
 * @param {ReturnType<import('./StateMixin.js').default> & ReturnType<import('./ThemableMixin.js').default>} Base
 */
export default function ShapeMixin(Base) {
  return Base
    .observe({
      shapeTop: 'boolean',
      shapeBottom: 'boolean',
      shapeStart: 'boolean',
      shapeEnd: 'boolean',
      shapeStyle: 'string',
      outlined: 'boolean',
    })
    .html`
      <div id=shape part=shape class=shape elevated={elevated} 
        shape-top={shapeTop} shape-bottom={shapeBottom} shape-start={shapeStart} shape-end={shapeEnd} shape-style={shapeStyle}
        color={color} outlined={outlined} disabled={disabledState}>
        <div id=outline mdw-if={outlined} class=outline disabled={disabledState} focused={focusedState} pressed={pressedState} hovered={hoveredState}>
          <div id=outline-left class="outline-section outline-left"></div>
          <div id=outline-right class="outline-section outline-right"></div>
        </div>
      </div>
    `
    .css`
      :host {
        --mdw-shape__size: 0px;
        --mdw-shape__bg: transparent;
        --mdw-surface__will-change: none;
        --mdw-shape__ltr: calc(0.5 * var(--mdw-dir, 1) + 0.5); /* 1 if LTR, 0 if RTL */
        --mdw-shape__rtl: calc(-0.5 * var(--mdw-dir, 1) + 0.5); /* 0 if LTR, 1 if RTL */

        /** By default, fallback to border-radius */
        --mdw-shape__rounded: 1;
        --mdw-shape__inline-start-deg: calc(var(--mdw-dir, 1) * -90deg);
        z-index: 0;
      }

      .shape {
        --mdw-shape__size__top-start-size: var(--mdw-shape__size);
        --mdw-shape__size__top-end-size: var(--mdw-shape__size);
        --mdw-shape__size__bottom-start-size: var(--mdw-shape__size);
        --mdw-shape__size__bottom-end-size: var(--mdw-shape__size);
      
        /* (1/2n + 1/2)L + (-1/2n + 1/2)R  */
        
        --mdw-shape__size__top-left-size: calc((var(--mdw-shape__ltr) * var(--mdw-shape__size__top-start-size)) + (var(--mdw-shape__rtl) * var(--mdw-shape__size__top-end-size)));
        --mdw-shape__size__top-right-size: calc((var(--mdw-shape__rtl) * var(--mdw-shape__size__top-start-size)) + (var(--mdw-shape__ltr) * var(--mdw-shape__size__top-end-size)));
        --mdw-shape__size__bottom-left-size: calc((var(--mdw-shape__ltr) * var(--mdw-shape__size__bottom-start-size)) + (var(--mdw-shape__rtl) * var(--mdw-shape__size__bottom-end-size)));
        --mdw-shape__size__bottom-right-size: calc((var(--mdw-shape__rtl) * var(--mdw-shape__size__bottom-start-size)) + (var(--mdw-shape__ltr) * var(--mdw-shape__size__bottom-end-size)));
      
      }

      .shape[shape-style="none"] {
        --mdw-shape__size: 0px;
      }
      
      .shape[shape-style="extra-small"] {
        --mdw-shape__size: var(--mdw-shape__extra-small);
      }
      
      .shape[shape-style="small"] {
        --mdw-shape__size: var(--mdw-shape__small);
      }
      
      .shape[shape-style="medium"] {
        --mdw-shape__size: var(--mdw-shape__medium);
      }
      
      .shape[shape-style="large"] {
        --mdw-shape__size: var(--mdw-shape__large);
      }
      
      .shape[shape-style="extra-large"] {
        --mdw-shape__size: var(--mdw-shape__extra-large);
      }
      
      .shape[shape-style="full"] {
        --mdw-shape__size: var(--mdw-shape__full);
      }
      
      .shape[shape-style="inherit"] {
        --mdw-shape__size: inherit;
      }
      
      .shape[shape-top] {
        --mdw-shape__size__bottom-start-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
        --mdw-shape__mask: linear-gradient(transparent 50%, black 50%);
      }
      
      .shape[shape-bottom] {
        --mdw-shape__size__top-start-size: 0px;
        --mdw-shape__size__top-end-size: 0px;
        --mdw-shape__mask: linear-gradient(black 50%, transparent 50%);
      }
      
      .shape[shape-start] {
        --mdw-shape__size__top-end-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
        --mdw-shape__mask: linear-gradient(var(--mdw-shape__inline-start-deg), black 50%, transparent 50%);
      }
      
      .shape[shape-end] {
        --mdw-shape__size__top-start-size: 0px;
        --mdw-shape__size__bottom-start-size: 0px;
        --mdw-shape__mask: linear-gradient(var(--mdw-shape__inline-start-deg), transparent 50%, black 50%);
      }
      
      @supports(-webkit-mask-box-image: none) {
        :host {
          /* Inherit all the way up to :root */
          --mdw-shape__rounded: inherit;
        }
      }
    `
    .css`
      .shape {
        position: absolute;
        inset: 0;
      
        overflow: hidden;
      
        z-index: -1;
      
        background-color: var(--mdw-shape__bg, transparent);
      
        border-start-start-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__top-start-size));
        border-start-end-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__top-end-size));
        border-end-start-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__bottom-start-size));
        border-end-end-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__bottom-end-size));
      
        transition-delay: 1ms;
        transition-duration: 200ms;
        transition-property: background-color, color;
        will-change: background-color, color;
      
      }

      .shape[outlined] {
        background-color: transparent;
      }
      
      .shape[color] {
        background-color: rgb(var(--mdw-bg));
        color: rgb(var(--mdw-ink));
      }
      
      .shape:is([color="none"], [color="transparent"]) {
        background-color: transparent;
      }

      @supports(-webkit-mask-box-image: none) {
        .shape {
          -webkit-mask-box-image: var(--mdw-shape__mask-border-source)
            8 fill /
            var(--mdw-shape__size)
            stretch;
    
          -webkit-mask: var(--mdw-shape__mask);

          transition-duration: 200ms, 200ms, 200ms;
          transition-property: background-color, color, -webkit-mask-box-image-width;
          will-change: background-color, color, -webkit-mask-box-image;
        }
      }
    `
    .css`
      .outline {
        position: absolute;
        inset: 0;
      
        pointer-events: none;
      
        border-color: currentColor;
        border-radius: inherit;
        color: rgb(var(--mdw-color__outline));
      }
      
      .outline:is([pressed],[focused]) {
        color: rgb(var(--mdw-ink));
      
        transition-delay: 0;
        transition-duration: 0;
      }
      
      .outline[disabled] {
        color: rgba(var(--mdw-color__on-surface), 0.12);
      }
      
      .outline::before {
        content: '';
      
        position: absolute;
        inset: 0;
      
        border-style: solid;
        border-width: 1px;
      
        border-radius: inherit;
      }
      
      @supports(-webkit-mask-box-image: none) {
        .outline::before {
          content: none;
        }
      
        .outline::after {
          content: '';
      
          position: absolute;
          inset: 0;
      
          -webkit-mask-box-image: var(--mdw-shape__mask-image__edges)
            8 fill /
            auto
            stretch;
      
          background-color: currentColor;
        }
      
        .outline-section {
          position: absolute;
          inset: 0;
        }
      
        .outline-section::before,
        .outline-section::after {
          content: "";
      
          position: absolute;
      
          max-block-size: 50%;
          max-inline-size: 50%;
      
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-size: contain;
      
          background-color: currentColor;
      
          transition-duration: 200ms;
          /* stylelint-disable-next-line liberty/use-logical-spec */
          transition-property: width, height;
        }
      
        .outline-left::before {
          /* stylelint-disable-next-line liberty/use-logical-spec */
          left: calc(-1px * var(--mdw-shape__convex));
          inset-block-start: calc(-1px * var(--mdw-shape__convex));
      
          block-size: calc(var(--mdw-shape__size__top-left-size));
          inline-size: calc(var(--mdw-shape__size__top-left-size));
          /* stylelint-disable-next-line liberty/use-logical-spec */
          padding-right: calc(2px * var(--mdw-shape__convex));
          padding-block-end: calc(2px * var(--mdw-shape__convex));
      
          -webkit-mask-image: var(--mdw-shape__mask-image__top-left);
        }
      
        .outline-left::after {
          /* stylelint-disable-next-line liberty/use-logical-spec */
          left: calc(-1px * var(--mdw-shape__convex));
          inset-block-end: calc(-1px * var(--mdw-shape__convex));
      
          block-size: var(--mdw-shape__size__bottom-left-size);
          inline-size: var(--mdw-shape__size__bottom-left-size);
          /* stylelint-disable-next-line liberty/use-logical-spec */
          padding-right: calc(2px * var(--mdw-shape__convex));
          padding-block-start: calc(2px * var(--mdw-shape__convex));
      
          -webkit-mask-image: var(--mdw-shape__mask-image__bottom-left);
          -webkit-mask-position-y: 100%;
        }
      
        .outline-right::before {
          /* stylelint-disable-next-line liberty/use-logical-spec */
          right: calc(-1px * var(--mdw-shape__convex));
          inset-block-start: calc(-1px * var(--mdw-shape__convex));
      
          block-size: var(--mdw-shape__size__top-right-size);
          inline-size: var(--mdw-shape__size__top-right-size);
          /* stylelint-disable-next-line liberty/use-logical-spec */
          padding-left: calc(2px * var(--mdw-shape__convex));
          padding-block-end: calc(2px * var(--mdw-shape__convex));
      
          -webkit-mask-image: var(--mdw-shape__mask-image__top-right);
          -webkit-mask-position-x: 100%;
        }

        .outline-right::after {
          /* stylelint-disable-next-line liberty/use-logical-spec */
          right: calc(-1px * var(--mdw-shape__convex));
          inset-block-end: calc(-1px * var(--mdw-shape__convex));
      
          block-size: var(--mdw-shape__size__bottom-right-size);
          inline-size: var(--mdw-shape__size__bottom-right-size);
          /* stylelint-disable-next-line liberty/use-logical-spec */
          padding-left: calc(2px * var(--mdw-shape__convex));
          padding-block-start: calc(2px * var(--mdw-shape__convex));
      
          -webkit-mask-image: var(--mdw-shape__mask-image__bottom-right);
          -webkit-mask-position-x: 100%;
          -webkit-mask-position-y: 100%;
        }
      }
    `;
}
