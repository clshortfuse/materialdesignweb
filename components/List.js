import DensityMixin from '../mixins/DensityMixin.js';
import KeyboardNavMixin from '../mixins/KeyboardNavMixin.js';

import Box from './Box.js';

/**
 * Lists present a single column of related content, such as options or navigation.
 * @see https://m3.material.io/components/lists/specs
 */
export default Box
  .extend()
  .mixin(DensityMixin)
  .mixin(KeyboardNavMixin)
  .set({
    /** ARIA role applied to the host element (default: 'list'). */
    _ariaRole: 'list',

    /** Resolved list role used by specialized direct-list components. */
    _listRole: 'list',

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
  .childEvents({
    slot: {
      slotchange() {
        if (this.isConnected
          && this._kbdNavUsesDirectChildren
          && this._listRole === 'list') {
          this.refreshTabIndexes();
        }
      },
    },
  })
  .autoRegister('mdw-list');
