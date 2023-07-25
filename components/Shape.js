import CustomElement from '../core/CustomElement.js';
import ShapeMaskedMixin from '../mixins/ShapeMaskedMixin.js';

export default CustomElement
  .extend()
  .mixin(ShapeMaskedMixin)
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-shape');
