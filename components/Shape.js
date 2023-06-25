import ShapeMixin from '../mixins/ShapeMixin.js';

import Box from './Box.js';

export default Box
  .extend()
  .mixin(ShapeMixin)
  .recompose(({ refs: { shape, outline } }) => {
    shape.before(outline);
    shape.remove();
  })
  .css`
    :host {
      position: relative;

      overflow: hidden;

      z-index: auto;

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

    :host([color]) {
      background-color: rgb(var(--mdw-bg));
    }

    :host(:where([ink],[color])) {
      color: rgb(var(--mdw-ink));
    }

    :host([outlined]) {
      background-color: transparent;
    }

    :host(:is([color="none"], [color="transparent"])) {
      background-color: transparent;
    }

    @supports(-webkit-mask-box-image: none) {
      :host {
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
  .autoRegister('mdw-shape');
