import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DensityMixin from '../mixins/DensityMixin.js';

import Box from './Box.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

export default Box
  .mixin(DensityMixin)
  .mixin(AriaReflectorMixin)
  .extend()
  .set({
    _ariaRole: 'list',
    color: { empty: 'surface' },
  })
  .css/* css */`
    /* https://m3.material.io/components/lists/specs */

    :host {
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      display: flex;
      flex-direction: column;

      padding-block: 8px;

      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }

  `
  .autoRegister('mdw-list');
