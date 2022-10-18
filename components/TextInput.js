import Input from './Input.js';
import { TextFieldMixin } from './TextFieldMixin.js';

/** @implements {HTMLInputElement} */
export default class TextInput extends TextFieldMixin(Input) {
  static elementName = 'mdw-textinput';
}
