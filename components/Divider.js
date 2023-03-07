import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Divider.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .observe({
    vertical: 'boolean',
  })
  .css(styles)
  .autoRegister('mdw-divider');
