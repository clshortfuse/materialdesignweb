import * as AriaToolbar from '../aria/toolbar.js';

import styles from './BottomAppBar.css' assert { type: 'css' };
import Container from './Container.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */
/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class BottomAppBar extends Container {
  static ariaRole = 'toolbar';

  static elementName = 'mdw-bottom-app-bar';

  static styles = [...super.styles, styles];

  connectedCallback() {
    AriaToolbar.attach(this);
  }

  disconnectedCallback() {
    AriaToolbar.detach(this);
  }
}
