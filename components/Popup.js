import CustomElement from '../core/CustomElement.js';
import PopupMixin from '../mixins/PopupMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import SurfaceMixin from '../mixins/SurfaceMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(SurfaceMixin)
  .mixin(ShapeMixin)
  .mixin(PopupMixin)
  .on({
    composed() {
      const { shape, surface, dialog } = this.refs;
      surface.append(shape);
      dialog.prepend(surface);
    },
  })
  .autoRegister('mdw-popup');
