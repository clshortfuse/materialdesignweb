import KeyboardNav from '../mixins/KeyboardNavMixin.js';

import Box from './Box.js';
import SegmentedButton from './SegmentedButton.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

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
      slotchange() {
        this.refreshTabIndexes();
        const list = /** @type {NodeListOf<InstanceType<SegmentedButton>>} */ (this.kbdNavChildren);
        for (const [index, child] of list.entries()) {
          child.shapeStart = index === 0;
          child.innerSegmentedButton = index > 0 && index < list.length - 1;
          child.shapeEnd = index === list.length - 1;
        }
      },
    },
  })
  .css`
    /* https://m3.material.io/components/segmented-buttons/specs */

    :host {
      --mdw-bg: var(--mdw-color__secondary-container);
      --mdw-ink: var(--mdw-color__on-secondary-container);

      display: inline-flex;
      overflow-x: auto;
      overflow-y: hidden;
    }

    :host([color]) {
      background-color: transparent;
    }

    #slot {
      display: grid;
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
