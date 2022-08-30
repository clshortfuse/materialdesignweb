import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWDivider.css' assert { type: 'css' };

export default class MDWIcon extends MDWContainer {
  static elementName = 'mdw-divider';

  static styles = [...super.styles, styles];
}
