import CustomElement from '../core/CustomElement.js';

import styles from './Text.css' assert { type: 'css' };
import inkStyles from './TextInks.css' assert { type: 'css' };

export default CustomElement
  .extend()
  .observe({
    ink: 'string',
    block: 'boolean',
    typeStyle: 'string',
  })
  .css(
    styles,
    inkStyles,
  )
  .html/* html */`<slot id=slot></slot>`
  .autoRegister('mdw-text');
