import MDWButton from './MDWButton.js';

export default class MDWIconButton extends MDWButton {
  constructor() {
    super();
    this.stylesElement.append(MDWIconButton.getStylesFragment().cloneNode(true));
    this.setAttribute('mdw-icon', '');
    // Move slot into icon
    const slot = this.shadowRoot.querySelector('slot');
    slot.remove();
    this.iconElement.append(slot);
  }

  static register(tagname = 'mdw-icon-button') {
    customElements.define(tagname, MDWIconButton);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWIconButton.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWIconButton.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWIconButton.css"]').href = new URL('MDWIconButton.css', import.meta.url).toString();
      MDWIconButton.#styles = template;
    }
    return MDWIconButton.#styles.content;
  }
}
