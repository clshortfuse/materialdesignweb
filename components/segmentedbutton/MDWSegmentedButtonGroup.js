import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';
import MDWContainer from '../../core/container/MDWContainer.js';

import MDWSegmentedButton from './MDWSegmentedButton.js';
import styles from './MDWSegmentedButtonGroup.css' assert { type: 'css' };

/** @implements {HTMLMenuElement} */
export default class MDWSegmentedButtonGroup extends MDWContainer {
  static ariaRole = 'listbox';

  constructor() {
    super();
    this.setAttribute('aria-orientation', 'horizontal');
    this.slotElement.addEventListener('slotchange', MDWSegmentedButtonGroup.onSlotChanged, { passive: true });
  }

  /**
   * @param {Event} event
   * @this {HTMLSlotElement}
   * @return {void}
   */
  static onSlotChanged(event) {
    /** @type {{host:MDWSegmentedButtonGroup}} */ // @ts-ignore Coerce
    const { host } = this.getRootNode();
    console.log('slotchanged', this, host.childSegmentedButtons);
    RovingTabIndex.setupTabIndexes(host.childSegmentedButtons, true);
  }

  static elementName = 'mdw-segmented-button-group';

  static styles = [...super.styles, styles];

  /**
   * @param {KeyboardEvent} event
   * @this {MDWSegmentedButtonGroup}
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

    this.ariaActiveDescendantElement = selectNext
      ? RovingTabIndex.selectNext(this.childSegmentedButtons)
      : RovingTabIndex.selectPrevious(this.childSegmentedButtons);
  }

  /** @return {NodeListOf<MDWSegmentedButton>} */
  get childSegmentedButtons() {
    return this.querySelectorAll(MDWSegmentedButton.elementName);
  }

  /**
   * @param {Event} event
   * @this {MDWSegmentedButtonGroup}
   * @return {void}
   */
  static onTabIndexZeroed(event) {
    event.stopPropagation();
    const currentItem = /** @type {HTMLElement} */ (event.target);
    RovingTabIndex.removeTabIndex(this.childSegmentedButtons, [currentItem]);
  }

  connectedCallback() {
    this.addEventListener('keydown', MDWSegmentedButtonGroup.onKeyDownEvent);
    this.addEventListener(RovingTabIndex.TABINDEX_ZEROED, MDWSegmentedButtonGroup.onTabIndexZeroed);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', MDWSegmentedButtonGroup.onKeyDownEvent);
    this.removeEventListener(RovingTabIndex.TABINDEX_ZEROED, MDWSegmentedButtonGroup.onTabIndexZeroed);
  }
}
