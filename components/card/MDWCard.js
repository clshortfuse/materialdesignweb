import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWCard.css' assert { type: 'css' };

export default class MDWCard extends MDWContainer {
  static elementName = 'mdw-card';

  static ariaRole = 'figure';

  static styles = [...super.styles, styles];

  static fragments = [
    ...super.fragments,
    /* html */`
      <slot id=primary-action name=primary-action></slot>
      <div id=outline></div>
    `,
  ];
}
