import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Inline.css' assert { type: 'css' };

export default CustomElement
  .mixin(ThemableMixin)
  .extend()
  .css(styles)
  .html/* html */`<slot id=slot ink={ink} color={color} type-style={typeStyle}></slot>`
  .autoRegister('mdw-inline');
