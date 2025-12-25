import KeyboardNav from '../mixins/KeyboardNavMixin.js';

import Box from './Box.js';
import SegmentedButton from './SegmentedButton.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/**
 * A segmented button group arranges multiple `mdw-segmented-button` items
 * so they behave as a related set of choices or toggles.
 * @see https://m3.material.io/components/segmented-buttons/specs
 */
export default Box
  .extend()
  .mixin(KeyboardNav)
  .define({
    kbdNavQuery() {
      return SegmentedButton.elementName;
    },
  })
  .set({
    _ariaRole: 'listbox',
  })
  .childEvents({
    slot: {
      slotchange: 'refreshTabIndexes',
    },
  })
  .css`
    /* https://m3.material.io/components/segmented-buttons/specs */

    :host {
      --mdw-bg: var(--mdw-color__secondary-container);
      --mdw-ink: var(--mdw-color__on-secondary-container);

      display: inline-flex;
      align-items: stretch;
      flex-direction: row;
      justify-content: initial;
      overflow-x: auto;
      overflow-y: hidden;

      box-sizing: border-box;
      min-inline-size: 100%;
      flex: none;
    }

    :host([color]) {
      background-color: transparent;
    }

    #slot {
      display: grid;
      grid-auto-columns: 1fr;
      grid-auto-flow: column;

      flex: none;
    }

  `
  .on({
    constructed() {
      this.updateAriaProperty('ariaOrientation', 'horizontal');
    },
  })
  .autoRegister('mdw-segmented-button-group');
