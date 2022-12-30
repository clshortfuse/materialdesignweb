import Button from './Button.js';
import styles from './ExtendedFab.css' assert { type: 'css' };

export default Button
  .extend()
  .observe({
    lowered: 'boolean',
  })
  .css(styles)
  .autoRegister('mdw-extended-fab');
