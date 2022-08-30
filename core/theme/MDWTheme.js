export default class MDWTheme extends HTMLElement {
  constructor() {
    super();
    this.classList.add('mdw-theme'); // Used for CSS light/dark inheritance theming
    const { content } = MDWTheme.getTemplate();
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadowRoot.prepend(content.cloneNode(true));
  }

  static register(tagname = 'mdw-theme') {
    customElements.define(tagname, MDWTheme);
  }

  /** @type {HTMLTemplateElement} */
  static #template = null;

  /** @return {HTMLTemplateElement} */
  static getTemplate() {
    if (!MDWTheme.#template) {
      let template = /** @type {HTMLTemplateElement} */ (document.getElementById('mdw-overlay-template'));
      if (!template) {
        template = document.createElement('template');
        const fragment = document.createRange().createContextualFragment(
          /* html */`
            <link rel="stylesheet" href="styles.css"/>
          `,
        );
        template.content.appendChild(fragment);
        template.content.querySelector('link').href = new URL('styles.css', import.meta.url).toString();
      }
      MDWTheme.#template = template;
    }
    return MDWTheme.#template;
  }

  /**
   * @param {string} palette
   * @param {''|'light'|'contrast'|'A100'|'A200'|'A400'|'A700'} [tone='']
   * @param {''|'solid'|'high'|'medium'|'inactive'|'divider'} [opacity='']
   * @return {void}
   */
  setInk(palette, tone, opacity) {
    if (tone) {
      if (opacity) {
        this.setAttribute('mdw-ink', `${palette} ${tone} ${opacity}`);
      } else {
        this.setAttribute('mdw-ink', `${palette} ${tone}`);
      }
    } else if (opacity) {
      this.setAttribute('mdw-ink', `${palette} ${opacity}`);
    } else {
      this.setAttribute('mdw-ink', palette);
    }
  }

  /** @return {void} */
  removeInk() {
    this.removeAttribute('mdw-ink');
  }

  /**
   * @param {string} palette
   * @param {''|'alt'|'50'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'} [tone='']
   * @return {void}
   */
  setSurface(palette, tone) {
    if (tone) {
      this.setAttribute('mdw-surface', `${palette} ${tone}`);
    } else {
      this.setAttribute('mdw-surface', palette);
    }
  }

  /** @return {void} */
  removeSurface() {
    this.removeAttribute('mdw-surface');
  }
}
