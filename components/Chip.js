import Button from './Button.js';
import styles from './Chip.css' assert { type: 'css' };

export default Button
  .extend()
  .observe({
    suggestion: 'boolean',
  })
  .css(styles)
  .on({
    composed({ inline }) {
      const { slot, outline, icon } = this.refs;
      slot.setAttribute('disabled', '{disabledState}');
      slot.removeAttribute('ink');
      slot.removeAttribute('color');
      outline.setAttribute('_if', '{!elevated}');
      outline.setAttribute('ink', '{ink}');
      outline.setAttribute('color', '{color}');
      icon.setAttribute('ink', inline(({ ink, iconInk }) => iconInk ?? ink ?? 'primary'));
    },
  })
  .autoRegister('mdw-chip');
