/** @param {typeof import('../core/CustomElement.js').default} Base */
export default function ShapeMaskedMixin(Base) {
  return Base
    .observe({
      shapeTop: 'boolean',
      shapeBottom: 'boolean',
      shapeStart: 'boolean',
      shapeEnd: 'boolean',
      shapeStyle: 'string',
    })
    .css`
    :host {
      --mdw-shape__size: 0px;
      --mdw-shape__ltr: calc(0.5 * var(--mdw-dir, 1) + 0.5); /* 1 if LTR, 0 if RTL */
      --mdw-shape__rtl: calc(-0.5 * var(--mdw-dir, 1) + 0.5); /* 0 if LTR, 1 if RTL */
      --mdw-shape__mask: none;

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
      --mdw-shape__mask: linear-gradient(transparent 50%, black 50%);
    }
    
    :host([shape-bottom]) {
      --mdw-shape__size__top-start-size: 0px;
      --mdw-shape__size__top-end-size: 0px;
      --mdw-shape__mask: linear-gradient(black 50%, transparent 50%);
    }
    
    :host([shape-start]) {
      --mdw-shape__size__top-end-size: 0px;
      --mdw-shape__size__bottom-end-size: 0px;
      --mdw-shape__mask: linear-gradient(var(--mdw-shape__inline-start-deg), black 50%, transparent 50%);
    }
    
    :host([shape-end]) {
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

    @supports(-webkit-mask-box-image: none) {
      :host {
        -webkit-mask-box-image: var(--mdw-shape__mask-border-source)
          8 fill /
          var(--mdw-shape__size)
          stretch;

        -webkit-mask: var(--mdw-shape__mask);

        transition-duration: 200ms;
        transition-property: -webkit-mask-box-image-width;
        will-change: -webkit-mask-box-image;
      }
    }
  `;
}
