import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import ExtendedFab from './ExtendedFab.js';

export default ExtendedFab
  .mixin(TooltipTriggerMixin)
  .extend()
  .observe({
    fabSize: {
      /** @type {null|'small'|'large'} */
      value: null,
    },
  })
  .css/* css */`
    /* https://m3.material.io/components/floating-action-button/specs */

    :host {
      min-inline-size: 24px;
    }

    #icon {
      font-size: 24px;
    }

    #icon[fab-size="large"] {
      font-size: 36px;
    }

    :host([fab-size="small"]) {
      --mdw-shape__size: 12px;
      padding: calc(8px + (var(--mdw-density) * 2px));
    }

    :host([fab-size="large"]) {
      --mdw-shape__size: 28px;
      padding: calc(30px + (var(--mdw-density) * 2px));
    }
  `
  .on({
    composed() {
      const { slot, tooltipSlot, control, shape, icon } = this.refs;
      slot.remove();
      tooltipSlot.removeAttribute('name');
      control.setAttribute('aria-labelledby', 'tooltip');
      shape.setAttribute('fab-size', '{fabSize}');
      icon.setAttribute('fab-size', '{fabSize}');
    },
  })
  .autoRegister('mdw-fab');
