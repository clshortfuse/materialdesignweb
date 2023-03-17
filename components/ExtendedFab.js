import Button from './Button.js';
import styles from './ExtendedFab.css' assert { type: 'css' };

export default Button
  .extend()
  .css(styles)
  .observe({
    filled: { empty: 'tonal' },
    elevated: { type: 'boolean', empty: true },
  })
  .autoRegister('mdw-extended-fab');
