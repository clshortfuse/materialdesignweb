import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DensityMixin from '../mixins/DensityMixin.js';

import Box from './Box.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

export default Box
  .extend()
  .mixin(DensityMixin)
  .mixin(AriaReflectorMixin)
  .set({
    _ariaRole: 'list',
    color: { empty: 'surface' },
  })
  .css`
    /* https://m3.material.io/components/lists/specs */

    :host {
      display: block;

      padding-block: 8px;

      color: rgb(var(--mdw-ink));
    }

  `
  .autoRegister('mdw-list');
