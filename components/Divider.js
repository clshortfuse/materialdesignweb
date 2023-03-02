import Inline from '../layout/Inline.js';

import styles from './Divider.css' assert { type: 'css' };

export default Inline
  .extend()
  .observe({
    vertical: 'boolean',
  })
  .css(styles)
  .on({
    composed() {
      this.refs.slot.remove();
    },
  })
  .autoRegister('mdw-divider');
