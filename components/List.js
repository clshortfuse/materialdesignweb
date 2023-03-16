import AriaReflectorMixin from '../mixins/AriaReflectorMixin.js';
import DensityMixin from '../mixins/DensityMixin.js';

import Box from './Box.js';
import styles from './List.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

export default Box
  .mixin(DensityMixin)
  .mixin(AriaReflectorMixin)
  .extend()
  .css(styles)
  .set({
    _ariaRole: 'list',
  })
  .autoRegister('mdw-list');
