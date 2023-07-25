import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';

import Surface from './Surface.js';

/* https://m3.material.io/components/tooltips/specs */

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
  })
  .css`
    :host {
      --mdw-shape__size: var(--mdw-shape__extra-small);
      --mdw-ink: var(--mdw-color__inverse-on-surface);
      --mdw-bg: var(--mdw-color__inverse-surface);
      display: block;

      box-sizing: border-box;

      /* Ensure 24px min-height while keeping display:block */
      padding-block: calc(12px - var(--mdw-typescale__body-small__line-height) / 2);
      padding-inline: 8px;

      pointer-events: none;

      opacity: 0;
      transform: scale(0);
      z-index: 28;

      font: var(--mdw-typescale__body-small__font);
      letter-spacing: var(--mdw-typescale__body-small__letter-spacing);

      transition: transform 200ms, opacity 200ms;
    }

    @supports(width: 1lh) {
      :host {
        padding-block: calc(12px - 0.5lh);
      }
    }

    :host([open]) {
      opacity: 1;
      transform: scale(1);
    }
  `
  .autoRegister('mdw-tooltip');
