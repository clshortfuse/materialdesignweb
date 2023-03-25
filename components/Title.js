import Headline from './Headline.js';

export default Headline
  .extend()
  .expressions({
    computeAriaLevel({ ariaLevel, size }) {
      if (ariaLevel) return ariaLevel;
      if (size === 'medium') return '5';
      if (size === 'small') return '6';
      return '4';
    },
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
