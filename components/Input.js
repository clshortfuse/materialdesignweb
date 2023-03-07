import CustomElement from '../core/CustomElement.js';
import InputMixin from '../mixins/InputMixin.js';
import StateMixin from '../mixins/StateMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

export default CustomElement
  .mixin(ThemableMixin)
  .mixin(StateMixin)
  .mixin(InputMixin)
  .mixin(TextFieldMixin)
  .extend()
  .autoRegister('mdw-input');
