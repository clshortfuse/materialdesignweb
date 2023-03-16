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
  .on({
    composed() {
      const { slot, shape, tooltipSlot, icon, label, surfaceTint, control, outline } = this.refs;
      shape.classList.add('colored');
      label.classList.add('colored');
      for (const el of [shape, label, icon]) {
        el.setAttribute('toggle', '{isToggle}');
        el.setAttribute('selected', '{checked}');
      }
      slot.remove();
      icon.removeAttribute('_if');
      tooltipSlot.removeAttribute('name');

      surfaceTint.remove();

      control.setAttribute('aria-pressed', '{_ariaPressed}');
      control.setAttribute('aria-labelledby', 'tooltip');

      outline.setAttribute('selected', '{checked}');
    },
  })
  .autoRegister('mdw-icon-button');
