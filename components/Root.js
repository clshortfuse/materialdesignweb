/* https://m3.material.io/foundations/layout/applying-layout/window-size-classes */

import CustomElement from '../core/CustomElement.js';

export default CustomElement
  .extend()
  .html`
    <slot id=start name=start></slot>
    <div id=center>
      <slot id=slot></slot>
      <slot id=bottom name=bottom></slot>
    </div>
    <slot id=end name=end></slot>
  `
  .css`
    :host {
      display: flex;
      overflow-x: clip;

      font: var(--mdw-typescale__body-large__font);
      letter-spacing: var(--mdw-typescale__body-large__letter-spacing);
    }

    #center {
      display: block;

      flex: 1;
    }

  `
  .autoRegister('mdw-root');
