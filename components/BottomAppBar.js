import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';

import Surface from './Surface.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

/**
 * BottomAppBar component that extends Surface and mixes in AriaToolbarMixin.
 * It observes color properties and applies specific CSS styles.
 * (deprecated) - The original bottom app bar is no longer recommended. It should be replaced with the docked toolbar, which is very similar and more flexible.
 * @see https://m3.material.io/components/bottom-app-bar/specs
 */
export default Surface
  .extend()
  .mixin(AriaToolbarMixin)
  .observe({
    color: { empty: 'surface-container' },
  })
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface-container);
      --mdw-ink: var(--mdw-color__on-surface);
      align-items: center;
      flex-direction: row;
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
