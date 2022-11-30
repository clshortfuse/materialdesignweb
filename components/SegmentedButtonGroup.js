import KeyboardNav from '../mixins/KeyboardNavMixin.js';

import Container from './Container.js';
import SegmentedButton from './SegmentedButton.js';
import styles from './SegmentedButtonGroup.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class SegmentedButtonGroup extends KeyboardNav(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-segmented-button-group';

  static ariaRole = 'listbox';

  compose() {
    return super.compose().append(styles);
  }

  constructor() {
    super();
    this.setAttribute('aria-orientation', 'horizontal');
    this.refs.slot.addEventListener('slotchange', this.onSlotChange, { passive: true });
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  onSlotChange(event) {
    /** @type {{host:SegmentedButtonGroup}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    host.refreshTabIndexes();
  }

  get kbdNavQuery() { return SegmentedButton.elementName; }
}
