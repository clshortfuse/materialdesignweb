import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWCardActionArea.css' assert { type: 'css' };

export default class MDWCardActionArea extends MDWContainer {
  static elementName = 'mdw-card-action-area';

  static get styles() {
    return [...super.styles, styles];
  }
}
