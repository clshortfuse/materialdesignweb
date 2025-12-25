import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DensityMixin from '../mixins/DensityMixin.js';

import Box from './Box.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/**
 * Lists present a single column of related content, such as options or navigation.
 * @see https://m3.material.io/components/lists/specs
 */
export default Box
  .extend()
  .mixin(DensityMixin)
  .mixin(AriaReflectorMixin)
  .set({
    /** ARIA role applied to the host element (default: 'list'). */
    _ariaRole: 'list',

    /**
     * Visual color token for list surfaces. Default is `surface` to match
     * Material surface theming.
     */
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
