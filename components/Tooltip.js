import Surface from './Surface.js';
import styles from './Tooltip.css' assert { type: 'css' };

export default Surface
  .extend()
  .set({
    ariaRole: 'tooltip',
  })
  .css(styles)
  .observe({
    open: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        this.setAttribute('aria-hidden', newValue ? 'false' : 'true');
      },
    },
    touch: 'boolean',
  })
  .autoRegister('mdw-tooltip');
