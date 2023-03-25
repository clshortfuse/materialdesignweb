import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import AriaToolbarMixin from '../mixins/AriaToolbarMixin.js';

import Surface from './Surface.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

export default Surface
  .mixin(AriaToolbarMixin)
  .mixin(AriaReflectorMixin)
  .extend()
  .set({
    elevated: true,
    _ariaRole: 'toolbar',
  })
  .observe({
    color: { empty: 'surface' },
  })
  .css`
    /* https://m3.material.io/components/bottom-app-bar/specs */

    :host {
      --mdw-surface__tint: var(--mdw-surface__tint__2);
      --mdw-surface__tint__raised: var(--mdw-surface__tint__2);
      --mdw-bg: var(--mdw-color__surface);
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
