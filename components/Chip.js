import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default Button
  .extend()
  .observe({
    suggestion: 'boolean',
  })
  .css(styles)
  .autoRegister('mdw-chip');
