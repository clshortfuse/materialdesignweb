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
  .on({
    composed() {
      this.refs.shape.setAttribute('touch', '{touch}');
    },
  })
  .autoRegister('mdw-tooltip');
