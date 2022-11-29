import styles from './Card.css' assert { type: 'css' };
import Container from './Container.js';

export default class Card extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-card';

  static ariaRole = 'figure';

  /** @type {Container['compose']} */
  compose(...parts) {
    return super.compose(
      styles,
      '<slot id=primary-action name=primary-action></slot>',
      '<div id=outline></div>',
      ...parts,
    );
  }
}
