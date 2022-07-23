import MDWButton from '../button/MDWButton.js';

export default class MDWChip extends MDWButton {
  constructor() {
    super();
    this.stylesElement.append(MDWChip.getStylesFragment().cloneNode(true));
    this.shadowRoot.prepend(MDWChip.getContentFragment().cloneNode(true));
    this.trailingIconElement = this.shadowRoot.querySelector('.mdw-chip__trailing-icon');
    /** @type {HTMLImageElement} */
    this.trailingImageElement = this.shadowRoot.querySelector('.mdw-chip__trailing-image');
    this.setAttribute('mdw-outlined', '');
  }

  static get observedAttributes() {
    return [...super.observedAttributes, 'mdw-trailing-icon', 'mdw-trailing-src'];
  }

  /**
   * @param {string} name
   * @param {string?} oldValue
   * @param {string?} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue == null && newValue == null) return;
    switch (name) {
      case 'mdw-trailing-icon':
        if (newValue) {
          this.trailingIconElement.textContent = newValue;
        }
        break;
      case 'mdw-trailing-src':
        if (newValue == null) {
          this.trailingImageElement.removeAttribute('src');
        } else {
          this.trailingImageElement.setAttribute('src', newValue);
        }
        break;
      default:
    }
  }

  static register(tagname = 'mdw-chip') {
    customElements.define(tagname, MDWChip);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWChip.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWChip.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWChip.css"]').href = new URL('MDWChip.css', import.meta.url).toString();
      MDWChip.#styles = template;
    }
    return MDWChip.#styles.content;
  }

  /** @type {HTMLTemplateElement} */
  static #content = null;

  /** @return {DocumentFragment} */
  static getContentFragment() {
    if (!MDWChip.#content) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <div class="mdw-chip__trailing-icon material-symbols-outlined" aria-hidden="true">
              <img class="mdw-chip__trailing-image" aria-hidden="true"/>
          </div>
        `,
      );
      template.content.appendChild(fragment);
      MDWChip.#content = template;
    }
    return MDWChip.#content.content;
  }
}
