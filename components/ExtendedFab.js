import Button from './Button.js';
import styles from './ExtendedFab.css' assert { type: 'css' };

export default Button
  .extend()
  .css(styles)
  .autoRegister('mdw-extended-fab');
