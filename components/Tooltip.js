import Container from './Container.js';
import styles from './Tooltip.css' assert { type: 'css' };

export default Container
  .extend()
  .set({
    ariaRole: 'tooltip',
  })
  .css(styles)
  .observe({ open: 'boolean' })
  .autoRegister('mdw-tooltip');
