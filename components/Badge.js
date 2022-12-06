import styles from './Badge.css' assert { type: 'css'};
import Container from './Container.js';

export default class Badge extends Container {
  static { this.autoRegister('mdw-badge'); }

  compose() {
    return super.compose().append(
      styles,
    );
  }
}
