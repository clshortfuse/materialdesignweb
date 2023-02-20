import KeyboardNav from '../mixins/KeyboardNavMixin.js';

import Container from './Container.js';
import SegmentedButton from './SegmentedButton.js';
import styles from './SegmentedButtonGroup.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

export default Container
  .mixin(KeyboardNav)
  .extend()
  .define({
    kbdNavQuery() {
      return SegmentedButton.elementName;
    },
  })
  .set({
    ariaRole: 'listbox',
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
  .css(styles)
  .on({
    constructed() {
      this.setAttribute('aria-orientation', 'horizontal');
    },
  })
  .autoRegister('mdw-segmented-button-group');
