import CustomElement from '../core/CustomElement.js';
import DensityMixin from '../mixins/DensityMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Badge.css' assert { type: 'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(DensityMixin)
  .mixin(ShapeMixin)
  .extend()
  .css(styles)
  .html/* html */`<slot id=slot></slot>`
  .autoRegister('mdw-badge');
