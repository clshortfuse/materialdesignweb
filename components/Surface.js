import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Surface.css' assert {type:'css'};

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .css(styles)
  .on({
    composed() {
      const { surface, shape, surfaceTint } = this.refs;
      shape.append(surfaceTint);
      surface.append(shape);
    },
  })
  .html/* html */`<slot id=slot></slot>`
  .autoRegister('mdw-surface');
