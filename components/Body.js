import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Body.css' assert { type: 'css' };
import Box from './Box.js';

export default Box
  .mixin(ThemableMixin)
  .extend()
  .css(styles)
  .autoRegister('mdw-body');
