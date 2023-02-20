import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default Button
  .extend()
  .observe({
    suggestion: 'boolean',
  })
  .css(styles)
  .on({
    composed({ $ }) {
      $('#slot').setAttribute('disabled', '{disabledState}');
      $('#outline').setAttribute('_if', '{!elevated}');
    },
  })
  .autoRegister('mdw-chip');
