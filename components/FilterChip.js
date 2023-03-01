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
    <mdw-icon _if={!icon} id=check-icon disabled={disabledState} selected={checked} aria-hidden="true">check</mdw-icon>
    <mdw-icon _if={computedTrailingIcon} id=trailing-icon aria-hidden="true" src={trailingSrc}>{computedTrailingIcon}</mdw-icon>
  `
  .on({
    composed({ $ }) {
      $('#label').setAttribute('icon', '');
      $('#label').setAttribute('trailing-icon', '{computedTrailingIcon}');
      $('#icon').setAttribute('_if', '{icon}');
      $('#icon').setAttribute('ink', '{iconInk}');
      const control = $('#control');
      control.removeAttribute('role');
      control.setAttribute('type', 'checkbox');
      const outline = $('#outline');
      outline.removeAttribute('ink');
      outline.removeAttribute('color');
      outline.setAttribute('selected', '{checked}');
      const slot = $('#slot');
      slot.removeAttribute('ink');
      slot.removeAttribute('color');
      $('#trailing-icon').before(slot);
    },
  })
  .autoRegister('mdw-filter-chip');
