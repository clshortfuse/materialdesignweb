import * as AriaListbox from '../../core/aria/listbox.js';
import MDWContainer from '../../core/container/MDWContainer.js';

export default class MDWSegmentedButtonGroup extends MDWContainer {
  constructor() {
    super();
    this.stylesElement.append(MDWSegmentedButtonGroup.getStylesFragment().cloneNode(true));
  }

  static register(tagname = 'mdw-segmented-button-group') {
    customElements.define(tagname, MDWSegmentedButtonGroup);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWSegmentedButtonGroup.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWSegmentedButtonGroup.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWSegmentedButtonGroup.css"]').href = new URL('MDWSegmentedButtonGroup.css', import.meta.url).toString();
      MDWSegmentedButtonGroup.#styles = template;
    }
    return MDWSegmentedButtonGroup.#styles.content;
  }

  connectedCallback() {
    this.setAttribute('aria-orientation', 'horizontal');
    AriaListbox.attach(this);
  }

  disconnectedCallback() {
    AriaListbox.detach(this);
  }
}
