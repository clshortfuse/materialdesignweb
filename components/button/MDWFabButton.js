import MDWExtendedFabButton from './MDWExtendedFabButton.js';

export default class MDWFabButton extends MDWExtendedFabButton {
  constructor() {
    super();
    this.stylesElement.append(MDWFabButton.getStylesFragment().cloneNode(true));
    this.setAttribute('mdw-icon', '');
    // Move slot into icon
    const slot = this.shadowRoot.querySelector('slot');
    slot.remove();
    this.iconElement.append(slot);
  }

  static register(tagname = 'mdw-fab-button') {
    customElements.define(tagname, MDWFabButton);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWFabButton.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWFabButton.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWFabButton.css"]').href = new URL('MDWFabButton.css', import.meta.url).toString();
      MDWFabButton.#styles = template;
    }
    return MDWFabButton.#styles.content;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
