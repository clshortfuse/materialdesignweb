import Display from './Display.js';

/**
 * Material Design Type scale: Headline.
 * @see https://m3.material.io/styles/typography/type-scale-tokens
 */
export default Display
  .extend()
  .set({
    _baseAriaLevel: 4,
  })
  .css`
    :host {
      font: var(--mdw-typescale__headline-large__font);
      letter-spacing: var(--mdw-typescale__headline-large__letter-spacing);
    }
    
    :host([size="medium"]) {
      font: var(--mdw-typescale__headline-medium__font);
      letter-spacing: var(--mdw-typescale__headline-medium__letter-spacing);
    }
    
    :host([size="small"]) {
      font: var(--mdw-typescale__headline-small__font);
      letter-spacing: var(--mdw-typescale__headline-small__letter-spacing);
    }
  `
  .autoRegister('mdw-headline');
