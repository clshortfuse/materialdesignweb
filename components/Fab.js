import TooltipTriggerMixin from '../mixins/TooltipTriggerMixin.js';

import Button from './Button.js';

/**
 * Floating action buttons (FABs) help people take primary actions.
 * @see https://m3.material.io/components/floating-action-button/specs
 * @see https://m3.material.io/components/extended-fab/specs
 */
export default Button
  .extend()
  .mixin(TooltipTriggerMixin)
  .observe({
    /** When true, render the lowered FAB variant (reduced elevation). */
    lowered: 'boolean',
    /** When true, the FAB is extended and shows a text label. */
    extended: 'boolean',
    /** FAB size: `null` (default), 'small' or 'large'. */
    fabSize: {
      /** @type {null|'small'|'large'} */
      value: null,
    },
    /** Filled variant; default is 'tonal' when omitted. */
    filled: { empty: 'tonal' },
    /** Whether the FAB uses elevated styling. */
    elevated: { type: 'boolean', empty: true },
  })
  .observe({
    /** Whether to show the tooltip automatically (true when not extended). */
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
      visibility: inherit;

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
