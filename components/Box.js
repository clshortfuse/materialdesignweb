import CustomElement from '../core/CustomElement.js';
import FlexableMixin from '../mixins/FlexableMixin.js';
import ThemableMixin from '../mixins/ThemableMixin.js';

import styles from './Box.css' assert { type: 'css' };

/**
 * Containers are stateless elements that may have a color and ink.
 * They should have simple geometry for rendering and layout.
 */
export default CustomElement
  .mixin(ThemableMixin)
  .mixin(FlexableMixin)
  .extend()
  .observe({
    inline: 'boolean',
    block: {
      type: 'boolean',
      empty: true,
    },
  })
  .css(styles)
  .html/* html */`<slot id=slot type-style={typeStyle}></slot>`
  .autoRegister('mdw-box');
