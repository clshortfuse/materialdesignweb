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
  .events('#slot', {
    slotchange() {
      const { host } = this.getRootNode();
      host.refreshTabIndexes();
    },
  })
  .css(styles)
  .on({
    constructed() {
      this.setAttribute('aria-orientation', 'horizontal');
    },
  })
  .autoRegister('mdw-segmented-button-group');
