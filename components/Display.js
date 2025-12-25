import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import TypographyMixin from '../mixins/TypographyMixin.js';

import Box from './Box.js';

/**
 * Material Design Type scale: Display
 * @see https://m3.material.io/styles/typography/type-scale-tokens
 */
export default Box
  .extend()
  .mixin(AriaReflectorMixin)
  .mixin(TypographyMixin)
  .set({
    /** ARIA role applied to the host (default: 'heading'). */
    _ariaRole: 'heading',
    /** Base aria level used when computing the heading level. */
    _baseAriaLevel: 1,
  })
  .observe({
    /** Explicit aria-level; if set, overrides the computed level. */
    ariaLevel: 'string',
    /** Display size controlling typographic scale: 'large'|'medium'|'small'. */
    size: {
      type: 'string',
      /** @type {'large'|'medium'|'small'} */
      empty: 'large',
    },
  })
  .observe({
    /** Computed aria-level (string) derived from `ariaLevel` and `size`. */
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
