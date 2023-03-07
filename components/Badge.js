import DensityMixin from '../mixins/DensityMixin.js';

import styles from './Badge.css' assert { type: 'css'};
import Shape from './Shape.js';

export default Shape
  .mixin(DensityMixin)
  .extend()
  .css(styles)
  .autoRegister('mdw-badge');
