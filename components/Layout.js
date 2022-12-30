import Container from './Container.js';
import styles from './Layout.css' assert { type: 'css' };

export default Container
  .extend()
  .observe({
    x: 'string',
    y: 'string',
    column: 'boolean',
    wrap: { value: /** @type {null|'wrap'|'reverse'} */ (null) },
    gap: 'string',
  })
  .css(styles)
  .on('gapChanged', (oldValue, newValue, element) => {
    if (newValue) {
      element.style.setProperty('--mdw-layout__gap', newValue);
    } else {
      element.style.removeProperty('--mdw-layout__gap');
    }
  })
  .autoRegister('mdw-layout');
