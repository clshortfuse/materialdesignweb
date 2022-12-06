import styles from './CardActionArea.css' assert { type: 'css' };
import Container from './Container.js';

/** @implements {Container} */
export default class CardActionArea extends Container {
  static { this.autoRegister('mdw-card-action-area'); }

  /** @type {Container['compose']} */
  compose() {
    return super.compose().append(
      styles,
    );
  }
}
