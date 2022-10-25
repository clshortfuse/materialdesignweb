import Container from './Container.js';
import styles from './List.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/** @implements {HTMLUListElement} */
export default class List extends Container {
  static elementName = 'mdw-list';

  static ariaRole = 'list';

  static styles = [...super.styles, styles];
}
