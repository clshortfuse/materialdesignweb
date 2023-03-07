import DensityMixin from '../mixins/DensityMixin.js';

import Container from './Container.js';
import styles from './List.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

export default Container
  .mixin(DensityMixin)
  .extend()
  .css(styles)
  .set({
    ariaRole: 'list',
  })
  .autoRegister('mdw-list');
