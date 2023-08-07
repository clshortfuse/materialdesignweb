import CustomElement from '../core/CustomElement.js';
import ElevationMixin from '../mixins/ElevationMixin.js';
import PopupMixin from '../mixins/PopupMixin.js';
import ShapeMixin from '../mixins/ShapeMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .mixin(ElevationMixin)
  .mixin(ShapeMixin)
  .mixin(PopupMixin)
  .autoRegister('mdw-popup');
