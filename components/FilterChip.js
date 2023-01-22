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
        <mdw-icon _if={!icon} id=check-icon disabled={disabled} selected={checked} aria-hidden="true">check</mdw-icon>
        <mdw-icon id=trailing-icon aria-hidden="true" src={trailingSrc}>{trailingIcon}</mdw-icon>
      `);

      $('#icon').setAttribute('_if', '{icon}');
      const control = $('#control');
      control.removeAttribute('role');
      control.setAttribute('type', 'checkbox');
    },
  })
  .autoRegister('mdw-filter-chip');
