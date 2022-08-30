import * as AriaToolbar from '../../core/aria/toolbar.js';
import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWBottomAppBar.css' assert { type: 'css' };

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

/** @implements {HTMLMenuElement} */
export default class MDWBottomAppBar extends MDWContainer {
  static elementName = 'mdw-bottom-app-bar';

  static styles = [...super.styles, styles];

  connectedCallback() {
    AriaToolbar.attach(this);
  }

  disconnectedCallback() {
    AriaToolbar.detach(this);
  }
}
