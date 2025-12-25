/* https://m3.material.io/components/dividers/specs */

import CustomElement from '../core/CustomElement.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

/**
 * Dividers are thin lines that group content in lists or other containers
 * @see https://m3.material.io/components/divider/specs
 */
export default CustomElement
  .extend()
  .mixin(ThemableMixin)
  .observe({
    /** When true, render the divider vertically instead of horizontally. */
    vertical: 'boolean',
  })
  .css`
    :host {
      --mdw-ink: var(--mdw-color__outline-variant);
      position: relative;

      display: block;
      overflow: visible;

      box-sizing: border-box;
      block-size: 0;
      inline-size: 100%;

      color: rgb(var(--mdw-ink));
    }

    :host::before {
      content: '';

      display: block;

      box-sizing: border-box;
      block-size: 1px;
      inline-size: auto;

      background-color: currentcolor;
    }

    :host([vertical]) {
      display: inline-flex;
      vertical-align: top;

      block-size: auto;
      min-block-size: 100%;
      inline-size: 0;
    }

    :host([vertical])::before {
      block-size: auto;
      min-inline-size: 1px;
    }

  `
  .autoRegister('mdw-divider');
