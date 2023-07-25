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
      <div id=outline mdw-if={outlined} class=outline disabled={disabledState} focused={focusedState} pressed={pressedState} hovered={hoveredState}></div>
    `
    .css`
      :host {
        --mdw-shape__size: 0px;
        --mdw-shape__ltr: calc(0.5 * var(--mdw-dir, 1) + 0.5); /* 1 if LTR, 0 if RTL */
        --mdw-shape__rtl: calc(-0.5 * var(--mdw-dir, 1) + 0.5); /* 0 if LTR, 1 if RTL */

        /** By default, fallback to border-radius */
        --mdw-shape__rounded: 1;
        --mdw-shape__inline-start-deg: calc(var(--mdw-dir, 1) * -90deg);

        --mdw-shape__size__top-start-size: var(--mdw-shape__size);
        --mdw-shape__size__top-end-size: var(--mdw-shape__size);
        --mdw-shape__size__bottom-start-size: var(--mdw-shape__size);
        --mdw-shape__size__bottom-end-size: var(--mdw-shape__size);
        /* (1/2n + 1/2)L + (-1/2n + 1/2)R  */
        
        --mdw-shape__size__top-left-size: calc((var(--mdw-shape__ltr) * var(--mdw-shape__size__top-start-size)) + (var(--mdw-shape__rtl) * var(--mdw-shape__size__top-end-size)));
        --mdw-shape__size__top-right-size: calc((var(--mdw-shape__rtl) * var(--mdw-shape__size__top-start-size)) + (var(--mdw-shape__ltr) * var(--mdw-shape__size__top-end-size)));
        --mdw-shape__size__bottom-left-size: calc((var(--mdw-shape__ltr) * var(--mdw-shape__size__bottom-start-size)) + (var(--mdw-shape__rtl) * var(--mdw-shape__size__bottom-end-size)));
        --mdw-shape__size__bottom-right-size: calc((var(--mdw-shape__rtl) * var(--mdw-shape__size__bottom-start-size)) + (var(--mdw-shape__ltr) * var(--mdw-shape__size__bottom-end-size)));
        z-index: 0;

        border-start-start-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__top-start-size));
        border-start-end-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__top-end-size));
        border-end-start-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__bottom-start-size));
        border-end-end-radius: calc(var(--mdw-shape__rounded) * var(--mdw-shape__size__bottom-end-size));
      }

      :host([shape-style="none"]) {
        --mdw-shape__size: 0px;
      }
      
      :host([shape-style="extra-small"]) {
        --mdw-shape__size: var(--mdw-shape__extra-small);
      }
      
      :host([shape-style="small"]) {
        --mdw-shape__size: var(--mdw-shape__small);
      }
      
      :host([shape-style="medium"]) {
        --mdw-shape__size: var(--mdw-shape__medium);
      }
      
      :host([shape-style="large"]) {
        --mdw-shape__size: var(--mdw-shape__large);
      }
      
      :host([shape-style="extra-large"]) {
        --mdw-shape__size: var(--mdw-shape__extra-large);
      }
      
      :host([shape-style="full"]) {
        --mdw-shape__size: var(--mdw-shape__full);
      }
      
      :host([shape-style="inherit"]) {
        --mdw-shape__size: inherit;
      }
      
      :host([shape-top]) {
        --mdw-shape__size__bottom-start-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
      }
      
      :host([shape-bottom]) {
        --mdw-shape__size__top-start-size: 0px;
        --mdw-shape__size__top-end-size: 0px;
      }
      
      :host([shape-start]) {
        --mdw-shape__size__top-end-size: 0px;
        --mdw-shape__size__bottom-end-size: 0px;
      }
      
      :host([shape-end]) {
        --mdw-shape__size__top-start-size: 0px;
        --mdw-shape__size__bottom-start-size: 0px;
      }
      
    `
    .css`
      .outline {
        position: absolute;
        inset: 0;

        border-style: solid;
        border-width: 1px;
      
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
      
    `;
}
