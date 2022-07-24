import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWCard.css' assert { type: 'css' };

/**
 * Note: FAB does not exist inside because FABs can appear outside, but
 * space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, keep it next on the tab.
 */

export default class MDWCard extends MDWContainer {
  static elementName = 'mdw-card';

  static get styles() {
    return [...super.styles, styles];
  }

  static get fragments() {
    return [
      ...super.fragments,
      /* html */`
        <slot class=mdw-card__primary-action name=primary-action></slot>
        <div class=mdw-card__outline></div>
      `,
    ];
  }
}
