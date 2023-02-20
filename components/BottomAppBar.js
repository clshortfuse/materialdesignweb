import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';

import styles from './BottomAppBar.css' assert { type: 'css' };
import Surface from './Surface.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

export default Surface
  .mixin(AriaToolbarMixin)
  .set({
    ariaRole: 'toolbar',
    elevated: true,
  })
  .observe({
    color: {
      empty: 'surface',
    },
  })
  .css(styles)
  .autoRegister('mdw-bottom-app-bar');
