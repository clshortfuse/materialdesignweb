import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import KeyboardNav from '../mixins/KeyboardNavMixin.js';

import Box from './Box.js';
import SegmentedButton from './SegmentedButton.js';

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

export default Box
  .mixin(KeyboardNav)
  .mixin(AriaReflectorMixin)
  .extend()
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
        // eslint-disable-next-line github/array-foreach
        this.kbdNavChildren.forEach((child, index, list) => {
        /** @type {InstanceType<SegmentedButton>} */
          (child).shapeStart = index === 0;
          /** @type {InstanceType<SegmentedButton>} */
          (child).innerSegmentedButton = index > 0 && index < list.length - 1;
          /** @type {InstanceType<SegmentedButton>} */
          (child).shapeEnd = index === list.length - 1;
        });
      },
    },
  })
  .css`
    /* https://m3.material.io/components/segmented-buttons/specs */

    :host {
      --mdw-bg: var(--mdw-color__secondary-container);
      --mdw-ink: var(--mdw-color__on-secondary-container);

      display: inline-flex;
    }

    :host([color]) {
      background-color: transparent;
    }

  `
  .on({
    constructed() {
      this.setAttribute('aria-orientation', 'horizontal');
    },
  })
  .autoRegister('mdw-segmented-button-group');
