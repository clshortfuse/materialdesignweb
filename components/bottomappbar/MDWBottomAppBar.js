import * as AriaToolbar from '../../core/aria/toolbar.js';
import MDWContainer from '../../core/container/MDWContainer.js';

/**
 * Note: FAB does not exist inside because FABs can appear outside.
 * Space will be maintained for the FAB to slide into position. FAB should be
 * next on the DOM, so users can logically tab to it.
 */

export default class MDWBottomAppBar extends MDWContainer {
  constructor() {
    super();
    this.stylesElement.append(MDWBottomAppBar.getStylesFragment().cloneNode(true));
  }

  static register(tagname = 'mdw-bottom-app-bar') {
    customElements.define(tagname, MDWBottomAppBar);
  }

  /** @type {HTMLTemplateElement} */
  static #styles = null;

  /** @return {DocumentFragment} */
  static getStylesFragment() {
    if (!MDWBottomAppBar.#styles) {
      const template = document.createElement('template');
      const fragment = document.createRange().createContextualFragment(
        /* html */`
          <link rel="stylesheet" href="MDWBottomAppBar.css"/>
        `,
      );
      template.content.appendChild(fragment);
      template.content.querySelector('link[href="MDWBottomAppBar.css"]').href = new URL('MDWBottomAppBar.css', import.meta.url).toString();
      MDWBottomAppBar.#styles = template;
    }
    return MDWBottomAppBar.#styles.content;
  }

  connectedCallback() {
    AriaToolbar.attach(this);
  }

  disconnectedCallback() {
    AriaToolbar.detach(this);
  }
}
