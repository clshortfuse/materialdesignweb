import Container from './Container.js';
import styles from './List.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/** @implements {HTMLUListElement} */
export default class List extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-list';

  static ariaRole = 'list';

  /** @type {Container['compose']} */
  compose(...parts) {
    return super.compose(
      styles,
      ...parts,
    );
  }
}
