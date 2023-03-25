import ThemableMixin from '../mixins/ThemableMixin.js';

import Box from './Box.js';

export default Box
  .mixin(ThemableMixin)
  .extend()
  .observe({
    ariaLevel: 'string',
    size: {
      type: 'string',
      /** @type {'large'|'medium'|'small'} */
      empty: 'large',
    },
  })
  .expressions({
    computeAriaLevel({ ariaLevel, size }) {
      if (ariaLevel) return ariaLevel;
      if (size === 'medium') return '2';
      if (size === 'small') return '3';
      return '1';
    },
  })
  .on({
    composed() {
      const { slot } = this.refs;
      slot.setAttribute('role', 'heading');
      slot.setAttribute('aria-level', '{computeAriaLevel}');
    },
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
