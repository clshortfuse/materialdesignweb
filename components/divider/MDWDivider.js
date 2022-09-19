import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWDivider.css' assert { type: 'css' };

export default class MDWDivider extends MDWContainer {
  static elementName = 'mdw-divider';

  static styles = [...super.styles, styles];
}
