import TypographyMixin from '../mixins/TypographyMixin.js';

import Box from './Box.js';

/**
 * Material Design Type scale: Body.
 * @see https://m3.material.io/styles/typography/type-scale-tokens
 */
export default Box
  .extend()
  .mixin(TypographyMixin)
  .css`
    :host {
      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }
    
    :host([size="medium"]) {
      font: var(--mdw-typescale__body-medium__font);
      letter-spacing: var(--mdw-typescale__body-medium__letter-spacing);
    }
    
    :host([size="small"]) {
      font: var(--mdw-typescale__body-small__font);
      letter-spacing: var(--mdw-typescale__body-small__letter-spacing);
    }
  `
  .autoRegister('mdw-body');
