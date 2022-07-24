import * as AriaListbox from '../../core/aria/listbox.js';
import MDWContainer from '../../core/container/MDWContainer.js';

import styles from './MDWSegmentedButtonGroup.css' assert { type: 'css' };

export default class MDWSegmentedButtonGroup extends MDWContainer {
  static elementName = 'mdw-segmented-button-group';

  static get styles() { return [...super.styles, styles]; }

  connectedCallback() {
    this.setAttribute('aria-orientation', 'horizontal');
    AriaListbox.attach(this);
  }

  disconnectedCallback() {
    AriaListbox.detach(this);
  }
}
