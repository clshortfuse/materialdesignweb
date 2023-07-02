import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import TypographyMixin from '../mixins/TypographyMixin.js';

import Box from './Box.js';

export default Box
  .extend()
  .mixin(AriaReflectorMixin)
  .mixin(TypographyMixin)
  .observe({
    ariaLevel: 'string',
    size: {
      type: 'string',
      /** @type {'large'|'medium'|'small'} */
      empty: 'large',
    },
  })
  .set({
    _ariaRole: 'heading',
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
    ariaLevelChanged(oldValue, newValue) {
      this.updateAriaProperty('ariaLevel', newValue);
    },
  })
  .css`
    :host {
      font: var(--mdw-typescale__display-large__font);
      letter-spacing: var(--mdw-typescale__display-large__letter-spacing);
    }
    
    :host([size="medium"]) {
      font: var(--mdw-typescale__display-medium__font);
      letter-spacing: var(--mdw-typescale__display-medium__letter-spacing);
    }
    
    :host([size="small"]) {
      font: var(--mdw-typescale__display-small__font);
      letter-spacing: var(--mdw-typescale__display-small__letter-spacing);
    }  
  `
  .autoRegister('mdw-display');
