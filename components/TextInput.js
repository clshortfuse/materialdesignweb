import Input from './Input.js';
import { TextFieldMixin } from './TextFieldMixin.js';

/** @implements {HTMLInputElement} */
export default class TextInput extends TextFieldMixin(Input) {
  static { this.autoRegister(); }

  static elementName = 'mdw-textinput';
}
