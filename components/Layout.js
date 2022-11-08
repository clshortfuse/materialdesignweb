import CustomElement from '../core/CustomElement.js';

import styles from './Layout.css' assert { type: 'css' };

export default class Layout extends CustomElement {
  static { this.autoRegister(); }

  static elementName = 'mdw-layout';

  static styles = [styles];

  static fragments = ['<slot></slot>'];
}
