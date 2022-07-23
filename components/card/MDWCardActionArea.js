import MDWContainer from '../../core/container/MDWContainer.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside, but
 * space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, keep it next on the tab.
 */

export default class MDWCardActionArea extends MDWContainer {
  constructor() {
    super();
    this.stylesElement.append(MDWCardActionArea.getStylesFragment().cloneNode(true));
    this.stylesElement = this.shadowRoot.querySelector('.mdw-container__styles');
  }

  static register(tagname = 'mdw-card-action-area') {
    customElements.define(tagname, MDWCardActionArea);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWCardActionArea.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWCardActionArea.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWCardActionArea.css"]').href = new URL('MDWCardActionArea.css', import.meta.url).toString();
      MDWCardActionArea.#styles = template;
    }
    return MDWCardActionArea.#styles.content;
  }
}
