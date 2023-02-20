import styles from './Badge.css' assert { type: 'css'};
import Surface from './Surface.js';

export default Surface
  .extend()
  .css(styles)
  .autoRegister('mdw-badge');
