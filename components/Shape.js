import CustomElement from '../core/CustomElement.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(ShapeMixin)
  .css/* css */`
    :host {
      position: relative;
    }
    #shape[color] {
      background-color: rgb(var(--mdw-bg));
    }
    :host(:where([ink],[color])) {
      color: rgb(var(--mdw-ink));
    }
  `
  .html/* html */`<slot id=slot></slot>`
  .autoRegister('mdw-shape');
