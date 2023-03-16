import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

import Surface from './Surface.js';
import styles from './Tooltip.css' assert { type: 'css' };

export default Surface
  .mixin(AriaReflectorMixin)
  .extend()
  .set({
    _ariaRole: 'tooltip',
  })
  .css(styles)
  .observe({
    open: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        this.updateAriaProperty('ariaHidden', newValue ? 'true' : 'false');
      },
    },
    touch: 'boolean',
  })
  .autoRegister('mdw-tooltip');
