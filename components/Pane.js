import ShapeMixin from '../mixins/ShapeMixin.js';

import Box from './Box.js';

/**
 * Pane is a layout surface used within `mdw-page` to provide shaped,
 * padded content columns for app content. It is intended to be placed
 * as a child of `mdw-page` to create consistent, shaped panes with the
 * same padding and background surface used across the layout system.
 * @see https://m3.material.io/foundations/layout/applying-layout/window-size-classes
 */
export default Box
  .extend()
  .mixin(ShapeMixin)
  .css`
    :host {
      --mdw-shape__size: var(--mdw-pane__shape__size, 0);
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));

      overflow: auto;
    }
  `
  .autoRegister('mdw-pane');
