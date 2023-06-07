import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

import Surface from './Surface.js';

export default Surface
  .extend()
  .mixin(AriaReflectorMixin)
  .set({
    _ariaRole: 'tooltip',
  })
  .observe({
    open: {
      type: 'boolean',
      changedCallback(oldValue, newValue) {
        this.updateAriaProperty('ariaHidden', newValue ? 'true' : 'false');
      },
    },
    touch: 'boolean',
  })
  .css`
    /* https://m2.material.io/components/tooltips */

    :host {
      --mdw-shape__size: var(--mdw-shape__extra-small);
      --mdw-ink: var(--mdw-color__on-surface-variant);
      --mdw-shape__bg: rgb(var(--mdw-color__surface-container));
      display: block;
      vertical-align: middle;

      box-sizing: border-box;
      /* stylelint-disable-next-line declaration-property-value-disallowed-list */
      margin-inline: auto;
      padding-block: 4px;
      padding-inline: 8px;

      pointer-events: none;

      opacity: 0;
      transform: scale(0);
      z-index: 24;

      font: var(--mdw-typescale__label-medium__font);
      letter-spacing: var(--mdw-typescale__label-medium__letter-spacing);

      transition: transform 200ms, opacity 200ms;

    }

    :host([touch]) {
      padding-block: 6px;
      padding-inline: 16px;

      font: var(--mdw-typescale__label-large__font);
      letter-spacing: var(--mdw-typescale__label-large__letter-spacing);
    }

    :host([open]) {
      opacity: 1;
      transform: scale(1);
    }
  `
  .autoRegister('mdw-tooltip');
