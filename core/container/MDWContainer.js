export default class MDWContainer extends HTMLElement {
  constructor() {
    super();
    const { content } = MDWContainer.getTemplate();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.prepend(content.cloneNode(true));
    this.stylesElement = shadowRoot.querySelector('.mdw-container__styles');
  }

  /** @type {HTMLTemplateElement} */
  static #template = null;

  /** @return {HTMLTemplateElement} */
  static getTemplate() {
    if (!MDWContainer.#template) {
      let template = /** @type {HTMLTemplateElement} */ (document.getElementById('mdw-container-template'));
      if (!template) {
        template = document.createElement('template');
        const fragment = document.createRange().createContextualFragment(
          /* html */`
            <div class="mdw-container__styles">
              <link rel="stylesheet" href="MDWContainer.css"/>
            </div>
            <div class="mdw-container__elevation" part="elevation" role="presentation"></div>  
            <slot class="mdw-container__content" part="content"></slot>
          `,
        );
        template.content.appendChild(fragment);
        template.content.querySelector('link').href = new URL('MDWContainer.css', import.meta.url).toString();
      }
      MDWContainer.#template = template;
    }
    return MDWContainer.#template;
  }

  /** @type {string} */
  static TAG_NAME;

  static register(tagname = 'mdw-container') {
    MDWContainer.TAG_NAME = tagname;
    customElements.define(tagname, MDWContainer);
  }
}
