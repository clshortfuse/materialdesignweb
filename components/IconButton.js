import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default Button
  .mixin(TooltipTriggerMixin)
  .extend()
  .css(styles)
  .expressions({
    computeAriaPressed({ type, checked }) {
      if (type !== 'checkbox') return null;
      return checked ? 'true' : 'false';
    },
    isToggle({ type }) {
      return type === 'checkbox';
    },
  })
  .events('#control', {
    keydown(event) {
      if (event.key !== 'Enter') return;
      const input = /** @type {HTMLInputElement} */ (event.currentTarget);
      if (input.type !== 'checkbox') return;
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      if (input.disabled) return;

      // Simulate click
      const clickEvent = new Event('click', { bubbles: true, cancelable: true, composed: true });
      if (!input.dispatchEvent(clickEvent)) return;

      // Toggle check and signal
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
  })
  .on('composed', ({ $ }) => {
    $('#slot').remove();
    $('#tooltip-slot').removeAttribute('name');
    $('label').setAttribute('toggle', '{isToggle}');
    // icon.append($('#slot'));
    const icon = $('#icon');
    icon.setAttribute('style', '{computeIconStyle}');

    const control = $('#control');
    control.setAttribute('aria-pressed', '{computeAriaPressed}');
    control.setAttribute('aria-labelledby', 'tooltip');
  })
  .autoRegister('mdw-icon-button');
