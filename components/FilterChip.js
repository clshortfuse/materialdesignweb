import './Icon.js';

import Chip from './Chip.js';
import styles from './FilterChip.css' assert { type: 'css' };

export default Chip
  .extend()
  .observe({
    type: { empty: 'checkbox' },
    dropdown: 'boolean',
    trailingSrc: 'string',
    trailingIcon: 'string',
  })
  .expressions({
    computedTrailingIcon: ({ trailingIcon, dropdown, trailingSrc }) => {
      if (trailingIcon) return trailingIcon;
      if (dropdown) return 'arrow_drop_down';
      if (trailingSrc) return '';
      return null;
    },
  })
  .css(styles)
  .html/* html */`
    <mdw-icon _if={!icon} id=check-icon disabled={disabledState} selected={checked} aria-hidden=true>check</mdw-icon>
    <mdw-icon _if={computedTrailingIcon} id=trailing-icon aria-hidden=true src={trailingSrc}>{computedTrailingIcon}</mdw-icon>
  `
  .on({
    composed() {
      const { shape, icon, control, outline, slot, trailingIcon } = this.refs;

      shape.setAttribute('selected', '{checked}');
      shape.setAttribute('icon', '');
      shape.setAttribute('trailing-icon', '{computedTrailingIcon}');
      icon.setAttribute('_if', '{icon}');
      icon.setAttribute('ink', '{iconInk}');

      control.removeAttribute('role');
      control.setAttribute('type', 'checkbox');

      outline.removeAttribute('ink');
      outline.removeAttribute('color');
      outline.setAttribute('selected', '{checked}');

      slot.removeAttribute('ink');
      slot.removeAttribute('color');

      trailingIcon.before(slot);
    },
  })
  .autoRegister('mdw-filter-chip');
