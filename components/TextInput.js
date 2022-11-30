import InputMixin from '../mixins/InputMixin.js';
import TextFieldMixin from '../mixins/TextFieldMixin.js';

import Container from './Container.js';

/** @implements {HTMLInputElement} */
export default class TextInput extends TextFieldMixin(InputMixin(Container)) {
  static { this.autoRegister(); }

  static elementName = 'mdw-text-input';

  compose() {
    const composition = super.compose();
    composition.template.getElementById('slot').remove();
    return composition;
  }
}
