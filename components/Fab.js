import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default ExtendedFab
  .mixin(TooltipTriggerMixin)
  .extend()
  .observe({
    fabSize: { value: /** @type {'small'|'large'} */ (null) },
  })
  .css(styles)
  .on('composed', ({ $ }) => {
    $('#slot').remove();
    $('#tooltip-slot').removeAttribute('name');
    const control = $('#control');
    control.setAttribute('aria-labelledby', 'tooltip');
  })
  .autoRegister('mdw-fab');
