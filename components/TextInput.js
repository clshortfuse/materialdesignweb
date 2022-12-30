import InputMixin from '../mixins/InputMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';

import Container from './Container.js';

export default Container
  .mixin(InputMixin)
  .mixin(TextFieldMixin)
  .extend()
  .on('composed', ({ $ }) => $('#slot').remove())
  .autoRegister('mdw-text-input');
