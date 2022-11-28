import RovingTabIndexedMixin from '../mixins/RovingTaxIndexedMixin.js';

import Container from './Container.js';
import SegmentedButton from './SegmentedButton.js';
import styles from './SegmentedButtonGroup.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class SegmentedButtonGroup extends RovingTabIndexedMixin(Container) {
  static { this.autoRegister(); }

  static elementName = 'mdw-segmented-button-group';

  static ariaRole = 'listbox';

  static styles = [...super.styles, styles];

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

  /**
   * @param {KeyboardEvent} event
   * @this {SegmentedButtonGroup}
   * @return {void}
   */
  onKeyDownEvent(event) {
    if (event.ctrlKey) return;
    if (event.shiftKey) return;
    if (event.altKey) return;
    if (event.metaKey) return;
    let selectNext;
    switch (event.key) {
      case 'ArrowLeft':
      case 'Left':
        selectNext = false;
        break;
      case 'ArrowRight':
      case 'Right':
        selectNext = true;
        break;
      case 'ArrowUp':
      case 'Up':
      case 'ArrowDown':
      case 'Down':
        // Firefox triggers selection with vertical direction input
        break;
      default:
        return;
    }

    // Firefox auto checks radio buttons on directional key
    event.preventDefault();

    if (selectNext == null) return;
    if (getComputedStyle(this).direction === 'rtl') {
      selectNext = !selectNext;
    }

    // @ts-ignore ARIA 1.3
    this.ariaActiveDescendantElement = selectNext
      ? this.rtiFocusNext()
      : this.rtiFocusPrevious();
  }

  get rtiQuery() { return SegmentedButton.elementName; }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.onKeyDownEvent);
  }
}
