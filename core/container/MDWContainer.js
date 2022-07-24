import { CacheableWebComponent } from '../CacheableWebComponent.js';

import styles from './MDWContainer.css' assert { type: 'css' };

export default class MDWContainer extends CacheableWebComponent {
  static elementName = 'mdw-container';

  static get styles() {
    return [...super.styles, styles];
  }

  static get fragments() {
    return [
      ...super.fragments,
      /* html */`
        <div class="mdw-container__elevation" part="elevation" role="presentation"></div>
        <slot class="mdw-container__content" part="content"></slot>
      `,
    ];
  }
}
