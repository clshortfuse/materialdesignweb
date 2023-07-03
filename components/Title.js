import Display from './Display.js';

export default Display
  .extend()
  .set({
    _baseAriaLevel: 7,
  })
  .css`
    :host {
      font: var(--mdw-typescale__title-large__font);
      letter-spacing: var(--mdw-typescale__title-large__letter-spacing);
    }
    
    :host([size="medium"]) {
      font: var(--mdw-typescale__title-medium__font);
      letter-spacing: var(--mdw-typescale__title-medium__letter-spacing);
    }
    
    :host([size="small"]) {
      font: var(--mdw-typescale__title-small__font);
      letter-spacing: var(--mdw-typescale__title-small__letter-spacing);
    }
  `
  .autoRegister('mdw-title');
