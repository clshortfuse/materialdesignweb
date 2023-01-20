import CustomElement from '../core/CustomElement.js';

import inkStyles from './Inks.css' assert { type: 'css' };
import styles from './Span.css' assert { type: 'css' };

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
  .autoRegister('mdw-span');
