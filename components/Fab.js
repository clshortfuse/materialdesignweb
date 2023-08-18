import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';

export default Button
  .extend()
  .mixin(TooltipTriggerMixin)
  .observe({
    lowered: 'boolean',
    extended: 'boolean',
    fabSize: {
      /** @type {null|'small'|'large'} */
      value: null,
    },
    filled: { empty: 'tonal' },
    elevated: { type: 'boolean', empty: true },
  })
  .observe({
    autoTooltip({ extended }) {
      return !extended;
    },
  })
  .recompose(({ refs: { icon, slot } }) => {
    icon.setAttribute('fab-size', '{fabSize}');
    slot.setAttribute('extended', '{extended}');
    slot.setAttribute('icon', '{icon}');
  })
  .css`
    /* https://m3.material.io/components/extended-fab/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container-high);
      --mdw-ink: var(--mdw-color__primary);
      --mdw-shape__size: 16px;
      gap: 0;
      grid-area: fab;

      min-inline-size: 24px;
      padding: calc(16px + (var(--mdw-density) * 2px));

      background-color: rgb(var(--mdw-bg));

      box-shadow: var(--mdw-elevation__box-shadow__3);
      color: rgb(var(--mdw-ink));

      transition-duration: 200ms;

      transition-property: box-shadow, gap, min-inline-size;
    }

    :host(:where([extended])) {
      gap: 8px;

      min-inline-size: 48px;
    }

    #slot {
      display: inline-flex;
      align-items: center;

      min-block-size: 24px;

      visibility: hidden;

      color: transparent;

      font-size: 0;
      

      transition: color 200ms, font-size 200ms, visibility 200ms;
    }

    #slot[extended] {
      visibility: visible;

      color: inherit;

      font-size: inherit;

      transition: color 200ms, font-size 200ms, visibility 0ms;
    }

    :host([fab-size="small"]) {
      --mdw-shape__size: 12px;
      padding: calc(8px + (var(--mdw-density) * 2px));
    }

    :host([fab-size="large"]) {
      --mdw-shape__size: 28px;
      padding: calc(30px + (var(--mdw-density) * 2px));
    }

    
    #icon {
      font-size: 24px;
    }

    #icon[fab-size="large"] {
      font-size: 36px;
    }

    :host(:where([lowered])) {
      --mdw-bg: var(--mdw-color__surface-container-low);
      box-shadow: var(--mdw-elevation__box-shadow__1);
    }

    :host(:where(:hover:not(:active))) {
      box-shadow: var(--mdw-elevation__box-shadow__4);
    }

    :host(:where([lowered]:hover:not(:active))) {
      box-shadow: var(--mdw-elevation__box-shadow__2);
    }
  `
  .autoRegister('mdw-fab');
