import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .css/* css */`
    #shape {
      display: block;
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }
  `
  .html/* html */`<slot id=slot ink={ink} color={color} type-style={typeStyle}></slot>`
  .autoRegister('mdw-shape');
