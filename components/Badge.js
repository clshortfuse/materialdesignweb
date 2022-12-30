import styles from './Badge.css' assert { type: 'css'};
import Container from './Container.js';

export default Container
  .extend()
  .css(styles)
  .autoRegister('mdw-badge');
