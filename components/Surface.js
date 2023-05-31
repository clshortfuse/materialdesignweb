import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .html`<slot id=slot></slot>`
  .on({
    composed() {
      const { surface, shape } = this.refs;
      surface.append(shape);
    },
  })
  .css`
    :host {
      --mdw-shape__bg: rgb(var(--mdw-color__surface));
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;
    
      color: rgb(var(--mdw-ink));
    
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }  
  `
  .autoRegister('mdw-surface');
