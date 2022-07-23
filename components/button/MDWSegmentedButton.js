import * as Attributes from '../../core/aria/attributes.js';
import * as RovingTabIndex from '../../core/aria/rovingtabindex.js';

import MDWButton from './MDWButton.js';

export default class MDWSegmentedButton extends MDWButton {
  constructor() {
    super();
    this.stylesElement.append(MDWSegmentedButton.getStylesFragment().cloneNode(true));
    this.setAttribute('mdw-outlined', '');
    this.setAttribute('mdw-overlay-disabled', 'focus');
  }

  static register(tagname = 'mdw-segmented-button') {
    customElements.define(tagname, MDWSegmentedButton);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWSegmentedButton.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWSegmentedButton.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWSegmentedButton.css"]').href = new URL('MDWSegmentedButton.css', import.meta.url).toString();
      MDWSegmentedButton.#styles = template;
    }
    return MDWSegmentedButton.#styles.content;
  }

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
