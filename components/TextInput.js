import Input from './Input.js';
import { TextFieldMixin } from './TextFieldMixin.js';

/** @implements {HTMLInputElement} */
export default class TextInput extends TextFieldMixin(Input) {
  static { this.autoRegister(); }

  static elementName = 'mdw-text-input';

  static get template() {
    const template = super.template;
    template.getElementById('slot').remove();
    return template;
  }
}
