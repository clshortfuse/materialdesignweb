import Block from '../layout/Block.js';

import styles from './Body.css' assert { type: 'css' };

export default Block
  .extend()
  .css(styles)
  .on({
    composed() {
      this.refs.slot.setAttribute('type-style', '');
    },
  })
  .autoRegister('mdw-body');
