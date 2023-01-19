import Chip from './Chip.js';
import styles from './FilterChip.css' assert { type: 'css' };
import './Icon.js';

export default Chip
  .extend()
  .observe({
    type: { empty: 'checkbox' },
    trailingIcon: {
      parser(data) {
        if (data === '') return 'dropdown';
        return String(data);
      },
    },
    trailingSrc: 'string',
  })
  .css(styles)
  .on({
    composed({ $, html }) {
      $('#label').append(html`
        <mdw-icon id=check-icon aria-hidden="true">check</mdw-icon>
        <mdw-icon id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
      `);

      const control = $('#control');
      control.removeAttribute('role');
      control.setAttribute('autocomplete', 'off');
      control.setAttribute('type', 'checkbox');
    },
  })
  .autoRegister('mdw-filter-chip');
