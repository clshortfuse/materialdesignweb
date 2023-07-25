import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import ExtendedFab from './ExtendedFab.js';

export default ExtendedFab
  .extend()
  .mixin(TooltipTriggerMixin)
  .observe({
    fabSize: {
      /** @type {null|'small'|'large'} */
      value: null,
    },
  })
  .css`
    /* https://m3.material.io/components/floating-action-button/specs */

    :host {
      min-inline-size: 24px;

      font-size: 24px;
    }

    #icon {
      font-size: inherit;
    }

    :host([fab-size="large"]) {
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
  .recompose(({ refs: { slot, tooltipSlot, control } }) => {
    slot.remove();
    tooltipSlot.removeAttribute('name');
    control.setAttribute('aria-labelledby', 'tooltip');
  })
  .autoRegister('mdw-fab');
