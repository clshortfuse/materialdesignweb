import ShapeMixin from '../mixins/ShapeMixin.js';

import Grid from './Grid.js';

export default Grid
  .extend()
  .mixin(ShapeMixin)
  .css`
    :host {
      --mdw-shape__size: var(--mdw-pane__shape__size, 0);
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
      
    }
  `
  .autoRegister('mdw-pane');
