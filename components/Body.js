import styles from './Body.css' assert { type: 'css' };
import Box from './Box.js';

export default Box
  .extend()
  .css(styles)
  .autoRegister('mdw-body');
