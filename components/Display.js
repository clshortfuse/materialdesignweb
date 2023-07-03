import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import TypographyMixin from '../mixins/TypographyMixin.js';

import Box from './Box.js';

export default Box
  .extend()
  .mixin(AriaReflectorMixin)
  .mixin(TypographyMixin)
  .set({
    _ariaRole: 'heading',
    _baseAriaLevel: 1,
  })
  .observe({
    ariaLevel: 'string',
    size: {
      type: 'string',
      /** @type {'large'|'medium'|'small'} */
      empty: 'large',
    },
  })
  .observe({
    _computedAriaLevel({ ariaLevel, size, _baseAriaLevel }) {
      if (ariaLevel) return ariaLevel;
      if (size === 'medium') return `${_baseAriaLevel + 1}`;
      if (size === 'small') return `${_baseAriaLevel + 2}`;
      return `${_baseAriaLevel}`;
    },
  })

  .on({
    _computedAriaLevelChanged(oldValue, newValue) {
      this.updateAriaProperty('ariaLevel', newValue);
    },
    constructed() {
      this.updateAriaProperty('ariaLevel', this._computedAriaLevel);
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
