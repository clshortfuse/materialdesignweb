import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';
import styles from './IconButton.css' assert { type: 'css' };

export default Button
  .mixin(TooltipTriggerMixin)
  .extend()
  .css(styles)
  .observe({
    _ariaPressed: {
      get({ type, checked }) {
        if (type !== 'checkbox') return null;
        return checked ? 'true' : 'false';
      },
      /**
       * @param {string} oldValue
       * @param {string} newValue
       */
      changedCallback(oldValue, newValue) {
        console.log('changing ariaPressed', oldValue, newValue);
        this.elementInternals.ariaPressed = newValue;
      },
    },
  })
  .expressions({
    isToggle({ type }) {
      return type === 'checkbox';
    },
  })
  .childEvents({
    control: {
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
    },
  })
  .on('composed', ({ $ }) => {
    $('#slot').remove();
    $('#icon').removeAttribute('_if');
    $('#tooltip-slot').removeAttribute('name');
    $('#label').setAttribute('toggle', '{isToggle}');
    // $('#label').setAttribute('selected', '{checked}');
    // icon.append($('#slot'));
    $('#icon').setAttribute('toggle', '{isToggle}');
    $('#icon').setAttribute('selected', '{checked}');
    $('#elevation').remove();

    const control = $('#control');
    control.setAttribute('aria-pressed', '{_ariaPressed}');
    control.setAttribute('aria-labelledby', 'tooltip');

    $('#outline').setAttribute('selected', '{checked}');
  })
  .autoRegister('mdw-icon-button');
