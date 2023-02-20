import Block from '../layout/Block.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';

export default Block
  .mixin(SurfaceMixin)
  .css/* css */`
    #shape {
      display: block;
      background-color: rgb(var(--mdw-bg));
      color: rgb(var(--mdw-ink));
    }
  `
  .autoRegister('mdw-surface');
