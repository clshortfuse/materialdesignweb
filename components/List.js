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
  })
  .css`
    /* https://m3.material.io/components/lists/specs */

    :host {
      display: flex;
      flex-direction: column;

      padding-block: 8px;
    }

  `
  .autoRegister('mdw-list');
