import styles from './Divider.css' assert { type: 'css' };
import Text from './Text.js';

export default Text
  .extend()
  .observe({
    vertical: 'boolean',
  })
  .css(styles)
  .on('composed', ({ $ }) => $('#slot').remove())
  .autoRegister('mdw-divider');
