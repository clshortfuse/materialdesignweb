import MDWContainer from '../../core/container/MDWContainer.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside, but
 * space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, keep it next on the tab.
 */

export default class MDWCard extends MDWContainer {
  constructor() {
    super();
    this.stylesElement.append(MDWCard.getStylesFragment().cloneNode(true));
    this.shadowRoot.prepend(MDWCard.getContentFragment().cloneNode(true));
    this.stylesElement = this.shadowRoot.querySelector('.mdw-container__styles');
  }

  static register(tagname = 'mdw-card') {
    customElements.define(tagname, MDWCard);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWCard.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWCard.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWCard.css"]').href = new URL('MDWCard.css', import.meta.url).toString();
      MDWCard.#styles = template;
    }
    return MDWCard.#styles.content;
  }

  /** @type {HTMLTemplateElement} */
  static #content = null;

  /** @return {DocumentFragment} */
  static getContentFragment() {
    if (!MDWCard.#content) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <slot class=mdw-card__primary-action name=primary-action></slot>
          <div class=mdw-card__outline></div>
        `,
      );
      template.content.appendChild(fragment);
      MDWCard.#content = template;
    }
    return MDWCard.#content.content;
  }
}
