import Flex from '../layout/Flex.js';

import styles from './Container.css' assert { type: 'css' };

/**
 * Containers are stateless elements that may have a color and ink.
 * They should have simple geometry for rendering and layout.
 */
export default Flex
  .extend()
  .observe({
    inline: 'boolean',
    block: 'boolean',
  })
  .css(styles)
  .autoRegister('mdw-container');
