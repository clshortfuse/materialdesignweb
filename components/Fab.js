import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import ExtendedFab from './ExtendedFab.js';
import styles from './Fab.css' assert { type: 'css' };

export default ExtendedFab
  .mixin(TooltipTriggerMixin)
  .extend()
  .observe({
    fabSize: {
      /** @type {null|'small'|'large'} */
      value: null,
    },
  })
  .css(styles)
  .on({
    composed() {
      const { slot, tooltipSlot, control, label, icon } = this.refs;
      slot.remove();
      tooltipSlot.removeAttribute('name');
      control.setAttribute('aria-labelledby', 'tooltip');
      label.setAttribute('fab-size', '{fabSize}');
      icon.setAttribute('fab-size', '{fabSize}');
    },
  })
  .autoRegister('mdw-fab');
