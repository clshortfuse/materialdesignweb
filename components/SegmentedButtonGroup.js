import * as RovingTabIndex from '../aria/rovingtabindex.js';

import Container from './Container.js';
import SegmentedButton from './SegmentedButton.js';
import styles from './SegmentedButtonGroup.css' assert { type: 'css' };

/** @typedef {'compact'} DeprecatedHTMLMenuElementProperties */

/** @implements {Omit<HTMLMenuElement,DeprecatedHTMLMenuElementProperties>} */
export default class SegmentedButtonGroup extends Container {
  static ariaRole = 'listbox';

  constructor() {
    super();
    this.setAttribute('aria-orientation', 'horizontal');
    this.slotElement.addEventListener('slotchange', SegmentedButtonGroup.onSlotChanged, { passive: true });
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChanged(event) {
    /** @type {{host:SegmentedButtonGroup}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    RovingTabIndex.setupTabIndexes(host.childSegmentedButtons, true);
  }

  static elementName = 'mdw-segmented-button-group';

  static styles = [...super.styles, styles];

  /**
   * @param {KeyboardEvent} event
   * @this {SegmentedButtonGroup}
   * @return {void}
   */
  static onKeyDownEvent(event) {
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
      ? RovingTabIndex.selectNext(this.childSegmentedButtons)
      : RovingTabIndex.selectPrevious(this.childSegmentedButtons);
  }

  /** @return {NodeListOf<SegmentedButton>} */
  get childSegmentedButtons() {
    return this.querySelectorAll(SegmentedButton.elementName);
  }

  /**
   * @param {Event} event
   * @this {SegmentedButtonGroup}
   * @return {void}
   */
  static onTabIndexZeroed(event) {
    event.stopPropagation();
    const currentItem = /** @type {HTMLElement} */ (event.target);
    RovingTabIndex.removeTabIndex(this.childSegmentedButtons, [currentItem]);
  }

  connectedCallback() {
    this.addEventListener('keydown', SegmentedButtonGroup.onKeyDownEvent);
    this.addEventListener(RovingTabIndex.TABINDEX_ZEROED, SegmentedButtonGroup.onTabIndexZeroed);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', SegmentedButtonGroup.onKeyDownEvent);
    this.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, SegmentedButtonGroup.onTabIndexZeroed);
  }
}
