import CustomElement from '../core/CustomElement.js';
import ShapeMaskedMixin from '../mixins/ShapeMaskedMixin.js';

/**
 * Shape applies shape tokens (corner radius) to elements and surfaces.
 * @see https://m3.material.io/styles/shape/overview-principles
 */
export default CustomElement
  .extend()
  .mixin(ShapeMaskedMixin)
  .html`<slot id=slot></slot>`
  .autoRegister('mdw-shape');
