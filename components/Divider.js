import styles from './Divider.css' assert { type: 'css' };
import Span from './Span.js';

export default Span
  .extend()
  .observe({
    vertical: 'boolean',
  })
  .css(styles)
  .on('composed', ({ $ }) => $('#slot').remove())
  .autoRegister('mdw-divider');
