import ThemableMixin from '../mixins/ThemableMixin.js';

import Box from './Box.js';
import styles from './Headline.css' assert { type: 'css' };

export default Box
  .mixin(ThemableMixin)
  .extend()
  .css(styles)
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
  .autoRegister('mdw-headline');
