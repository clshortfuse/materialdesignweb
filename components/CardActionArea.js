import styles from './CardActionArea.css' assert { type: 'css' };
import Container from './Container.js';

export default class CardActionArea extends Container {
  static { this.autoRegister(); }

  static elementName = 'mdw-card-action-area';

  static styles = [...super.styles, styles];
}
