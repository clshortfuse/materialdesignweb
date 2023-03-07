import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .css/* css */`
    #surface {
      display: flex;
      box-sizing: border-box;
      max-block-size: 100%;
      max-inline-size: 100%;
    }
    #shape {
      flex: 1;
      display: block;
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }
  `
  .html/* html */`<slot id=slot ink={ink} color={color} type-style={typeStyle}></slot>`
  .on({
    composed() {
      const { outline, surfaceTint } = this.refs;
      outline.before(surfaceTint);
    },
  })
  .autoRegister('mdw-surface');
