import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';

import Surface from './Surface.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

export default Surface
  .extend()
  .mixin(AriaToolbarMixin)
  .observe({
    color: { empty: 'surface-container' },
  })
  .css`
    /* https://m3.material.io/components/bottom-app-bar/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);

      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-start;

      box-sizing: content-box;
      /* Don't apply density */
      block-size: 56px;
      padding-block: 12px;
      padding-inline: 8px 16px;

      box-shadow: none;

      direction: ltr;
    }
  `
  .autoRegister('mdw-bottom-app-bar');
