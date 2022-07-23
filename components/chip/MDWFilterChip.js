import * as AriaCheckbox from '../../core/aria/checkbox.js';

import MDWChip from './MDWChip.js';

export default class MDWFilterChip extends MDWChip {
  constructor() {
    super();
    this.stylesElement.append(MDWFilterChip.getStylesFragment().cloneNode(true));
    this.trailingIconElement = this.shadowRoot.querySelector('.mdw-chip__trailing-icon');
    /** @type {HTMLImageElement} */
    this.trailingImageElement = this.shadowRoot.querySelector('.mdw-chip__trailing-image');
    if (!this.hasAttribute('mdw-icon')) {
      this.setAttribute('mdw-icon', 'check');
      super.attributeChangedCallback('mdw-icon', null, 'check');
    }
  }

  static register(tagname = 'mdw-filter-chip') {
    customElements.define(tagname, MDWFilterChip);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWFilterChip.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWFilterChip.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWFilterChip.css"]').href = new URL('MDWFilterChip.css', import.meta.url).toString();
      MDWFilterChip.#styles = template;
    }
    return MDWFilterChip.#styles.content;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.getAttribute('role') === 'checkbox') {
      AriaCheckbox.attach(this);
    }
  }

  disconnectedCallback() {
    AriaCheckbox.detach(this);
    super.disconnectedCallback();
  }
}
