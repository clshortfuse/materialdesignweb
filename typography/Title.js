import Headline from './Headline.js';
import styles from './Title.css' assert { type: 'css' };

export default Headline
  .extend()
  .css(styles)
  .expressions({
    computeAriaLevel({ ariaLevel, size }) {
      if (ariaLevel) return ariaLevel;
      if (size === 'medium') return '5';
      if (size === 'small') return '6';
      return '4';
    },
  })
  .autoRegister('mdw-title');
