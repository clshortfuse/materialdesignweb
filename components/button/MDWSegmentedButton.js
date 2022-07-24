import * as Attributes from '../../core/aria/attributes.js';
import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';

import MDWButton from './MDWButton.js';
import styles from './MDWSegmentedButton.css' assert { type: 'css' };

export default class MDWSegmentedButton extends MDWButton {
  constructor() {
    super();
    this.setAttribute('mdw-outlined', '');
    this.setAttribute('mdw-overlay-disabled', 'focus');
  }

  static elementName = 'mdw-segmented-button';

  static get styles() { return [...super.styles, styles]; }

  /**
   * Remap Space and Enter as Click
   * @param {KeyboardEvent} event
   * @return {void}
   */
  static onKeyDown(event) {
    if (event.key !== 'Spacebar' && event.key !== ' ') {
      return;
    }
    const element = /** @type {MDWSegmentedButton} */ (event.currentTarget);
    if (!element) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const newEvent = document.createEvent('Event');
    newEvent.initEvent('click', true, true);
    element.dispatchEvent(newEvent);
  }

  /**
   * @param {MouseEvent} event
   * @return {void}
   */
  static onClick(event) {
    super.onClick(event);
    const element = /** @type {MDWSegmentedButton} */ (event.currentTarget);
    if (element.getAttribute('aria-disabled') === 'true') {
      return;
    }
    const ariaChecked = element.getAttribute('aria-checked');
    if (ariaChecked === 'true') {
      Attributes.setChecked(element, 'false', Attributes.ARIA_CHECKED_EVENT);
    } else if (ariaChecked != null) {
      Attributes.setChecked(element, 'true', Attributes.ARIA_CHECKED_EVENT);
    } else if (element.getAttribute('aria-selected') === 'true') {
      Attributes.setSelected(element, 'false', Attributes.ARIA_SELECTED_EVENT);
    } else {
      Attributes.setSelected(element, 'true', Attributes.ARIA_SELECTED_EVENT);
    }
  }

  connectedCallback() {
    this.setAttribute('role', 'option');
    RovingTabIndex.attach(this);
    this.addEventListener('click', MDWSegmentedButton.onClick);
    this.addEventListener('keydown', MDWSegmentedButton.onKeyDown);
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    RovingTabIndex.detach(this);
    this.removeEventListener('click', MDWSegmentedButton.onClick);
    this.removeEventListener('keydown', MDWSegmentedButton.onKeyDown);
  }
}
