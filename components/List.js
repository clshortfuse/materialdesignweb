import Container from './Container.js';
import styles from './List.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/** @implements {HTMLUListElement} */
export default class List extends Container {
  static { this.autoRegister('mdw-list'); }

  static ariaRole = 'list';

  compose() {
    return super.compose().append(styles);
  }
}
