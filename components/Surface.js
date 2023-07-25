import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .html`<slot id=slot></slot>`
  .css`
    :host {
      --mdw-bg: var(--mdw-color__surface);
      --mdw-ink: var(--mdw-color__on-surface);
      position: relative;
    
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    
      font: var(--mdw-type__font);
      letter-spacing: var(--mdw-type__letter-spacing);
    }  
  `
  .autoRegister('mdw-surface');
