import Box from './Box.js';
import styles from './Label.css' assert { type: 'css' };

export default Box
  .extend()
  .css(styles)
  .autoRegister('mdw-label');
