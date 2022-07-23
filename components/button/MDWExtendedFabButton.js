import MDWButton from './MDWButton.js';

export default class MDWExtendedFabButton extends MDWButton {
  constructor() {
    super();
    this.stylesElement.append(MDWExtendedFabButton.getStylesFragment().cloneNode(true));
  }

  static register(tagname = 'mdw-extended-fab-button') {
    customElements.define(tagname, MDWExtendedFabButton);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWExtendedFabButton.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWExtendedFabButton.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWExtendedFabButton.css"]').href = new URL('MDWExtendedFabButton.css', import.meta.url).toString();
      MDWExtendedFabButton.#styles = template;
    }
    return MDWExtendedFabButton.#styles.content;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
